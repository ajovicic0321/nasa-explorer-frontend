import React, { useState } from 'react'
import { Search, Database, Image, Video, Headphones } from 'lucide-react'
import Loading from '../components/Loading'
import { useNasaSearchMutation } from '@/hooks/nasa-data.ts'

// Component props
export interface SearchPageProps {
  className?: string
  style?: React.CSSProperties
}

const SearchPage: React.FC<SearchPageProps> = () => {
  const [query, setQuery] = useState<string>('')
  const {
    data: searchData,
    isPending: searchLoading,
    error: searchError,
    mutate,
  } = useNasaSearchMutation()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      mutate({
        q: query,
      })
    }
  }

  const getMediaIcon = (type: string | undefined): JSX.Element => {
    switch (type) {
      case 'video':
        return <Video className='w-5 h-5' />
      case 'audio':
        return <Headphones className='w-5 h-5' />
      default:
        return <Image className='w-5 h-5' />
    }
  }

  return (
    <div className='min-h-screen bg-space-gradient text-white pt-20'>
      <div className='container py-8'>
        <div className='text-center mb-12'>
          <div className='flex justify-center items-center gap-3 mb-4'>
            <Database className='w-12 h-12 text-space-amber' />
            <h1 className='text-4xl md:text-5xl font-bold text-gradient-cyan-orange'>
              NASA Media Library
            </h1>
          </div>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Search through NASA's vast collection of media files from space missions
          </p>
        </div>

        <form onSubmit={handleSubmit} className='max-w-4xl mx-auto mb-12'>
          <div className='glass-card p-6'>
            <div className='flex items-center gap-2 mb-6'>
              <Search className='w-5 h-5 text-space-cyan' />
              <h2 className='text-xl font-semibold text-white'>Search Media</h2>
            </div>

            <div className='space-y-6'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Search className='w-5 h-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  placeholder='Search for space images, videos, and more...'
                  className='form-input w-full pl-10 text-lg'
                />
              </div>

              <div className='flex justify-end'>
                <button type='submit' className='btn btn-primary'>
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>

        {searchLoading && <Loading type='dots' message='Searching NASA media library...' />}

        {searchError && (
          <div className='flex justify-center items-center min-h-[200px]'>
            <div className='card max-w-md text-center'>
              <h3 className='text-xl font-bold mb-4 text-gradient-cyan-orange'>Search Error</h3>
              <p className='text-gray-300'>{searchError.name}</p>
            </div>
          </div>
        )}

        {searchData && searchData.collection && (
          <div>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold mb-4 text-gradient-cyan-orange'>Search Results</h2>
              <p className='text-lg text-gray-300'>
                {searchData.collection.metadata?.total_hits || 0} results found
              </p>
            </div>

            <div className='grid-auto-fill'>
              {searchData.collection.items?.map((item, index) => (
                <div key={index} className='card group'>
                  {item.links && item.links[0] && (
                    <div className='image-container mb-4'>
                      <img
                        src={item.links[0].href}
                        alt={item.data[0]?.title || 'NASA media'}
                        className='space-image'
                      />
                      <div className='absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2'>
                        {getMediaIcon(item.data[0]?.media_type)}
                      </div>
                    </div>
                  )}
                  <div className='space-y-2'>
                    <h3 className='text-lg font-semibold text-white line-clamp-2 group-hover:text-space-cyan transition-colors duration-300'>
                      {item.data[0]?.title}
                    </h3>
                    {item.data[0]?.date_created && (
                      <p className='text-sm text-space-cyan'>
                        {new Date(item.data[0].date_created).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                    <p className='text-sm text-gray-300 line-clamp-3'>
                      {item.data[0]?.description?.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
