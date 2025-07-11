import React, { useState } from 'react'
import { Calendar, Download, Share2 } from 'lucide-react'
import { apiUtils } from '@/services/api'
import Loading from '../components/Loading'
import { useGetAPOD } from '@/hooks/nasa-data.ts'

// Component props
export interface APODPageProps {
  className?: string
  style?: React.CSSProperties
}

const APODPage: React.FC<APODPageProps> = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const {
    data: apodData,
    isPending: apodLoading,
    error: apodError,
  } = useGetAPOD({
    date: selectedDate ?? undefined,
  })

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value
    setSelectedDate(date)
  }

  if (apodLoading) {
    return (
      <div className='min-h-screen bg-space-gradient text-white flex items-center justify-center'>
        <Loading type='rocket' size='large' message='Loading space imagery...' />
      </div>
    )
  }

  if (apodError) {
    return (
      <div className='min-h-screen bg-space-gradient text-white flex items-center justify-center'>
        <div className='card max-w-md text-center'>
          <h2 className='text-2xl font-bold mb-4 text-gradient-cyan-orange'>Error loading APOD</h2>
          <p className='text-gray-300'>{apodError.message}</p>
        </div>
      </div>
    )
  }

  // Type guard to ensure apodData is a single item
  const apodItem = Array.isArray(apodData) ? apodData[0] : apodData

  return (
    <div className='min-h-screen bg-space-gradient text-white pt-20'>
      <div className='container py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 text-gradient-cyan-orange'>
            Astronomy Picture of the Day
          </h1>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Discover the cosmos! Each day a different image or photograph of our fascinating
            universe is featured.
          </p>
        </div>

        <div className='flex justify-center mb-12'>
          <div className='flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3'>
            <Calendar className='w-5 h-5 text-space-cyan' />
            <input
              type='date'
              value={selectedDate || apiUtils.getTodaysDate()}
              onChange={handleDateChange}
              max={apiUtils.getTodaysDate()}
              className='form-input text-white'
            />
          </div>
        </div>

        {apodItem && (
          <div className='max-w-7xl mx-auto'>
            <div className='grid lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-2'>
                <div className='image-container'>
                  {apodItem.media_type === 'image' ? (
                    <img
                      src={apodItem.url}
                      alt={apodItem.title}
                      className='w-full h-auto object-cover rounded-2xl shadow-space-lg'
                    />
                  ) : (
                    <iframe
                      src={apodItem.url}
                      title={apodItem.title}
                      className='w-full h-96 rounded-2xl shadow-space-lg'
                      frameBorder='0'
                      allowFullScreen
                    />
                  )}
                </div>
              </div>

              <div className='lg:col-span-1'>
                <div className='card h-fit'>
                  <div className='mb-6'>
                    <h2 className='text-2xl font-bold mb-3 text-white'>{apodItem.title}</h2>
                    <p className='text-space-cyan font-medium mb-2'>
                      {new Date(apodItem.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {apodItem.copyright && (
                      <p className='text-sm text-gray-400'>© {apodItem.copyright}</p>
                    )}
                  </div>

                  <div className='prose prose-invert max-w-none'>
                    <p className='text-gray-300 leading-relaxed'>{apodItem.explanation}</p>
                  </div>

                  <div className='flex gap-3 mt-6'>
                    <button className='btn btn-primary flex-1'>
                      <Download size={16} />
                      Download
                    </button>
                    <button className='btn btn-outline'>
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default APODPage
