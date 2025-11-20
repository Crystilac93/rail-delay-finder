Patch Notes

v1.6.2 - Dashboard & Splash UX Refinements

Status: Ready for Deployment

🎨 Visual & UX Enhancements

Station Defaults Removed: The premium dashboard (DelayRepayChecker.html) no longer pre-fills "Didcot Parkway" and "London Paddington". Input fields now start empty with placeholders to encourage personalized entry.

Splash Page Consistency: Updated the "Get Free Alerts" form on the Splash Page (index.html) to use Time Ranges (Depart After / Depart Before) for both morning and evening commutes, matching the logic and precision of the main dashboard.

TOC Badges: Added visual indicators for Train Operating Companies (TOCs) in the results table.

Dynamic Badging: Automatically detects the TOC code from the API response (e.g., GW, SW, VT).

Color Coding: Displays distinct colored badges for major operators (Dark Green for GWR, Blue for SWR, Red for Avanti/Virgin, Slate for others) to help users quickly identify their service.

v1.6.1 - Subscription Data Capture

Status: Implemented

📧 Feature: Email Alerts (Phase 1)

Subscription Logging: Implemented backend infrastructure to capture user interest.

New API Endpoint: Added POST /api/subscribe.

Frontend Integration: Connected Splash Page form to the backend.

v1.6.0 - Membership Tiers & Splash Page

Status: Implemented

🚀 New Features

Public Splash Page: Introduced index.html as the public landing page.

Premium Dashboard Route: Moved tool to /app.

⚙️ Backend Updates

Route Restructuring: Serving distinct pages for root and app routes.

v1.5.3 - Compliance & Asset Fixes

Status: Implemented

⚖️ Legal & Compliance

Data Attribution: Added footer acknowledging National Rail data.

🎨 UI & Assets

Icon Reference: Fixed train_icon.png pathing.

v1.5.2 - Queue UX Refinements

Status: Implemented

🖥️ Frontend Enhancements

Visual Progress Bar: Added determinate progress bar.

Persistent Search Sessions: Jobs resume after refresh.

Distinct Data Badges: Added "Cached" vs. "Live" indicators.

v1.5.1 - Queue Cache Optimization

Status: Implemented

⚡ Performance

Pre-Queue Cache Check: Server checks Redis before queuing.

v1.5.0 - Asynchronous Queuing System

Status: Implemented

⚡ Architecture Update

Asynchronous Job Queue: Integrated BullMQ/Redis.

v1.4.0 - Performance Optimization & Cleanup

Status: Implemented

⚡ Performance

Server-Side Caching: Implemented Redis caching.

🧹 Codebase Cleanup

Removed Background Worker: Deleted standalone script.

v1.3.0 - Security & Data Optimization

Status: Implemented

🔒 Security

Environment Security: Secured API keys.

Git Hygiene: Added .gitignore.

💾 Data

Dynamic Station Data: Switched to stations.json.

v1.2.0 - Full Stack Architecture

Status: Implemented

🚀 Architecture

Express.js Proxy Server: Added server.mjs.

v1.0.0 - Initial Mobile Release

Status: Legacy / Foundation