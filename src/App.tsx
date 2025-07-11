import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Loading from './components/Loading'
import './index.css'

// Lazy load pages for better performance
const APODPage = React.lazy(() => import('./pages/APODPage'))
const MarsPage = React.lazy(() => import('./pages/MarsPage'))
const SearchPage = React.lazy(() => import('./pages/SearchPage'))
const AsteroidsPage = React.lazy(() => import('./pages/AsteroidsPage'))
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'))
import { ToastContainer } from 'react-toastify'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className='App'>
          <Navigation />
          <ToastContainer />
          <main className='main-content'>
            <React.Suspense fallback={<Loading type='rocket' size='large' fullScreen />}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/apod' element={<APODPage />} />
                <Route path='/mars' element={<MarsPage />} />
                <Route path='/search' element={<SearchPage />} />
                <Route path='/asteroids' element={<AsteroidsPage />} />
                <Route path='/news/:nasaId' element={<NewsDetail />} />
              </Routes>
            </React.Suspense>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
