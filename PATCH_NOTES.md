Patch Notes

v1.5.0 - Asynchronous Queuing System

Status: Ready for Deployment

⚡ Architecture Update

Asynchronous Job Queue: Integrated BullMQ with Redis to manage search requests.

Problem Solved: Eliminates API rate limit errors (429 Too Many Requests) when multiple users search simultaneously.

Mechanism: Instead of synchronous processing, searches are now enqueued as jobs. A background worker processes them sequentially, respecting a strict rate limit (1 job per 1.5 seconds).

User Experience: The frontend now polls for job completion, showing a "Queuing search..." status instead of hanging or failing immediately.

Shared Benefits: The queue system leverages the existing Redis cache (v1.4.0). If User A searches for a route, the worker caches the result. If User B searches for the same route later, the worker serves it instantly from the cache without hitting the external API or queue delay.

🖥️ Frontend Updates

Polling Logic: Updated DelayRepayChecker.html to handle the new async workflow (Submit -> Get ID -> Poll Status -> Display Result).

Visual Feedback: Added status messages to inform users when their request is queued vs. processing.

v1.4.0 - Performance Optimization & Cleanup

Status: Implemented

⚡ Performance (Caching Strategy)

Server-Side Caching: Implemented a robust caching layer in server.mjs using ioredis.

Persistence: Uses Redis (via Upstash) to store API responses persistently, ensuring the cache survives server restarts and deployments.

Fallback: Automatically falls back to a local .cache/ file system for local development if REDIS_URL is not present.

Logic: Caches serviceMetrics requests only for past dates to ensure data integrity.

Impact: Significantly reduces API calls to the National Rail HSP service.

🧹 Codebase Cleanup

Removed Background Worker: Deleted delay_checker.mjs and the node-notifier dependency to focus the repository purely on the web application architecture.

Simplified Dependencies: Removed unused packages from package.json to keep the build lightweight.

v1.3.0 - Security & Data Optimization

Status: Implemented

🔒 Security & Infrastructure

Environment Security: Removed hardcoded fallback API keys from server.mjs.

Git Hygiene: Added *.pem to .gitignore and cleaned up legacy files.

Production Readiness: server.mjs switches between HTTP (Cloud) and HTTPS (Local).

💾 Data Management

Dynamic Station Data: Replaced hardcoded station list with dynamic stations.json fetch.

v1.2.0 - Full Stack Architecture

Status: Implemented

🚀 Architecture

Express.js Proxy Server: Added server.mjs to proxy API requests and secure keys.

v1.0.0 - Initial Mobile Release

Status: Legacy / Foundation

⚙️ Core Functionality

Search Modes: Support for "Week View" and "Single Day" view.

Delay Calculation: Automatic retrieval and calculation of delay minutes.