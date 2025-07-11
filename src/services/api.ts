import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  APODParams,
  MarsPhotosParams,
  NEOParams,
  SearchParams,
  EPICParams,
  APODResponse,
  MarsPhotosResponse,
  MarsRoversResponse,
  NEOResponse,
  NASASearchResponse,
  EPICResponse,
  StatsResponse,
  NewsResponse,
  HealthCheckResponse,
} from '../types/api'

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Only log in development mode
    if (import.meta.env.MODE === 'development') {
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// API endpoints
export const nasaApi = {
  // Health check
  health: (): Promise<AxiosResponse<HealthCheckResponse>> => api.get('/api/health'),

  // Astronomy Picture of the Day
  apod: (params: APODParams = {}): Promise<AxiosResponse<APODResponse>> =>
    api.get('/api/apod', { params }),

  // Mars Rover Photos
  marsPhotos: (params: MarsPhotosParams = {}): Promise<AxiosResponse<MarsPhotosResponse>> =>
    api.get('/api/mars-photos', { params }),

  // Mars Rovers Information
  marsRovers: (): Promise<AxiosResponse<MarsRoversResponse>> => api.get('/api/mars-rovers'),

  // Near Earth Objects
  nearEarthObjects: (params: NEOParams = {}): Promise<AxiosResponse<NEOResponse>> =>
    api.get('/api/neo', { params }),

  // NASA Image and Video Library Search
  search: (params: SearchParams): Promise<AxiosResponse<NASASearchResponse>> =>
    api.get('/api/search', { params }),

  // Earth Polychromatic Imaging Camera
  epic: (params: EPICParams = {}): Promise<AxiosResponse<EPICResponse>> =>
    api.get('/api/epic', { params }),

  // Home page aggregated stats
  stats: (): Promise<AxiosResponse<StatsResponse>> => api.get('/api/stats'),

  // NASA news and recent discoveries
  news: (): Promise<AxiosResponse<NewsResponse>> => api.get('/api/search/news'),
}

// Utility functions
export const apiUtils = {
  // Format date for API calls
  formatDate: (date: Date | null): string | null => {
    if (!date) return null
    return date.toISOString().split('T')[0]
  },

  // Get today's date
  getTodaysDate: (): string => {
    return new Date().toISOString().split('T')[0]
  },

  // Get date X days ago
  getDateDaysAgo: (days: number): string => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
  },

  // Handle API errors
  handleError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.response?.data?.error) {
      return error.response.data.error
    }
    if (error.message) {
      return error.message
    }
    return 'An unexpected error occurred'
  },

  // Check if image URL is valid
  isValidImageUrl: (url: string | undefined | null): boolean => {
    if (!url) return false
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext))
  },
}

export default api
