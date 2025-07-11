import React from 'react'
import { Loader2, Rocket } from 'lucide-react'

// Component props
export type LoadingType = 'spinner' | 'rocket' | 'dots' | 'skeleton'
export type LoadingSize = 'small' | 'medium' | 'large'

export interface LoadingProps {
  type?: LoadingType
  size?: LoadingSize
  message?: string
  fullScreen?: boolean
  className?: string
  style?: React.CSSProperties
}

const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  size = 'medium',
  message = 'Loading...',
  fullScreen = false,
}) => {
  const getSizeClasses = (): string => {
    switch (size) {
      case 'small':
        return 'w-6 h-6'
      case 'large':
        return 'w-16 h-16'
      default:
        return 'w-10 h-10'
    }
  }

  const SpinnerLoader: React.FC = () => (
    <div className='flex flex-col items-center gap-4'>
      <Loader2 className={`animate-spin text-space-cyan ${getSizeClasses()}`} />
      {message && <p className='text-gray-300 text-base font-medium text-center m-0'>{message}</p>}
    </div>
  )

  const RocketLoader: React.FC = () => (
    <div className='flex flex-col items-center gap-4'>
      <div className='relative flex items-center justify-center'>
        <Rocket className={`text-space-cyan animate-rocket-move z-10 ${getSizeClasses()}`} />
        <div className='absolute w-10 h-1 bg-gradient-to-r from-transparent via-space-cyan to-transparent animate-trail z-0'></div>
      </div>
      {message && <p className='text-gray-300 text-base font-medium text-center m-0'>{message}</p>}
    </div>
  )

  const PulseDots: React.FC = () => (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 rounded-full bg-space-cyan animate-pulse'></div>
        <div
          className='w-3 h-3 rounded-full bg-space-cyan animate-pulse'
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className='w-3 h-3 rounded-full bg-space-cyan animate-pulse'
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
      {message && <p className='text-gray-300 text-base font-medium text-center m-0'>{message}</p>}
    </div>
  )

  const SkeletonLoader: React.FC = () => (
    <div className='w-full max-w-md p-4'>
      <div className='bg-shimmer animate-shimmer rounded-lg mb-4 h-6 w-3/5'></div>
      <div className='bg-shimmer animate-shimmer rounded-lg mb-4 h-4 w-full'></div>
      <div className='bg-shimmer animate-shimmer rounded-lg mb-4 h-4 w-3/5'></div>
      <div className='bg-shimmer animate-shimmer rounded-lg h-48 w-full'></div>
    </div>
  )

  const renderLoader = (): React.ReactNode => {
    switch (type) {
      case 'rocket':
        return <RocketLoader />
      case 'dots':
        return <PulseDots />
      case 'skeleton':
        return <SkeletonLoader />
      default:
        return <SpinnerLoader />
    }
  }

  const containerClasses = fullScreen
    ? 'flex justify-center items-center min-h-screen bg-space-gradient text-white'
    : 'flex justify-center items-center min-h-[200px] text-white'

  return <div className={containerClasses}>{renderLoader()}</div>
}

export default Loading
