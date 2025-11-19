Patch Notes

v1.4.0 - Performance Optimization & Cleanup

Status: Ready for Deployment

⚡ Performance (Caching Strategy)

Server-Side Caching: Implemented a robust caching layer in server.mjs using ioredis.

Persistence: Uses Redis (via Upstash) to store API responses persistently, ensuring the cache survives server restarts and deployments.

Fallback: Automatically falls back to a local .cache/ file system for local development if REDIS_URL is not present.

Logic: Caches serviceMetrics requests only for past dates to ensure data integrity, preventing incomplete "today" data from being stored permanently. serviceDetails are cached by RID.

Impact: Significantly reduces API calls to the National Rail HSP service, saving quota and improving response times for repeat queries.

🧹 Codebase Cleanup

Removed Background Worker: Deleted delay_checker.mjs and the node-notifier dependency to focus the repository purely on the web application architecture.

Simplified Dependencies: Removed unused packages from package.json to keep the build lightweight.

v1.3.0 - Security & Data Optimization

Status: Implemented

🔒 Security & Infrastructure

Environment Security: Removed hardcoded fallback API keys from server.mjs to ensure fail-secure behavior in production.

Git Hygiene:

Added *.pem to .gitignore to prevent leaking local SSL certificates.

Removed legacy Old/ directory and duplicate root assets (train_icon.png, train_icon.ico) to streamline the repository.

Production Readiness: server.mjs now correctly switches between HTTP (for cloud/Render) and HTTPS (for local development) based on NODE_ENV.

💾 Data Management

Dynamic Station Data: Replaced the hardcoded station list in station_data.js with a dynamic fetch from stations.json.

Benefit: Decouples data from logic, making it easier to update station lists without modifying application code.

Efficiency: The frontend now loads and processes the full UK station dataset at runtime, mapping only the necessary fields (name, code) for the autocomplete system.

v1.2.0 - Full Stack Architecture

Status: Implemented

🚀 Architecture

Express.js Proxy Server: Added server.mjs.

Serves the frontend statically from the public/ directory.

Proxies API requests (/api/servicemetrics, /api/servicedetails) to raildata.org.uk to handle CORS and secure the API key.

📱 UI & UX (Frontend - v1.1 Refinements)

Search History: Added persistent history of recent searches (stored in LocalStorage).

Settings Panel: Refined slide-out panel for configuring Home/Work stations and annual ticket prices.

Autocomplete: Robust station search with CRS code lookup.

v1.0.0 - Initial Mobile Release

Status: Legacy / Foundation

⚙️ Core Functionality

Search Modes: Support for "Week View" and "Single Day" view.

Delay Calculation: Automatic retrieval and calculation of delay minutes vs. scheduled arrival.

Refund Logic: Tiered refund estimation (25% to 100%+) based on season ticket calculations.