Patch Notes

v1.6.0 - Membership Tiers & Splash Page

Status: Ready for Deployment

🚀 New Features

Public Splash Page: Introduced a new index.html as the public landing page.

Features a modern marketing design promoting the app's value proposition.

Includes a mock email subscription form for future lead generation.

Provides clear navigation to the Premium Dashboard.

Premium Dashboard Route: Moved the main application tool to the /app route.

This separates the public marketing face from the functional tool, paving the way for future authentication and user accounts.

⚙️ Backend Updates

Route Restructuring: Updated server.mjs to serve:

GET / -> public/index.html (Splash Page)

GET /app -> public/DelayRepayChecker.html (Premium App)

v1.5.3 - Compliance & Asset Fixes

Status: Implemented

⚖️ Legal & Compliance

Data Attribution: Added footer acknowledging National Rail data source.

🎨 UI & Assets

Icon Reference: Fixed train_icon.png pathing.

v1.5.2 - Queue UX Refinements

Status: Implemented

🖥️ Frontend Enhancements

Visual Progress Bar: Added determinate progress bar for search jobs.

Persistent Search Sessions: Jobs resume automatically after page refresh.

Distinct Data Badges: Added "Cached" vs. "Live" data indicators.

v1.5.1 - Queue Cache Optimization

Status: Implemented

⚡ Performance

Pre-Queue Cache Check: Server checks Redis cache before queuing jobs to provide instant results.

v1.5.0 - Asynchronous Queuing System

Status: Implemented

⚡ Architecture Update

Asynchronous Job Queue: Integrated BullMQ with Redis to manage search requests.

v1.4.0 - Performance Optimization & Cleanup

Status: Implemented

⚡ Performance (Caching Strategy)

Server-Side Caching: Implemented Redis caching for historic data.

🧹 Codebase Cleanup

Removed Background Worker: Deleted standalone script.

v1.3.0 - Security & Data Optimization

Status: Implemented

🔒 Security & Infrastructure

Environment Security: Removed hardcoded keys.

Git Hygiene: Added .gitignore rules.

v1.2.0 - Full Stack Architecture

Status: Implemented

🚀 Architecture

Express.js Proxy Server: Added server.mjs.

v1.0.0 - Initial Mobile Release

Status: Legacy / Foundation