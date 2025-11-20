Patch Notes

v1.5.3 - Compliance & Asset Fixes

Status: Ready for Deployment

⚖️ Legal & Compliance

Data Attribution: Added a footer to the main application interface (DelayRepayChecker.html) explicitly acknowledging the use of National Rail data ("Source: Rail Delivery Group") and clarifying non-affiliation. This ensures compliance with open data license terms.

🎨 UI & Assets

Icon Reference: Verified and corrected the train_icon.png reference in the application header to ensure the branding logo loads correctly across all devices.

v1.5.2 - Queue UX Refinements

Status: Implemented

🖥️ Frontend Enhancements

Visual Progress Bar: Replaced the generic spinner with a determinate progress bar during the search process.

Persistent Search Sessions: Improved "Resume on Refresh" capability using localStorage.

Distinct Data Badges: Added clear visual indicators (Blue "Cached Data" vs. Green "Live Data").

Improved Status Messages: Granular feedback text (e.g., "Analyzing 5/10 trains...").

v1.5.1 - Queue Cache Optimization

Status: Implemented

⚡ Performance

Pre-Queue Cache Check: Updated server.mjs to check Redis cache before adding a job to the queue.

Worker Persistence: Worker explicitly saves successful API results to Redis for future instant access.

v1.5.0 - Asynchronous Queuing System

Status: Implemented

⚡ Architecture Update

Asynchronous Job Queue: Integrated BullMQ with Redis to manage search requests and eliminate rate limit errors.

Shared Benefits: Queue system leverages existing Redis cache.

🖥️ Frontend Updates

Polling Logic: Updated frontend to handle async workflow (Submit -> Get ID -> Poll -> Result).

v1.4.0 - Performance Optimization & Cleanup

Status: Implemented

⚡ Performance (Caching Strategy)

Server-Side Caching: Implemented caching layer in server.mjs using ioredis (Redis/Upstash).

Logic: Caches historic data to reduce API calls.

🧹 Codebase Cleanup

Removed Background Worker: Deleted standalone delay_checker.mjs.

v1.3.0 - Security & Data Optimization

Status: Implemented

🔒 Security & Infrastructure

Environment Security: Secured API keys.

Git Hygiene: Cleaned up repo and ignored secrets.

💾 Data Management

Dynamic Station Data: Switched to dynamic stations.json.

v1.2.0 - Full Stack Architecture

Status: Implemented

🚀 Architecture

Express.js Proxy Server: Added server.mjs backend.

v1.0.0 - Initial Mobile Release

Status: Legacy / Foundation