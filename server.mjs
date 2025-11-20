import express from 'express';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { Queue, Worker } from 'bullmq'; 
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

// --- Redis Setup ---
let connection;
if (REDIS_URL) {
    console.log("🔌 Connecting to Redis...");
    connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
} else {
    connection = new Redis({ maxRetriesPerRequest: null }); 
}

// --- Helper Functions ---
function getCacheKey(endpoint, payload) {
    const dataString = endpoint + JSON.stringify(payload);
    return crypto.createHash('md5').update(dataString).digest('hex');
}

function isDateInPast(dateStr) {
    if (!dateStr) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
}

// --- Queue Setup ---
const searchQueue = new Queue('rail-search-queue', { connection });

// --- Worker Setup ---
const worker = new Worker('rail-search-queue', async (job) => {
    const { type, payload, cacheKey } = job.data;
    console.log(`⚙️ Processing job ${job.id}: ${type}`);

    // Rate Limit
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
            if (response.status === 429) throw new Error('Rate Limited');
            const text = await response.text();
            throw new Error(`API Error ${response.status}: ${text}`);
        }

        const data = await response.json();
        
        // Save to Redis Cache (Custom Persistence)
        if (type === 'details' || (type === 'metrics' && isDateInPast(payload.from_date))) {
             const stringData = JSON.stringify(data);
             await connection.set(cacheKey, stringData); 
             console.log(`💾 Cached result for ${cacheKey}`);
        }

        return data; 

    } catch (error) {
        console.error(`Job ${job.id} failed: ${error.message}`);
        throw error;
    }
}, { 
    connection,
    limiter: { max: 1, duration: 1500 }
});

// --- Express App ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
// Serve static files BUT we will handle index.html and DelayRepayChecker.html manually via routes
app.use(express.static(path.join(__dirname, 'public'), { index: false })); 

// --- API Endpoints (Same as before) ---

async function handleRequest(type, payload, res) {
    const cacheKey = getCacheKey(type, payload);

    // 1. Check Custom Redis Cache
    try {
        const cachedRaw = await connection.get(cacheKey);
        if (cachedRaw) {
            console.log(`⚡ Cache Hit: Skipping queue for ${type}`);
            return res.json({ jobId: `cached:${cacheKey}`, status: 'completed' });
        }
    } catch (e) {
        console.error("Redis Error:", e);
    }

    // 2. Enqueue if not cached
    try {
        const job = await searchQueue.add(type, { type, payload, cacheKey });
        res.json({ jobId: job.id, status: 'queued' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

app.post('/api/servicemetrics', async (req, res) => {
    const payload = req.body;
    if (!payload.to_date && payload.from_date) payload.to_date = payload.from_date;
    await handleRequest('metrics', payload, res);
});

app.post('/api/servicedetails', async (req, res) => {
    await handleRequest('details', req.body, res);
});

app.get('/api/job/:id', async (req, res) => {
    const jobId = req.params.id;

    if (jobId.startsWith('cached:')) {
        const cacheKey = jobId.split('cached:')[1];
        const cachedRaw = await connection.get(cacheKey);
        if (cachedRaw) {
             const data = JSON.parse(cachedRaw);
             return res.json({ status: 'completed', data: { ...data, _fromCache: true } });
        } else {
            return res.status(404).json({ error: 'Cache expired' });
        }
    }

    try {
        const job = await searchQueue.getJob(jobId);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        const state = await job.getState(); 
        
        if (state === 'completed') {
            const result = job.returnvalue;
            res.json({ status: 'completed', data: result });
        } else if (state === 'failed') {
            res.json({ status: 'failed', error: job.failedReason });
        } else {
            res.json({ status: 'pending', state });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Routes ---

// 1. Splash Page (Root)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Premium App (Dashboard)
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'DelayRepayChecker.html'));
});

// --- Start Server ---
if (IS_PRODUCTION) {
    http.createServer(app).listen(PORT, () => {
        console.log(`🚀 Production server running on port ${PORT}`);
    });
} else {
    try {
        const httpsOptions = { key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') };
        https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`🔒 Local server running on https://localhost:${PORT}`);
        });
    } catch (e) {
        console.warn("⚠️ SSL keys not found. Falling back to HTTP.");
        http.createServer(app).listen(PORT, () => {
            console.log(`⚠️ Local server running on http://localhost:${PORT}`);
        });
    }
}