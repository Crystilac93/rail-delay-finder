# RefundMyRail 🚆

> Automated rail delay tracking and compensation calculator for UK rail passengers

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

RefundMyRail is a Progressive Web App (PWA) that helps UK rail commuters track delays and calculate potential Delay Repay compensation automatically. Simply enter your journey details, and the app searches National Rail data to identify delays and calculate what you're owed.

## ✨ Features

### Core Functionality
- **Automated Delay Detection**: Searches historical National Rail data for your journeys
- **Compensation Calculator**: Automatically calculates potential Delay Repay amounts based on ticket price and delay duration
- **Direct Claim Links**: One-click access to train operator delay repay forms
- **Journey Analytics**: Track your delay patterns with comprehensive KPI dashboard
- **Subscription Alerts**: (Coming soon) Get notified when delays occur on your regular routes

### User Experience
- **Mobile-Optimized**: Touch-friendly interface with responsive design
- **PWA Installable**: Install as a native app on mobile devices
- **Smart Caching**: Redis-powered caching for fast repeat searches
- **Live Data**: Real-time integration with National Rail API

## 🏗️ Tech Stack

**Frontend**
- HTML5 + Tailwind CSS
- Vanilla JavaScript (ES6+)
- Progressive Web App (PWA) with manifest.json

**Backend**
- Node.js (ESM modules)
- Express.js web server
- BullMQ for background job processing
- Redis (Upstash) for caching and persistent storage

**External APIs**
- National Rail Darwin API (historical journey data)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Redis instance (or Upstash account for cloud Redis)
- National Rail API key ([register here](https://www.nationalrail.co.uk/100296.aspx))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Crystilac93/rail-delay-finder.git
   cd rail-delay-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   RAIL_API_KEY=your_national_rail_api_key_here
   REDIS_URL=your_redis_cache_url_here
   REDIS_URL_DB=your_redis_persistent_storage_url_here
   PORT=3000
   ```

   > **Note**: You need two Redis instances or databases:
   > - `REDIS_URL`: For caching API responses
   > - `REDIS_URL_DB`: For persistent data (subscriptions, user data)
   >
   > For Upstash, the URLs should use `rediss://` protocol (TLS)

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the app**
   
   Open your browser to `http://localhost:3000`

## 📱 Usage

### Basic Journey Search

1. Navigate to the **Dashboard** (`/app`)
2. Enter your **Home Station** and **Work Station**
3. Select **Single Day** or **Week View**
4. Choose your typical departure times
5. Click **Check Performance**

The app will:
- Search National Rail data for matching journeys
- Identify delays of 15+ minutes or cancellations
- Calculate your potential Delay Repay compensation
- Provide direct links to claim forms

### Understanding the Results

**KPI Summary**
- **Potential Refund**: Total compensation you may be eligible for
- **Cancelled**: Number of cancelled journeys
- **Severe/Long/Medium/Short**: Delays categorized by duration (120+, 60+, 30+, 15+ minutes)

**Journey Details Table**
- Each row shows one journey with delay information
- **Claim** button links directly to the operator's delay repay form
- Mobile view shows card-based layout for easier browsing

### Managing Subscriptions

Visit `/manage` to view and manage your delay alert subscriptions (feature in development)

## 🗂️ Project Structure

```
rail-delay-finder/
├── public/                      # Frontend static files
│   ├── index.html              # Landing page with refund estimator
│   ├── DelayRepayChecker.html  # Main dashboard
│   ├── ManageSubscriptions.html # Subscription management
│   ├── mobile.css              # Mobile optimizations
│   ├── config.js               # Frontend configuration
│   ├── station_data.js         # Station lookup utilities
│   ├── stations.json           # UK railway station database
│   ├── manifest.json           # PWA manifest
│   └── train_icon.png          # App icon
├── server.mjs                   # Express server & API endpoints
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (not in repo)
└── PATCH_NOTES.md              # Version history and features
```

## 🔧 Configuration

### Ticket Price

The app uses your annual season ticket price to calculate refund percentages. Configure this in the **Settings** panel (⚙️ icon) on the dashboard.

Default: £7,437.92 (example annual ticket)

### Delay Repay Calculation

Refunds are calculated based on UK rail delay repay schemes:
- **15-29 minutes**: ~25% of journey cost
- **30-59 minutes**: ~50% of journey cost  
- **60-119 minutes**: ~100% of journey cost
- **120+ minutes**: ~100% of journey cost
- **Cancellations**: ~100% of journey cost

> Percentages vary by train operating company. Check with your operator for exact terms.

## 🌐 API Endpoints

### POST `/api/service-metrics`
Fetch journey performance data

**Request Body:**
```json
{
  "date": "YYYY-MM-DD",
  "fromStationCode": "ABC",
  "toStationCode": "XYZ",
  "departAfter": "HH:MM",
  "departBefore": "HH:MM"
}
```

**Response:**
```json
{
  "journeys": [...],
  "fromCache": boolean
}
```

### GET `/api/service-details/:rid`
Get detailed information for a specific journey by RID

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RAIL_API_KEY` | National Rail API key | ✅ Yes |
| `REDIS_URL` | Redis connection string for caching | ✅ Yes |
| `REDIS_URL_DB` | Redis connection string for persistent data | ✅ Yes |
| `PORT` | Server port (default: 3000) | ⚪ Optional |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## ⚠️ Disclaimer

RefundMyRail is an independent tool and is not affiliated with National Rail, Network Rail, or any train operating companies. This tool provides **estimates** for informational purposes only. Always verify eligibility and claim amounts with your specific train operator before submitting a claim.

## 🙏 Acknowledgments

- Contains National Rail data © Rail Delivery Group
- UK Railway station data from National Rail
- Icons and design assets from various open source projects

## 📞 Support

For issues or questions:
- **GitHub Issues**: [Create an issue](https://github.com/Crystilac93/rail-delay-finder/issues)
- **Documentation**: See [PATCH_NOTES.md](./PATCH_NOTES.md) for version history

---

**Built with ❤️ for UK rail commuters who deserve better.**
