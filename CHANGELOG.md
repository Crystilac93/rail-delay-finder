# Changelog

All notable changes to RefundMyRail will be documented in this file.

## [0.1.6] - "Appleford" - 2025-11-22

### ✨ Features
- **Community Savings Goal Tracker**
  - Added eye-catching "November Savings Challenge" section to landing page
  - Interactive progress bar showing community goal progress (£6,700 of £10,000)
  - Animated train emoji that moves along the progress bar
  - Real-time statistics: completion percentage, amount remaining, claims found
  - Community reward incentive: 5 days FREE Premium when goal is reached
  - Premium design with gradient dark theme and pulsing background animations

- **Social Proof Section**
  - New "See What Our Customers Are Finding" showcase section
  - Displays largest current month customer claim (£847.50 for November 2025)
  - Detailed breakdown by delay severity (Major, Moderate, Minor delays)
  - Premium gradient card design with animated glow effects on hover
  - Compelling "Your Turn" call-to-action highlighting real customer success
  - Responsive design with smooth animations

### 🎨 UI/UX Improvements
- **Landing Page Enhancements**
  - Smooth gradient fade from emerald/teal to white between sections
  - Reduced claim amount font size for better responsive behavior
  - Professional visual hierarchy with layered animations
  - Seamless section transitions without hard cutoffs

- **User Settings Page Redesign**
  - Complete visual overhaul to match Dashboard styling
  - Preferences tab now default (instead of Alerts & Subscriptions)
  - Preferences tab moved to left position for better UX
  
- **Settings Card Styling**
  - Grouped settings into clean white cards with emerald icon badges
  - Consistent rounded-2xl borders and subtle shadows throughout
  - Icon-led sections: Ticket (🎫), Locations (📍), Time (🕐)
  - Removed grey backgrounds from station inputs for cleaner look
  - Proper spacing and alignment matching Dashboard design system

- **Enhanced Time Selection**
  - Integrated Flatpickr library for modern time picking
  - Beautiful material green theme matching brand colors
  - 15-minute increment selection for practical time choices
  - Time-only picker (no calendar) with 24-hour format
  - Consistent experience across all browsers (no native time input inconsistencies)
  - Mobile-friendly with keyboard accessibility

- **Number Formatting**
  - Ticket price now displays with thousand separators (e.g., "7,437.92")
  - Auto-formatting on page load from saved preferences
  - Smart formatting: adds commas on blur, removes on focus for easy editing
  - Always maintains 2 decimal places for currency precision
  - Locale-aware formatting (en-GB) for UK currency standards

### 🔧 Technical Improvements
- **Frontend Dependencies**
  - Added Flatpickr CSS and JS via CDN
  - Material Green theme for consistent brand experience
  - Lightweight integration with no build step required

- **Form Enhancement**
  - Changed time inputs from `type="time"` to `type="text"` for Flatpickr
  - Added proper placeholder text ("Select time")
  - Improved padding and spacing for better touch targets
  - Enhanced focus states with emerald ring effects

- **Code Organization**
  - Centralized time picker initialization in `loadPreferences()`
  - Separated formatting logic for price inputs
  - Clean event handler attachment for better maintainability
  - Consistent styling patterns across all preference cards

### 📱 Responsive Design
- **Mobile Optimizations**
  - All new sections fully responsive on mobile devices
  - Touch-friendly time picker interface
  - Proper scaling of large claim amounts
  - Grid layouts adapt from 2-column to single column on small screens

### 🎯 User Experience
- **Visual Consistency**
  - User Settings page now matches Dashboard design language exactly
  - Consistent use of emerald-600 primary color
  - Unified card styling with rounded-2xl borders
  - Matching focus states and transitions throughout

- **Improved Workflow**
  - Default to Preferences tab for quicker access to common settings
  - Intuitive tab ordering (Preferences first, then Alerts)
  - Clear visual feedback on all interactive elements
  - Smooth animations and transitions for premium feel

### 📝 Content Updates
- **Marketing Copy**
  - Compelling social proof with real-looking data
  - Community-focused messaging for engagement
  - Clear value proposition in savings tracker
  - Professional, trustworthy tone throughout

## [0.1.5] - "Culham" - 2025-11-22

### ✨ Features
- **Default Station Preferences**
  - Added "Default Stations" section to User Settings page
  - Implemented autocomplete functionality for Home and Work station selection
  - Station preferences now persist across sessions via localStorage
  - Dashboard automatically pre-populates with saved default stations
  - Seamless integration with existing journey search functionality

