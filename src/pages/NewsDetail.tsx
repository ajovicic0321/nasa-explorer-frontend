import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Tag, ExternalLink } from 'lucide-react'
import Loading from '../components/Loading'
import { NASAMediaItem } from '@/types/api'
import { useNasaSearchMutation } from '@/hooks/nasa-data.ts'

// Component props
export interface NewsDetailProps {
  className?: string
  style?: React.CSSProperties
}

const NewsDetail: React.FC<NewsDetailProps> = () => {
  const { nasaId } = useParams()
  const navigate = useNavigate()
  const [newsItem, setNewsItem] = useState<NASAMediaItem | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { data: searchData, isPending: searchLoading, mutate: search } = useNasaSearchMutation()

  useEffect(() => {
    if (nasaId) {
      search({
        q: nasaId,
      })
    }
  }, [nasaId, search])

  useEffect(() => {
    if (searchData && searchData.collection && searchData.collection.items) {
      const item = searchData.collection.items.find(
        (item) => item.data && item.data.length > 0 && item.data[0].nasa_id === nasaId,
      )

      if (item) {
        setNewsItem(item)
      } else {
        setError('News item not found')
      }
      setLoading(false)
    }
  }, [searchData, nasaId])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading || searchLoading) {
    return <Loading type='dots' message='Loading news details...' fullScreen />
  }

  if (error) {
    return (
      <div className='min-h-screen bg-space-gradient text-white pt-20'>
        <div className='container px-4'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold mb-4'>News Not Found</h1>
            <p className='text-gray-300 mb-6'>{error}</p>
            <button onClick={() => navigate('/')} className='btn btn-primary'>
              <ArrowLeft size={20} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!newsItem || !newsItem.data || newsItem.data.length === 0) {
    return (
      <div className='min-h-screen bg-space-gradient text-white pt-20'>
        <div className='container px-4'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold mb-4'>News Not Found</h1>
            <p className='text-gray-300 mb-6'>The requested news item could not be found.</p>
            <button onClick={() => navigate('/')} className='btn btn-primary'>
              <ArrowLeft size={20} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const data = newsItem.data[0]
  const imageUrl = newsItem.links && newsItem.links.length > 0 ? newsItem.links[0].href : null

  return (
    <div className='min-h-screen bg-space-gradient text-white pt-20'>
      <div className='container px-4'>
        {/* Navigation */}
        <div className='mb-8'>
          <button
            onClick={() => navigate('/')}
            className='flex items-center gap-2 text-space-cyan hover:text-white transition-colors duration-300'
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>

        {/* Article Header */}
        <div className='mb-8'>
          <div className='flex flex-wrap items-center gap-4 mb-4'>
            <div className='flex items-center gap-2 text-space-cyan'>
              <Calendar size={16} />
              <span className='text-sm'>{formatDate(data.date_created)}</span>
            </div>
            {data.center && (
              <div className='flex items-center gap-2 text-space-orange'>
                <MapPin size={16} />
                <span className='text-sm'>{data.center}</span>
              </div>
            )}
          </div>

          <h1 className='text-3xl md:text-4xl font-bold mb-4 text-gradient-cyan-orange'>
            {data.title}
          </h1>

          {data.keywords && data.keywords.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {data.keywords.slice(0, 5).map((keyword, index) => (
                <span
                  key={index}
                  className='flex items-center gap-1 px-3 py-1 text-xs bg-space-purple/20 text-space-purple rounded-full'
                >
                  <Tag size={12} />
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Content Column */}
          <div className='lg:col-span-2'>
            <div className='card'>
              <div className='prose prose-invert max-w-none'>
                <p className='text-lg leading-relaxed text-gray-300'>{data.description}</p>

                {data.secondary_creator && (
                  <div className='mt-6 p-4 bg-white/5 rounded-lg'>
                    <h3 className='text-lg font-semibold mb-2 text-space-cyan'>Creator</h3>
                    <p className='text-gray-300'>{data.secondary_creator}</p>
                  </div>
                )}

                {data.photographer && (
                  <div className='mt-6 p-4 bg-white/5 rounded-lg'>
                    <h3 className='text-lg font-semibold mb-2 text-space-cyan'>Photographer</h3>
                    <p className='text-gray-300'>{data.photographer}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            {imageUrl && (
              <div className='card mb-6'>
                <img
                  src={imageUrl}
                  alt={data.title}
                  className='w-full h-auto rounded-lg'
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            <div className='card'>
              <h3 className='text-lg font-semibold mb-4 text-space-cyan'>Details</h3>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>NASA ID:</span>
                  <span className='text-white'>{data.nasa_id}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Media Type:</span>
                  <span className='text-white capitalize'>{data.media_type}</span>
                </div>
                {data.location && (
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Location:</span>
                    <span className='text-white'>{data.location}</span>
                  </div>
                )}
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Date Created:</span>
                  <span className='text-white'>{formatDate(data.date_created)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Actions */}
        <div className='mt-12 text-center'>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button onClick={() => navigate('/search')} className='btn btn-primary'>
              <ExternalLink size={20} />
              Explore More
            </button>
            <button onClick={() => navigate('/apod')} className='btn btn-outline'>
              View APOD
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsDetail
