import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Rocket,
  Camera,
  Globe,
  Search,
  Satellite,
  Star,
  ArrowRight,
  Sparkles,
  ChevronRight,
  LucideIcon,
} from 'lucide-react'
import Loading from '../components/Loading'
import { NewsItem } from '../types/api'
import { useNasaNews, useNasaStats } from '@/hooks/nasa-data.ts'

// Component props
export interface PageProps {
  className?: string
  style?: React.CSSProperties
}

interface AnimatedStats {
  totalMissions: number
  photosToday: number
  nearEarthObjects: number
  daysActive: number
}

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  link: string
  color: string
}

const Home: React.FC<PageProps> = () => {
  const navigate = useNavigate()
  const [animatedStats, setAnimatedStats] = useState<AnimatedStats>({
    totalMissions: 0,
    photosToday: 0,
    nearEarthObjects: 0,
    daysActive: 0,
  })

  // Fetch real data from APIs
  const { data: stats, isLoading: statsLoading, error: statsError } = useNasaStats()
  const { data: news, isLoading: newsLoading, error: newsError } = useNasaNews()

  const [initialLoading, setInitialLoading] = useState<boolean>(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Animate stats when real data is loaded
    if (stats && !statsLoading) {
      animateStats()
    }
  }, [stats, statsLoading])

  const animateStats = (): void => {
    const targets = {
      totalMissions: stats?.totalMissions || 142,
      photosToday: stats?.photosToday || 25,
      nearEarthObjects: stats?.nearEarthObjects || 12,
      daysActive: stats?.daysActive || 1847,
    }

    Object.keys(targets).forEach((key) => {
      let start = 0
      const end = targets[key as keyof typeof targets]
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          start = end
          clearInterval(timer)
        }
        setAnimatedStats((prev) => ({
          ...prev,
          [key]: Math.floor(start),
        }))
      }, 16)
    })
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30)
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
  }

  const handleNewsClick = (newsItem: NewsItem): void => {
    navigate(`/news/${newsItem.id}`)
  }

  const features: Feature[] = [
    {
      icon: Camera,
      title: 'Astronomy Picture of the Day',
      description:
        'Discover breathtaking images of our universe with detailed explanations from NASA astronomers.',
      link: '/apod',
      color: 'text-space-cyan',
    },
    {
      icon: Globe,
      title: 'Mars Exploration',
      description:
        "Explore the Red Planet through the eyes of NASA's rovers and see the latest discoveries.",
      link: '/mars',
      color: 'text-space-orange',
    },
    {
      icon: Search,
      title: 'NASA Media Library',
      description:
        "Search through thousands of images, videos, and audio files from NASA's vast collection.",
      link: '/search',
      color: 'text-space-amber',
    },
    {
      icon: Satellite,
      title: 'Near Earth Objects',
      description:
        'Track asteroids and comets that pass close to Earth with real-time data and visualizations.',
      link: '/asteroids',
      color: 'text-space-purple',
    },
  ]

  if (initialLoading) {
    return <Loading type='rocket' message='Initializing NASA Explorer...' fullScreen />
  }

  return (
    <div className='min-h-screen bg-space-gradient text-white'>
      {/* Hero Section */}
      <section className='relative pt-20 pb-12 px-4 text-center overflow-hidden'>
        <div className='container'>
          <div className='relative z-10'>
            <div className='mb-6'>
              <Sparkles className='w-16 h-16 text-space-cyan mx-auto mb-4 animate-twinkle' />
            </div>
            <h1 className='text-4xl md:text-6xl font-bold mb-6 text-gradient-cyan-orange animate-fade-in-up'>
              NASA Space Explorer
            </h1>
            <p
              className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up'
              style={{ animationDelay: '0.2s' }}
            >
              Discover the wonders of space through NASA's cutting-edge missions, stunning imagery,
              and groundbreaking discoveries.
            </p>
            <div
              className='flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up'
              style={{ animationDelay: '0.4s' }}
            >
              <Link to='/apod' className='btn btn-primary'>
                <Camera size={20} />
                Explore APOD
                <ArrowRight size={20} />
              </Link>
              <Link to='/mars' className='btn btn-secondary'>
                <Globe size={20} />
                Visit Mars
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-space-cyan rounded-full animate-twinkle'></div>
          <div
            className='absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-twinkle'
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className='absolute bottom-1/4 left-1/6 w-3 h-3 bg-space-orange rounded-full animate-twinkle'
            style={{ animationDelay: '0.5s' }}
          ></div>
          <div
            className='absolute top-1/2 right-1/4 w-2 h-2 bg-space-purple rounded-full animate-twinkle'
            style={{ animationDelay: '1.5s' }}
          ></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-12 px-4 bg-white/5'>
        <div className='container'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold text-space-cyan mb-2'>
                {statsLoading ? '---' : `${animatedStats.totalMissions}+`}
              </div>
              <div className='text-sm md:text-base text-gray-400 uppercase tracking-wide'>
                Total Missions
              </div>
              {statsError && <div className='text-red-400 text-xs mt-1'>Error loading</div>}
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold text-space-orange mb-2'>
                {statsLoading ? '---' : `${animatedStats.photosToday}+`}
              </div>
              <div className='text-sm md:text-base text-gray-400 uppercase tracking-wide'>
                Photos Today
              </div>
              {statsError && <div className='text-red-400 text-xs mt-1'>Error loading</div>}
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold text-space-amber mb-2'>
                {statsLoading ? '---' : `${animatedStats.nearEarthObjects}+`}
              </div>
              <div className='text-sm md:text-base text-gray-400 uppercase tracking-wide'>
                Near Earth Objects
              </div>
              {statsError && <div className='text-red-400 text-xs mt-1'>Error loading</div>}
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold text-space-purple mb-2'>
                {statsLoading ? '---' : `${animatedStats.daysActive}+`}
              </div>
              <div className='text-sm md:text-base text-gray-400 uppercase tracking-wide'>
                Days Active
              </div>
              {statsError && <div className='text-red-400 text-xs mt-1'>Error loading</div>}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-4'>
        <div className='container'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gradient-cyan-orange'>
              Explore the Universe
            </h2>
            <p className='text-gray-300 max-w-2xl mx-auto'>
              Journey through space with our comprehensive collection of NASA's most exciting
              missions and discoveries.
            </p>
          </div>

          <div className='grid-auto-fit'>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className='card group'>
                  <div className='text-center'>
                    <div
                      className={`w-16 h-16 mx-auto mb-4 ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={64} />
                    </div>
                    <h3 className='text-xl font-bold mb-3 text-white'>{feature.title}</h3>
                    <p className='text-gray-300 mb-6 leading-relaxed'>{feature.description}</p>
                    <Link
                      to={feature.link}
                      className='inline-flex items-center gap-2 text-space-cyan hover:text-white transition-colors duration-300'
                    >
                      Explore Now
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className='py-16 px-4 bg-white/5'>
        <div className='container'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gradient-cyan-orange'>
              Latest Space News
            </h2>
            <p className='text-gray-300 max-w-2xl mx-auto'>
              Stay updated with the latest discoveries and missions from NASA and the space
              community.
            </p>
          </div>

          {newsLoading ? (
            <div className='text-center'>
              <Loading type='dots' message='Loading latest news...' />
            </div>
          ) : newsError ? (
            <div className='text-center text-red-400'>
              <p>Error loading news: {newsError.message}</p>
            </div>
          ) : (
            <div className='grid gap-6 md:grid-cols-3'>
              {news && news.length > 0 ? (
                news.map((item, index) => (
                  <div
                    key={index}
                    className='glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer'
                    onClick={() => handleNewsClick(item)}
                  >
                    <div className='flex items-center gap-2 mb-3'>
                      <span className='px-3 py-1 text-xs font-semibold bg-space-cyan/20 text-space-cyan rounded-full'>
                        {item.source}
                      </span>
                      <span className='text-sm text-gray-400'>{formatDate(item.date)}</span>
                    </div>
                    <h3 className='text-lg font-semibold mb-3 text-white hover:text-space-cyan transition-colors duration-300'>
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p className='text-gray-300 text-sm mb-3 line-clamp-3'>
                        {item.summary.substring(0, 120)}...
                      </p>
                    )}
                    <div className='flex items-center justify-between'>
                      <span className='text-xs text-gray-500'>{item.source || 'NASA'}</span>
                      <div className='flex items-center gap-2 text-space-cyan hover:text-white transition-colors duration-300'>
                        <span className='text-sm'>Read More</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center text-gray-400 col-span-full'>
                  <p>No news available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-16 px-4'>
        <div className='container'>
          <div className='text-center bg-gradient-to-r from-space-cyan/20 to-space-purple/20 rounded-3xl p-8 md:p-12 border border-white/10'>
            <Rocket className='w-16 h-16 text-space-cyan mx-auto mb-6 animate-float' />
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gradient-cyan-orange'>
              Ready to Explore?
            </h2>
            <p className='text-gray-300 mb-8 max-w-2xl mx-auto'>
              Join millions of space enthusiasts discovering the cosmos through NASA's incredible
              missions and data.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/apod' className='btn btn-primary'>
                <Star size={20} />
                Start Exploring
              </Link>
              <Link to='/search' className='btn btn-outline'>
                <Search size={20} />
                Search Library
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
