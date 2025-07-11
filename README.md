# 🚀 NASA Space Explorer

A stunning, interactive web application that showcases NASA's vast collection of space data through a modern React frontend and Node.js backend. Explore the cosmos through NASA's official APIs with beautiful visualizations, responsive design, and real-time data.

## ✨ Features

### 🎯 Core Features
- **Astronomy Picture of the Day (APOD)** - Daily stunning space imagery with detailed explanations
- **Mars Exploration** - Browse photos from NASA's Mars rovers (Curiosity, Opportunity, Spirit)
- **NASA Media Library Search** - Search through thousands of NASA images, videos, and audio files
- **Near Earth Objects Tracking** - Monitor asteroids and potentially hazardous objects with interactive charts
- **Real-time Data** - Live connection to NASA's APIs with automatic updates

### 🎨 UI/UX Features
- **Modern Design** - Beautiful space-themed interface with glassmorphism effects
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Interactive Charts** - Data visualizations using Recharts for asteroid tracking
- **Loading States** - Custom loading animations with rocket and star themes
- **Error Handling** - Comprehensive error boundaries and user-friendly error messages
- **Smooth Animations** - Framer Motion powered animations and transitions

### 🔧 Technical Features
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast, modern frontend build tool
- **Custom Hooks** - Reusable data fetching and state management
- **API Caching** - Efficient data fetching with error handling
- **Lazy Loading** - Code splitting for optimal performance
- **Type Safety** - PropTypes for component validation
- **SEO Optimized** - Meta tags and semantic HTML structure

## 🏗️ Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorBoundary.
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── APODPage.tsx
│   │   ├── MarsPage.tsx
│   │   ├── SearchPage.tsx
│   │   └── AsteroidsPage.
│   ├── hooks/
│   │   └── useNasaData.ts
│   ├── services/
│   │   └── api.ts
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
│   ├── vite.config.ts
│   ├── .env
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- NASA API Key (optional - DEMO_KEY provided for testing)

### Setup
```bash
# Install dependencies
npm install

# Start the React development server with Vite
npm run dev
```

The application will start on `http://localhost:3000`

### 4. Access the Application
Open your browser and navigate to `http://localhost:3000` to start exploring space!

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# NASA API Configuration
NASA_API_KEY=your_nasa_api_key_here
NASA_IMAGES_API_BASE_URL=https://images-api.nasa.gov
NASA_API_BASE_URL=https://api.nasa.gov
PORT=5000
NODE_ENV=development
```

## 🎨 Key Technologies
- **React 18.2.0** - Modern React with hooks
- **Vite 5.0.10** - Fast, modern frontend build tool
- **React Router 6.15.0** - Client-side routing
- **Recharts 2.8.0** - Interactive data visualizations
- **Lucide React 0.279.0** - Beautiful icons
- **Framer Motion 10.16.4** - Smooth animations
- **Axios 1.5.0** - HTTP client for API calls
- **Tailwind CSS 3.4.17** - As a CSS Framework

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server with Vite
npm run build    # Create production build
npm run preview  # Preview production build locally
npm run test     # Run tests with Vitest
```

### Code Structure

**Custom Hooks:**
- `useAPOD` - Astronomy Picture of the Day data
- `useMarsPhotos` - Mars rover photos
- `useNearEarthObjects` - Asteroid tracking data
- `useNasaSearch` - Media library search
- `useHealthCheck` - Backend health monitoring

**Components:**
- Modular, reusable components
- Responsive design patterns
- Error boundaries for graceful failures
- Loading states for better UX

### 🚀 Deployment (Vercel/Netlify)

1. **Build Command:** `npm run build`
2. **Output Directory:** `build`
3. **Environment Variables:**
```
VITE_API_URL=https://your-backend-url.com/api
```

## 🎯 Features Walkthrough

### 🌌 Home Page
- Hero section with animated background
- Featured APOD image
- Interactive feature cards
- Live data status indicator
- Responsive statistics dashboard

### 📸 APOD Explorer
- Daily space imagery with explanations
- Date picker for historical images
- High-resolution image downloads
- Social sharing capabilities
- Mobile-optimized viewing

### 🔴 Mars Exploration
- Multi-rover photo browsing
- Camera-specific filtering
- Sol (Mars day) navigation
- Rover status and statistics
- Grid layout with hover effects

### 🔍 Media Search
- Full-text search across NASA media
- Media type filtering
- Infinite scroll results
- Image optimization
- Detailed metadata display

### ☄️ Asteroid Tracking
- Real-time near-Earth object data
- Interactive charts and visualizations
- Hazard assessment indicators
- Date range filtering
- Detailed asteroid information

## 🎨 Design Philosophy

### Visual Design
- **Space Theme** - Dark backgrounds with cosmic colors
- **Glassmorphism** - Translucent cards with backdrop blur
- **Gradient Accents** - Cyan to orange gradients for highlights
- **Typography** - Inter font for modern readability

### User Experience
- **Progressive Loading** - Skeleton screens and loading states
- **Error Resilience** - Graceful error handling and recovery
- **Accessibility** - Semantic HTML and keyboard navigation
- **Performance** - Code splitting and optimized images

## 🔒 Security Features

- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin request validation
- **Helmet Security** - HTTP security headers
- **Input Validation** - Server-side parameter validation
- **Error Handling** - Secure error messages

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Breakpoints** - 480px, 768px, 1024px, 1200px
- **Flexible Grids** - CSS Grid and Flexbox layouts
- **Touch Interactions** - Mobile-friendly controls
- **Performance** - Optimized images and lazy loading

### Coding Standards
- ESLint configuration for code quality
- Prettier for code formatting
- Conventional commits for clarity
- Component-driven development