### 🎨 UI/UX Improvements
- **Station Autocomplete**
  - Real-time station search with dropdown suggestions
  - Highlights matching text in autocomplete results
  - Displays station names with 3-letter CRS codes
  - Minimum 2 characters required to trigger search
  - Shows top 5 matching results
  - Click outside to dismiss dropdown

- **Settings Integration**
  - Default stations automatically loaded on Dashboard page load
  - Return journey stations automatically synced (reversed route)
  - Stations saved along with other user preferences
  - Visual feedback on successful save

### 🔧 Technical Details
- Stations loaded from `/stations.json` with correct property mapping (`stationName`, `crsCode`)
- Autocomplete implemented in both `ManageSubscriptions.html` and `Dashboard.html`
- localStorage schema extended with: `homeStation`, `homeStationCode`, `workStation`, `workStationCode`
- Dashboard `loadSettings()` function enhanced to populate journey fields
- Return journey synchronization handled via `syncReturnJourney()` function

### 🐛 Bug Fixes
- Fixed inbound journey station codes not being populated from preferences
- Corrected station data property mapping for autocomplete filtering
- Added return journey sync to prevent empty station code API errors

## [0.1.4] - "Cholsey" - 2025-11-21

### ✨ Features
- **User Settings Page Refactoring**
  - Transformed "Manage Alerts" page into comprehensive "User Settings" page
  - Implemented tabbed interface with two sections:
    - **Alerts & Subscriptions**: Manage email alert subscriptions
    - **Preferences**: Configure default settings (ticket price, commute times)
  - Added localStorage integration for cross-page settings synchronization
  - Settings now shared between Dashboard and User Settings page via `railDelaySettings` key

### 🎨 UI/UX Improvements
- **Navigation Updates**
  - Renamed "Alerts" navigation link to "Settings" across all pages
  - Updated `index.html`, `Dashboard.html`, and `auth-ui.js` navigation
  - ManageSubscriptions page now titled "User Settings"
  
- **Settings Management**
  - Centralized user preferences in dedicated Settings page
  - Visual "Saved!" confirmation feedback on preference updates
  - Preserved existing subscription management functionality
  - Maintained Dashboard inline settings panel for backward compatibility

### 🔧 Technical Details
- Shared localStorage schema for settings synchronization
- Retained authentication and route protection
- Settings persist across page navigation
- Both Dashboard and Settings pages can read/write user preferences

## [0.1.3] - "Goring & Streatley" - 2025-11-21

### 🎨 UI/UX Improvements
- **Email Preview Modal**
  - Implemented a new "See Example Email" modal on the landing page.
  - Modal is now fully responsive with a max-width of 800px and max-height of 90vh.
  - Added a dark overlay backdrop that prevents page scrolling when the modal is open.
  - Removed the close button in favor of clicking the overlay or pressing Escape to close.
  - Improved modal styling with cleaner padding and shadow effects.

- **Email Template**
  - Refined the HTML structure of the email preview for better readability.
  - Updated the "Potential Refund" KPI card styling.
  - Cleaned up the table layout for delay reports.

## [0.1.2] - "Pangbourne" - 2025-11-21

### 🔧 Backend Improvements
- **Email Worker Enhancement**
  - Enhanced email worker reliability and error handling
  - Improved duplicate entry handling in weekly delay processing
  - Fixed double-assignment issue in journey results compilation
  - Optimized worker connection management for Redis instances
  - Better separation between cache and database connections

### 📊 Technical Updates
- Refined `email-worker.mjs` for more robust subscription processing
- Improved data structure handling in journey results array
- Enhanced error logging for better diagnostics

## [0.1.1] - "Tilehurst" - 2025-11-21

### 🎨 Dashboard UI Improvements
- **Autocomplete System Rebuild**
  - Completely rebuilt Dashboard autocomplete functionality
  - Implemented clean, maintainable autocomplete matching system from `index.html`
  - Fixed station search reliability issues
  - Enhanced user experience with consistent autocomplete behavior across all pages
  
- **Code Structure**
  - Cleaned up Dashboard codebase for better maintainability
  - Standardized autocomplete implementation across the application
  - Retained all existing journey search, KPI, and results functionality

