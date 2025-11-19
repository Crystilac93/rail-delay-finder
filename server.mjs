import express from 'express';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { Queue, Worker } from 'bullmq'; // Import BullMQ
import Redis from 'ioredis';

// --- Configuration ---
const CONSUMER_KEY = process.env.RAIL_API_KEY;
const REDIS_URL = process.env.REDIS_URL; 

if (!CONSUMER_KEY) {
    console.error("❌ FATAL ERROR: RAIL_API_KEY is not defined.");
    process.exit(1);
}

const METRICS_URL = "https://api1.raildata.org.uk/1010-historical-service-performance-_hsp_v1/api/v1/serviceMetrics";
const DETAILS_URL = "https://api1.raildata.org.uk/1010-historical-service-performance-_hsp_v1/api/v1/serviceDetails";
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// --- Redis Connection ---
// We need a connection object for BullMQ
let connection;
if (REDIS_URL) {
    console.log("🔌 Connecting to Redis...");
    connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
} else {
    console.warn("⚠️ No REDIS_URL. Queueing will not work correctly without Redis.");
    // In a real app, we'd exit or fallback to an in-memory mock, 
    // but for this example, we assume Redis is available as per v1.4.0 setup.
    connection = new Redis({ maxRetriesPerRequest: null }); 
}

// --- Queue Setup ---
const searchQueue = new Queue('rail-search-queue', { connection });

// --- Worker Setup (The Background Processor) ---
// This processes jobs ONE by ONE to respect rate limits
const worker = new Worker('rail-search-queue', async (job) => {
    const { type, payload } = job.data;
    console.log(`⚙️ Processing job ${job.id}: ${type}`);

    // Artificial delay to enforce global rate limit across all users
    await new Promise(r => setTimeout(r, 1500)); 

    let url;
    if (type === 'metrics') url = METRICS_URL;
    else if (type === 'details') url = DETAILS_URL;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-apikey': CONSUMER_KEY },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // If rate limited, throw error so BullMQ retries later automatically
            if (response.status === 429) {
                throw new Error('Rate Limited');
            }
            const text = await response.text();
            throw new Error(`API Error ${response.status}: ${text}`);
        }

        const data = await response.json();
        return data; // This result is stored in Redis by BullMQ

    } catch (error) {
        console.error(`Job ${job.id} failed: ${error.message}`);
        throw error;
    }
}, { 
    connection,
    limiter: {
        max: 1,      // Max 1 job
        duration: 1500 // Per 1500ms (Strict Rate Limiting)
    }
});

// --- Express App ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Helper: Cache Key ---
function getCacheKey(endpoint, payload) {
    const dataString = endpoint + JSON.stringify(payload);
    return crypto.createHash('md5').update(dataString).digest('hex');
}

// --- API Endpoints ---

// 1. Enqueue Metrics Search
app.post('/api/servicemetrics', async (req, res) => {
    const payload = req.body;
    if (!payload.to_date && payload.from_date) payload.to_date = payload.from_date;

    // Check if we already have a cached result in Redis directly (Optimization)
    // Note: BullMQ stores job results, but we can also use our manual cache logic from v1.4
    // For simplicity in v1.5, we rely on BullMQ's job storage.
    
    try {
        const job = await searchQueue.add('metrics', { type: 'metrics', payload });
        res.json({ jobId: job.id, status: 'queued' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Enqueue Details Search
app.post('/api/servicedetails', async (req, res) => {
    const payload = req.body;
    try {
        const job = await searchQueue.add('details', { type: 'details', payload });
        res.json({ jobId: job.id, status: 'queued' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Job Status Endpoint (Polling)
app.get('/api/job/:id', async (req, res) => {
    const jobId = req.params.id;
    try {
        const job = await searchQueue.getJob(jobId);
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const state = await job.getState(); // 'completed', 'failed', 'delayed', 'active', 'waiting'
        
        if (state === 'completed') {
            // Return the actual data
            const result = job.returnvalue;
            res.json({ status: 'completed', data: result });
        } else if (state === 'failed') {
            res.json({ status: 'failed', error: job.failedReason });
        } else {
            // Still working
            res.json({ status: 'pending', state });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'DelayRepayChecker.html'));
});

// --- Start Server ---
if (IS_PRODUCTION) {
    http.createServer(app).listen(PORT, () => {
        console.log(`🚀 Production server (Queue Enabled) running on port ${PORT}`);
    });
} else {
    try {
        const httpsOptions = {
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem')
        };
        https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`🔒 Local server (Queue Enabled) running on https://localhost:${PORT}`);
        });
    } catch (e) {
        console.warn("⚠️  SSL keys not found. Falling back to HTTP.");
        http.createServer(app).listen(PORT, () => {
            console.log(`⚠️  Local server running on http://localhost:${PORT}`);
        });
    }
}