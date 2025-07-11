import React, { useState } from 'react'
import { Globe, Filter } from 'lucide-react'
import Loading from '../components/Loading'
import { useGetMarsPhotos, useGetMarsRovers } from '@/hooks/nasa-data.ts'

// Component props
export interface MarsPageProps {
  className?: string
  style?: React.CSSProperties
}

// Camera configuration types
interface Camera {
  value: string
  label: string
}

interface CamerasConfig {
  [rover: string]: Camera[]
}

// Move cameras configuration outside component to prevent recreation on every render
const CAMERAS_CONFIG: CamerasConfig = {
  curiosity: [
    { value: '', label: 'All Cameras' },
    { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
    { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
    { value: 'MAST', label: 'Mast Camera' },
    { value: 'CHEMCAM', label: 'Chemistry and Camera Complex' },
    { value: 'MAHLI', label: 'Mars Hand Lens Imager' },
    { value: 'MARDI', label: 'Mars Descent Imager' },
    { value: 'NAVCAM', label: 'Navigation Camera' },
  ],
  opportunity: [
    { value: '', label: 'All Cameras' },
    { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
    { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
    { value: 'NAVCAM', label: 'Navigation Camera' },
    { value: 'PANCAM', label: 'Panoramic Camera' },
    { value: 'MINITES', label: 'Miniature Thermal Emission Spectrometer' },
  ],
  spirit: [
    { value: '', label: 'All Cameras' },
    { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
    { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
    { value: 'NAVCAM', label: 'Navigation Camera' },
    { value: 'PANCAM', label: 'Panoramic Camera' },
    { value: 'MINITES', label: 'Miniature Thermal Emission Spectrometer' },
  ],
}

const MarsPage: React.FC<MarsPageProps> = () => {
  const [selectedRover, setSelectedRover] = useState<string>('curiosity')
  const [selectedSol, setSelectedSol] = useState<string>('1000')
  const [selectedCamera, setSelectedCamera] = useState<string>('')

  const {
    data: photosData,
    isLoading: photosLoading,
    error: photosError,
  } = useGetMarsPhotos({
    rover: selectedRover,
    sol: parseInt(selectedSol, 10),
    camera: selectedCamera,
  })

  const { data: roversData, isLoading: roversLoading } = useGetMarsRovers()

  return (
    <div className='min-h-screen bg-space-gradient text-white pt-20'>
      <div className='container py-8'>
        <div className='text-center mb-12'>
          <div className='flex justify-center items-center gap-3 mb-4'>
            <Globe className='w-12 h-12 text-space-orange' />
            <h1 className='text-4xl md:text-5xl font-bold text-gradient-cyan-orange'>
              Mars Exploration
            </h1>
          </div>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Explore the Red Planet through the eyes of NASA's Mars rovers
          </p>
        </div>

        <div className='max-w-4xl mx-auto mb-12'>
          <div className='glass-card p-6'>
            <div className='flex items-center gap-2 mb-6'>
              <Filter className='w-5 h-5 text-space-cyan' />
              <h2 className='text-xl font-semibold text-white'>Filter Photos</h2>
            </div>

            <div className='grid md:grid-cols-3 gap-6'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-300'>Rover:</label>
                <select
                  value={selectedRover}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedRover(e.target.value)
                  }
                  className='form-select w-full'
                >
                  <option value='curiosity'>Curiosity</option>
                  <option value='opportunity'>Opportunity</option>
                  <option value='spirit'>Spirit</option>
                </select>
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-300'>Sol (Mars Day):</label>
                <input
                  type='number'
                  value={selectedSol}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedSol(e.target.value)
                  }
                  className='form-input w-full'
                  placeholder='Enter sol number'
                />
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-300'>Camera:</label>
                <select
                  value={selectedCamera}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedCamera(e.target.value)
                  }
                  className='form-select w-full'
                >
                  {CAMERAS_CONFIG[selectedRover]?.map((camera) => (
                    <option key={camera.value} value={camera.value}>
                      {camera.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {!roversLoading && roversData && (
          <div className='mb-12'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold mb-4 text-gradient-cyan-orange'>
                Rover Information
              </h2>
            </div>
            <div className='grid md:grid-cols-3 gap-6'>
              {roversData.rovers?.map((rover, index) => (
                <div key={index} className='card'>
                  <h3 className='text-xl font-bold mb-4 text-white'>{rover.name}</h3>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-300'>Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rover.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {rover.status}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-300'>Launch Date:</span>
                      <span className='text-white'>{rover.launch_date}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-300'>Landing Date:</span>
                      <span className='text-white'>{rover.landing_date}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-300'>Total Photos:</span>
                      <span className='text-space-cyan font-bold'>
                        {rover.total_photos?.toLocaleString()}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-300'>Max Sol:</span>
                      <span className='text-space-orange font-bold'>{rover.max_sol}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {photosLoading && <Loading type='dots' message='Loading Mars photos...' />}

        {photosError && (
          <div className='flex justify-center items-center min-h-[200px]'>
            <div className='card max-w-md text-center'>
              <h3 className='text-xl font-bold mb-4 text-gradient-cyan-orange'>
                Error loading photos
              </h3>
              <p className='text-gray-300'>{photosError.message}</p>
            </div>
          </div>
        )}

        {photosData && photosData.photos && (
          <div>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold mb-4 text-gradient-cyan-orange'>
                Mars Photos - Sol {selectedSol}
              </h2>
              <p className='text-lg text-gray-300'>{photosData.photos.length} photos found</p>
            </div>

            <div className='grid-auto-fill'>
              {photosData.photos.map((photo, index) => (
                <div key={index} className='card group'>
                  <div className='image-container mb-4'>
                    <img
                      src={photo.img_src}
                      alt={`Mars photo from ${photo.camera.full_name}`}
                      className='space-image'
                    />
                  </div>
                  <div className='space-y-2'>
                    <h4 className='font-semibold text-white group-hover:text-space-cyan transition-colors duration-300'>
                      {photo.camera.full_name}
                    </h4>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-space-orange'>Sol {photo.sol}</span>
                      <span className='text-gray-400'>{photo.earth_date}</span>
                    </div>
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

export default MarsPage