### 🐛 Bug Fixes
- Fixed autocomplete dropdown positioning and visibility
- Resolved station code matching inconsistencies
- Improved input field validation and user feedback

## [0.0.1] - Pre‑authentication development
## [0.1.0] - "Reading" - 2025-11-21

### 🔐 Authentication System (NEW)
- **Added complete user authentication system**
  - User registration with email/password
  - Secure login with bcrypt password hashing
  - Session-based authentication using Express sessions
  - Rate limiting on login attempts (5 attempts per 15 minutes)
  - Password validation requirements (8+ chars, uppercase, lowercase, number)
  - Email format validation
  
- **Authentication API Endpoints**
  - `POST /api/auth/register` - Create new user account
  - `POST /api/auth/login` - User login
  - `POST /api/auth/logout` - Session cleanup
  - `GET /api/auth/me` - Check authentication status

- **New Authentication Module** (`auth.mjs`)
  - Password hashing and comparison utilities
  - Email and password validation
  - Authentication middleware for protected routes

### 🎨 UI/UX Improvements
- **Renamed Dashboard Page**
  - `DelayRepayChecker.html` → `Dashboard.html`
  - Updated all navigation links to use `/app` route
  
- **Consistent Navigation Across All Pages**
  - Standardized header with logo and navigation links
  - Dynamic user menu showing login status
  - Login/Logout buttons that update based on auth state
  - Consistent footer across all pages
  
- **New Shared Authentication UI** (`auth-ui.js`)
  - Centralized authentication state management
  - Dynamic navigation updates based on login status
  - Automatic route protection for authenticated pages
  - Shared logout functionality

### 🔒 Route Protection
- **Client-Side Route Guards**
  - Dashboard (`/app`) requires authentication
  - ManageSubscriptions (`/manage`) requires authentication
  - Automatic redirect to login with return URL
  - Protected routes redirect unauthenticated users

### 🏗️ Backend Architecture
- **Enhanced Server Configuration**
  - Separate Redis instances for cache and user data
  - Session management with MemoryStore (development)
  - CORS configured for credentials
  - Trust proxy enabled for proper IP detection
  
- **Server Route Mappings**
  - `GET /` → `index.html`
  - `GET /app` → `Dashboard.html`
  - `GET /manage` → `ManageSubscriptions.html`
  - `GET /login` → `login.html`

- **User Data Storage**
  - User accounts stored in Redis (`user:email`)
  - User ID mapping (`userId:id`)
  - Passwords hashed with bcrypt (12 rounds)
  - Subscriptions linked to user accounts

### 📝 Updated Pages
- **index.html** - Integrated auth-ui.js, updated navigation
- **Dashboard.html** - Added route protection, updated navigation
- **ManageSubscriptions.html** - Added route protection, updated navigation
- **login.html** - New dual-mode login/register page with tab interface

### 🔧 Technical Details
- **Session Configuration**
  - 7-day session expiry
  - HttpOnly cookies for security
  - Secure cookies in production
  - SameSite policy configured by environment

- **Redis Data Organization**
  - User data: `user:{email}`, `userId:{id}`
  - Subscriptions: `subscription:{id}`, `user_subs:{email}`, `subscriptions:all`
  - Cache data: Hashed keys for API responses

### ⚠️ Known Issues
- Sessions use MemoryStore (lost on server restart)
  - RedisStore has compatibility issues with Upstash Redis
  - Production deployment will need alternative session storage solution

### 🔄 Migration Notes
- Existing subscriptions remain compatible
- Users need to register/create accounts
- No data migration required for existing subscriptions

## Previous Release
- Marketing overhaul & refund estimator improvements
- (Previous changelog entries preserved)

---

## Version Naming Convention
- **Major.Minor.Patch** with Railway Station Codenames 🚂

### Station Tiers:
- **Patch** (0.0.x): **Local Stations** - Smaller stations along the route
  - Examples: Culham, Cholsey, Goring & Streatley, Pangbourne, Tilehurst
- **Minor** (0.x.0): **Junction Stations** - Important connecting stations
  - Examples: Reading, Didcot Parkway, Swindon, Oxford
- **Major** (x.0.0): **Terminus Stations** - Major London terminals
  - Examples: Paddington, King's Cross, Waterloo, Euston

### Version Types:
- **Major**: Breaking changes or major feature additions (Terminus)
- **Minor**: New features, backwards compatible (Junction)
- **Patch**: Bug fixes and minor improvements (Local)
