# Arizona Energy Map 🌵⚡

An interactive heat map visualizing electricity usage and sustainability metrics across Arizona counties to support data-driven decisions for climate preservation and energy policy.

![Arizona Energy Map](https://img.shields.io/badge/Status-Live-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.4.5-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-teal)

## 🎯 Purpose

This application provides stakeholders, policymakers, and citizens with an intuitive way to:
- **Visualize electricity consumption** patterns across Arizona counties
- **Assess renewable energy adoption** and sustainability scores
- **Make informed decisions** about energy policy and climate preservation
- **Identify opportunities** for sustainable energy initiatives

## ✨ Features

### 🗺️ Interactive Map
- **Zoom and Pan**: Full map navigation with smooth controls
- **County Selection**: Click any county for detailed information
- **Multiple Views**: Switch between Consumption, Renewables, and Sustainability metrics
- **Color-coded Heat Map**: Visual representation of data intensity

### 📊 Data Visualization
- **Real-time Statistics**: Live energy consumption with 30-second updates
- **County Details**: Comprehensive breakdowns including:
  - Population and electricity consumption
  - Renewable energy percentage and capacity
  - Primary energy sources with icons
  - Carbon emissions and sustainability scores
  - Residential electricity rates
  - Major cities served
  - **Real-time Grid Status**: Live demand levels and renewable generation
  - **Linked Data Sources**: Direct links to official government and utility sources

### ⚡ Real-time Features
- **Live EIA Data**: Real electricity data from U.S. Energy Information Administration API
- **Grid Status Monitoring**: Real-time demand levels from Arizona balancing authorities (AZPS, SRP, WALC)
- **5-minute Cached Updates**: Efficient API usage with automatic caching
- **Automatic Fallback**: Seamless switch to simulated data if API unavailable
- **Connection Indicators**: Visual status showing live data connectivity
- **Real Grid Stress**: Calculated from actual demand vs generation ratios

### 🎨 User Experience
- **Modern Design**: Clean, responsive interface with backdrop blur effects
- **Accessibility**: Clear color schemes and readable typography
- **Performance**: Fast loading with optimized data structures
- **Mobile Friendly**: Responsive design for all screen sizes

## 🏗️ Technology Stack

- **Frontend**: React 18 with Vite and TypeScript
- **Type Safety**: Full TypeScript implementation with strict typing
- **Mapping**: React-Leaflet with OpenStreetMap tiles
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **UI Components**: Custom shadcn/ui-inspired components
- **Real-time Services**: Custom TypeScript service architecture

## 📊 Data Sources

Our application uses verified data from multiple reliable sources:

- **U.S. Energy Information Administration (EIA)** - 2024 electricity data
- **Arizona Corporation Commission** - Rate filings and regulatory data
- **Arizona Public Service Company** - 2024 annual reports
- **Tucson Electric Power** - 2024 sustainability reports
- **U.S. Census Bureau** - 2024 population estimates
- **Arizona Department of Environmental Quality** - 2024 emissions data
- **DOE Loan Programs Office** - APS clean energy financing data

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jackdougle/sunhacks-2025.git
   cd sunhacks-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up real-time data (optional but recommended)**

   a. Get a free EIA API key (30 seconds):
   - Visit: https://www.eia.gov/opendata/
   - Register with your email
   - Copy your API key

   b. Configure environment:
   ```bash
   cp .env.example .env.local
   # Add your API key to .env.local:
   # VITE_EIA_API_KEY=your_api_key_here
   # VITE_ENABLE_LIVE_DATA=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

### TypeScript Commands
```bash
npm run type-check  # Type checking without emission
```

## 📈 Key Metrics Displayed

### County-Level Data
- **Electricity Consumption**: Total MWh and per capita usage
- **Renewable Energy**: Percentage and capacity in MW
- **Sustainability Score**: 0-100 composite rating
- **Carbon Emissions**: Annual CO₂ output in tons
- **Electricity Rates**: Average residential rates in ¢/kWh
- **Demographics**: Population and major cities

### State-Level Aggregations
- **Total Consumption**: 71.8M MWh annually
- **Population Served**: 7.4M residents
- **Renewable Average**: 26.1% statewide
- **Total Emissions**: 38.9M tons CO₂

## 🎯 Sustainability Features

### Smart Recommendations
Each county panel includes tailored sustainability opportunities:
- Solar capacity expansion suggestions
- Energy efficiency program recommendations
- Coal-to-renewable transition guidance
- Residential solar incentive expansion

### Decision Support
- **Heat Map Visualization**: Quickly identify high-consumption areas
- **Comparative Analysis**: Easy county-to-county comparisons
- **Trend Identification**: Spot patterns in renewable adoption
- **Policy Insights**: Data-driven recommendations for improvement

## 🔄 Data Updates

The application is designed to accommodate regular data updates:
- **Quarterly Updates**: EIA and utility company reports
- **Annual Updates**: Comprehensive sustainability assessments
- **Real-time Integration**: Ready for live data feeds

## 🤝 Contributing

We welcome contributions to improve Arizona's energy future:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Arizona utilities** for transparency in energy reporting
- **EIA** for comprehensive energy data
- **Open-source community** for the amazing tools and libraries
- **Climate advocates** working toward a sustainable future

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Contact the development team
- Review the documentation

---

**Built with ❤️ for Arizona's sustainable energy future**