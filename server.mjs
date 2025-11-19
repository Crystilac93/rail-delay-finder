import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import Redis from 'ioredis'; // Import Redis client

// --- Configuration ---
const CONSUMER_KEY = process.env.RAIL_API_KEY;
const REDIS_URL = process.env.REDIS_URL; // New Environment Variable

if (!CONSUMER_KEY) {
    console.error("❌ FATAL ERROR: RAIL_API_KEY is not defined.");
    process.exit(1);
}

const METRICS_URL = "https://api1.raildata.org.uk/1010-historical-service-performance-_hsp_v1/api/v1/serviceMetrics";
const DETAILS_URL = "https://api1.raildata.org.uk/1010-historical-service-performance-_hsp_v1/api/v1/serviceDetails";
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Caching Strategy ---
let redisClient = null;

if (REDIS_URL) {
    console.log("🔌 Connecting to Redis for caching...");
    redisClient = new Redis(REDIS_URL);
    redisClient.on('error', (err) => console.error('Redis Error:', err));
} else {
    console.log("⚠️ No REDIS_URL found. Falling back to local file cache (.cache/)");
    // Ensure local cache dir exists
    const CACHE_DIR = path.join(__dirname, '.cache');
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);
}

// Helper: Get Data from Cache (Abstracts Redis vs File)
async function getFromCache(key) {
    if (redisClient) {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } else {
        // Local File Fallback
        const filePath = path.join(__dirname, '.cache', key + '.json');
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        return null;
    }
}

// Helper: Save Data to Cache (Abstracts Redis vs File)
async function saveToCache(key, data, ttlSeconds = 0) {
    const stringData = JSON.stringify(data);
    if (redisClient) {
        if (ttlSeconds > 0) {
            await redisClient.set(key, stringData, 'EX', ttlSeconds);
        } else {
            await redisClient.set(key, stringData);
        }
    } else {
        // Local File Fallback
        const filePath = path.join(__dirname, '.cache', key + '.json');
        fs.writeFileSync(filePath, stringData);
    }
}

// Helper: Generate Cache Key
function getCacheKey(endpoint, payload) {
    const dataString = endpoint + JSON.stringify(payload);
    return crypto.createHash('md5').update(dataString).digest('hex');
}

// Helper: Check if date is in the past
function isDateInPast(dateStr) {
    if (!dateStr) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API Endpoints ---

app.post('/api/servicemetrics', async (req, res) => {
    const payload = req.body;
    if (!payload.to_date && payload.from_date) payload.to_date = payload.from_date;

    const cacheKey = getCacheKey('metrics', payload);
    
    // 1. Try Cache
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
        console.log(`⚡ Served from Cache: Metrics for ${payload.from_date}`);
        return res.json(cachedData);
    }

    // 2. Fetch API
    try {
        const apiResponse = await fetch(METRICS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-apikey': CONSUMER_KEY },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
             const errorText = await apiResponse.text();
             try { return res.status(apiResponse.status).json(JSON.parse(errorText)); } 
             catch (e) { return res.status(apiResponse.status).json({ error: errorText }); }
        }

        const data = await apiResponse.json();
        res.json(data);

        // 3. Save Cache (Only valid historic data)
        if (isDateInPast(payload.from_date)) {
            await saveToCache(cacheKey, data);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/servicedetails', async (req, res) => {
    const payload = req.body;
    const cacheKey = getCacheKey('details', payload);

    // 1. Try Cache
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
        console.log(`⚡ Served from Cache: Details for RID ${payload.rid}`);
        return res.json(cachedData);
    }

    // 2. Fetch API
    try {
        const apiResponse = await fetch(DETAILS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-apikey': CONSUMER_KEY },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
             try { return res.status(apiResponse.status).json(JSON.parse(errorText)); } 
             catch (e) { return res.status(apiResponse.status).json({ error: errorText }); }
        }

        const data = await apiResponse.json();
        res.json(data); 

        // 3. Save Cache
        // We assume RIDs from the past don't change.
        await saveToCache(cacheKey, data);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'DelayRepayChecker.html'));
});

// --- Start Server ---
if (IS_PRODUCTION) {
    http.createServer(app).listen(PORT, () => {
        console.log(`🚀 Production server running on port ${PORT} (HTTP)`);
    });
} else {
    try {
        const httpsOptions = {
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem')
        };
        https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`🔒 Local development server running on https://localhost:${PORT}`);
        });
    } catch (e) {
        console.warn("⚠️  SSL keys not found. Falling back to HTTP for local dev.");
        http.createServer(app).listen(PORT, () => {
            console.log(`⚠️  Local server running on http://localhost:${PORT}`);
        });
    }
}