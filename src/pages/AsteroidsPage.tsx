import React, { useState, useMemo, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  AlertTriangle,
  Calendar,
  TrendingUp,
  Satellite,
  Calendar as CalendarIcon,
  Info,
} from 'lucide-react'
import { apiUtils } from '../services/api'
import Loading from '../components/Loading'
import { NEOObject } from '@/types/api'
import { useGetNEOs } from '@/hooks/nasa-data.ts'

// Component props
export interface AsteroidsPageProps {
  className?: string
  style?: React.CSSProperties
}

// Chart data types
interface DailyData {
  date: string
  count: number
  hazardous: number
}

interface HazardousData {
  name: string
  value: number
  color: string
}

interface SizeData {
  category: string
  count: number
}

interface ProcessedData {
  dailyData: DailyData[]
  hazardousData: HazardousData[]
  sizeData: SizeData[]
  totalAsteroids: number
  hazardousCount: number
}

const AsteroidsPage: React.FC<AsteroidsPageProps> = () => {
  const [startDate, setStartDate] = useState<string>(apiUtils.getDateDaysAgo(7))
  const [endDate, setEndDate] = useState<string>(apiUtils.getTodaysDate())
  const [dateRangeWarning, setDateRangeWarning] = useState<string>('')

  const {
    data: neoData,
    isLoading: neoLoading,
    error: neoError,
  } = useGetNEOs({
    start_date: startDate,
    end_date: endDate,
  })

  // Validate date range whenever dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 7) {
        setDateRangeWarning(
          'Date range cannot exceed 7 days due to NASA API limitations. Please select a shorter range.',
        )
      } else if (start > end) {
        setDateRangeWarning('Start date must be before end date.')
      } else {
        setDateRangeWarning('')
      }
    }
  }, [startDate, endDate])

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)

    // Auto-adjust end date if range would exceed 7 days
    if (endDate) {
      const start = new Date(newStartDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 7) {
        // Set end date to 7 days after start date
        const adjustedEnd = new Date(start)
        adjustedEnd.setDate(adjustedEnd.getDate() + 7)
        setEndDate(adjustedEnd.toISOString().split('T')[0])
      }
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)

    // Auto-adjust start date if range would exceed 7 days
    if (startDate) {
      const start = new Date(startDate)
      const end = new Date(newEndDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 7) {
        // Set start date to 7 days before end date
        const adjustedStart = new Date(end)
        adjustedStart.setDate(adjustedStart.getDate() - 7)
        setStartDate(adjustedStart.toISOString().split('T')[0])
      }
    }
  }

  const processedData = useMemo<ProcessedData | null>(() => {
    if (!neoData || !neoData.near_earth_objects) return null

    const dailyData: DailyData[] = []
    const hazardousData: HazardousData[] = []
    const sizeData: SizeData[] = []
    let totalAsteroids = 0
    let hazardousCount = 0

    Object.entries(neoData.near_earth_objects).forEach(([date, asteroids]) => {
      dailyData.push({
        date: new Date(date).toLocaleDateString(),
        count: asteroids.length,
        hazardous: asteroids.filter((a) => a.is_potentially_hazardous_asteroid).length,
      })

      asteroids.forEach((asteroid) => {
        totalAsteroids++
        if (asteroid.is_potentially_hazardous_asteroid) {
          hazardousCount++
        }

        const diameterMin = asteroid.estimated_diameter?.meters?.estimated_diameter_min || 0
        const diameterMax = asteroid.estimated_diameter?.meters?.estimated_diameter_max || 0
        const diameter = (diameterMin + diameterMax) / 2

        let sizeCategory = 'Unknown'
        if (diameter < 50) sizeCategory = 'Small (<50m)'
        else if (diameter < 200) sizeCategory = 'Medium (50-200m)'
        else if (diameter < 1000) sizeCategory = 'Large (200-1000m)'
        else sizeCategory = 'Very Large (>1000m)'

        const existingSize = sizeData.find((s) => s.category === sizeCategory)
        if (existingSize) {
          existingSize.count++
        } else {
          sizeData.push({ category: sizeCategory, count: 1 })
        }
      })
    })

    hazardousData.push(
      { name: 'Safe', value: totalAsteroids - hazardousCount, color: '#4ade80' },
      { name: 'Potentially Hazardous', value: hazardousCount, color: '#ef4444' },
    )

    return {
      dailyData,
      hazardousData,
      sizeData,
      totalAsteroids,
      hazardousCount,
    }
  }, [neoData])

  const getAllAsteroids = (): NEOObject[] => {
    if (!neoData || !neoData.near_earth_objects) return []
    return Object.values(neoData.near_earth_objects).flat()
  }

  return (
    <div className='min-h-screen bg-space-gradient text-white pt-20'>
      <div className='container py-8'>
        <div className='text-center mb-12'>
          <div className='flex justify-center items-center gap-3 mb-4'>
            <Satellite className='w-12 h-12 text-space-purple' />
            <h1 className='text-4xl md:text-5xl font-bold text-gradient-cyan-orange'>
              Near Earth Objects
            </h1>
          </div>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Track asteroids and other objects that come close to Earth
          </p>
        </div>

        <div className='max-w-4xl mx-auto mb-12'>
          <div className='glass-card p-6'>
            <div className='flex items-center gap-2 mb-6'>
              <CalendarIcon className='w-5 h-5 text-space-cyan' />
              <h2 className='text-xl font-semibold text-white'>Date Range</h2>
            </div>

            {/* Date Range Warning */}
            {dateRangeWarning && (
              <div className='mb-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-start gap-3'>
                <Info className='w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5' />
                <div className='text-yellow-200 text-sm'>
                  <p className='font-medium'>Date Range Limitation</p>
                  <p>{dateRangeWarning}</p>
                </div>
              </div>
            )}

            {/* API Info */}
            <div className='mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg flex items-start gap-3'>
              <Info className='w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5' />
              <div className='text-blue-200 text-sm'>
                <p className='font-medium'>NASA API Limitation</p>
                <p>
                  The NASA Near Earth Objects API only allows a maximum date range of 7 days per
                  request.
                </p>
              </div>
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-300'>Start Date:</label>
                <input
                  type='date'
                  value={startDate}
                  onChange={handleStartDateChange}
                  className='form-input w-full'
                />
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-300'>End Date:</label>
                <input
                  type='date'
                  value={endDate}
                  onChange={handleEndDateChange}
                  max={apiUtils.getTodaysDate()}
                  className='form-input w-full'
                />
              </div>
            </div>
          </div>
        </div>

        {neoLoading && <Loading type='dots' message='Loading asteroid data...' />}

        {neoError && (
          <div className='flex justify-center items-center min-h-[200px]'>
            <div className='card max-w-md text-center'>
              <div className='flex justify-center mb-4'>
                <AlertTriangle className='w-12 h-12 text-red-400' />
              </div>
              <h3 className='text-xl font-bold mb-4 text-gradient-cyan-orange'>
                Error Loading Data
              </h3>
              <p className='text-gray-300 mb-4'>{neoError.message}</p>
              <div className='text-sm text-gray-400'>
                <p>This might be due to:</p>
                <ul className='mt-2 space-y-1 text-left'>
                  <li>• Date range exceeding 7 days</li>
                  <li>• Invalid date format</li>
                  <li>• NASA API rate limiting</li>
                  <li>• Network connectivity issues</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {processedData && (
          <>
            <div className='grid md:grid-cols-3 gap-6 mb-12'>
              <div className='card text-center'>
                <div className='flex justify-center mb-4'>
                  <div className='w-16 h-16 bg-space-cyan/20 rounded-full flex items-center justify-center'>
                    <TrendingUp className='w-8 h-8 text-space-cyan' />
                  </div>
                </div>
                <h3 className='text-3xl font-bold text-space-cyan mb-2'>
                  {processedData.totalAsteroids}
                </h3>
                <p className='text-gray-300'>Total NEOs</p>
              </div>

              <div className='card text-center'>
                <div className='flex justify-center mb-4'>
                  <div className='w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center'>
                    <AlertTriangle className='w-8 h-8 text-red-400' />
                  </div>
                </div>
                <h3 className='text-3xl font-bold text-red-400 mb-2'>
                  {processedData.hazardousCount}
                </h3>
                <p className='text-gray-300'>Potentially Hazardous</p>
              </div>

              <div className='card text-center'>
                <div className='flex justify-center mb-4'>
                  <div className='w-16 h-16 bg-space-amber/20 rounded-full flex items-center justify-center'>
                    <Calendar className='w-8 h-8 text-space-amber' />
                  </div>
                </div>
                <h3 className='text-3xl font-bold text-space-amber mb-2'>
                  {processedData.dailyData.length}
                </h3>
                <p className='text-gray-300'>Days Tracked</p>
              </div>
            </div>

            <div className='grid lg:grid-cols-2 gap-8 mb-12'>
              <div className='glass-card p-6'>
                <h3 className='text-xl font-bold mb-6 text-gradient-cyan-orange'>
                  Daily NEO Count
                </h3>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={processedData.dailyData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='date' stroke='#9CA3AF' />
                    <YAxis stroke='#9CA3AF' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                      }}
                    />
                    <Bar dataKey='count' fill='#00d4ff' />
                    <Bar dataKey='hazardous' fill='#ef4444' />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className='glass-card p-6'>
                <h3 className='text-xl font-bold mb-6 text-gradient-cyan-orange'>
                  Hazard Assessment
                </h3>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={processedData.hazardousData}
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {processedData.hazardousData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                      }}
                      itemStyle={{
                        color: '#ffffff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className='text-center mb-8'>
                <h3 className='text-3xl font-bold mb-4 text-gradient-cyan-orange'>
                  Detected Near Earth Objects
                </h3>
                <p className='text-gray-300'>
                  Showing {Math.min(20, getAllAsteroids().length)} of {getAllAsteroids().length}{' '}
                  objects
                </p>
              </div>

              <div className='grid-auto-fit'>
                {getAllAsteroids()
                  .slice(0, 20)
                  .map((asteroid, index) => (
                    <div
                      key={index}
                      className={`card ${asteroid.is_potentially_hazardous_asteroid ? 'border-red-400/50 bg-red-500/5' : ''}`}
                    >
                      <div className='flex justify-between items-start mb-4'>
                        <h4 className='text-lg font-semibold text-white line-clamp-2'>
                          {asteroid.name}
                        </h4>
                        {asteroid.is_potentially_hazardous_asteroid && (
                          <div className='flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium'>
                            <AlertTriangle size={14} />
                            Hazardous
                          </div>
                        )}
                      </div>

                      <div className='space-y-3'>
                        <div className='flex justify-between items-center'>
                          <span className='text-gray-300'>Diameter:</span>
                          <span className='text-white text-sm'>
                            {asteroid.estimated_diameter?.meters?.estimated_diameter_min?.toFixed(
                              1,
                            )}{' '}
                            -
                            {asteroid.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(
                              1,
                            )}{' '}
                            m
                          </span>
                        </div>

                        <div className='flex justify-between items-center'>
                          <span className='text-gray-300'>Miss Distance:</span>
                          <span className='text-space-cyan text-sm'>
                            {asteroid.close_approach_data?.[0]?.miss_distance?.kilometers &&
                              `${Number(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km`}
                          </span>
                        </div>

                        <div className='flex justify-between items-center'>
                          <span className='text-gray-300'>Velocity:</span>
                          <span className='text-space-orange text-sm'>
                            {asteroid.close_approach_data?.[0]?.relative_velocity
                              ?.kilometers_per_hour &&
                              `${Number(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AsteroidsPage
