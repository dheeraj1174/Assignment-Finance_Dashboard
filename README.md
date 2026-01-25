# FinBoard - Customizable Finance Dashboard

FinBoard is a powerful, customizable finance dashboard that allows you to track real-time data from various financial APIs. Build your own monitoring station with stocks, crypto, forex, and economic indicators.

<!-- ![FinBoard Dashboard](https://github.com/user-content/finboard-dashboard.png) -->

## Features

- **Customizable Widgets**: Create cards, tables, and charts connected to any JSON API
- **Real-time Updates**: Configurable refresh intervals for live data monitoring
- **Drag-and-Drop**: Organize your dashboard layout exactly how you want it
- **Data Persistence**: Your configuration is automatically saved to your browser
- **Theme Support**: Seamlessly switch between Light and Dark modes
- **Export/Import**: Share or backup your dashboard configurations

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/finboard.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Adding a Widget

1. Click the **+ Add Widget** button in the header.
2. Enter a name for your widget (e.g., "Bitcoin Price").
3. Paste a valid API URL (e.g., `https://api.coinbase.com/v2/exchange-rates?currency=BTC`).
4. Click **Test API** to verify the connection.
5. Once verified, select the fields you want to display.
6. Choose a display mode (Card, Table, or Chart).
7. Click **Add Widget** to add it to your dashboard.

### Recommended APIs

- **Coinbase**: `https://api.coinbase.com/v2/exchange-rates?currency=BTC`
- **Financial Modeling Prep**: `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=YOUR_KEY`
- **Coincap**: `https://api.coincap.io/v2/assets`

## Technologies Used

- **Next.js 13+** (App Router)
- **TypeScript**
- **Redux Toolkit** (State Management)
- **Tailwind CSS** (Styling)
- **Recharts** (Data Visualization)
- **React Beautiful DnD** (Drag and Drop)
- **Axios** (API Requests)

## License

This project is licensed under the MIT License.
