import React, { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

// Component props and state
export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
  style?: React.CSSProperties
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-space-gradient text-white p-8'>
          <div className='text-center max-w-2xl glass-card p-12 shadow-space-lg'>
            <AlertTriangle className='w-20 h-20 text-space-orange mx-auto mb-6' />
            <h1 className='text-3xl md:text-4xl font-bold mb-4 text-gradient-cyan-orange'>
              Oops! Something went wrong
            </h1>
            <p className='text-lg text-gray-300 mb-8 leading-relaxed'>
              We're sorry, but something unexpected happened. The space mission encountered an
              error.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-8'>
              <button onClick={() => window.location.reload()} className='btn btn-primary'>
                <RefreshCw size={20} />
                Try Again
              </button>
              <button onClick={() => (window.location.href = '/')} className='btn btn-secondary'>
                <Home size={20} />
                Return Home
              </button>
            </div>

            {import.meta.env.MODE === 'development' && this.state.errorInfo && (
              <details className='mt-8 text-left bg-black/30 rounded-lg p-4 border border-white/10'>
                <summary className='cursor-pointer font-medium mb-4 text-space-cyan'>
                  Error Details (Development)
                </summary>
                <pre className='text-space-orange text-sm overflow-x-auto whitespace-pre-wrap break-words'>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
