// API Response Types

// APOD (Astronomy Picture of the Day)
export interface APODItem {
  date: string
  explanation: string
  hdurl?: string
  media_type: 'image' | 'video'
  service_version: string
  title: string
  url: string
  copyright?: string
}

export type APODResponse = APODItem | APODItem[]

// Mars Rover Photos
export interface MarsCamera {
  id: number
  name: string
  rover_id: number
  full_name: string
}

export interface MarsRover {
  id: number
  name: string
  landing_date: string
  launch_date: string
  status: string
  max_sol: number
  max_date: string
  total_photos: number
  cameras: { name: string; full_name: string }[]
}

export interface MarsPhoto {
  id: number
  sol: number
  camera: MarsCamera
  img_src: string
  earth_date: string
  rover: MarsRover
}

export interface MarsPhotosResponse {
  photos: MarsPhoto[]
}

export interface MarsRoversResponse {
  rovers: MarsRover[]
}

// Near Earth Objects
export interface NEOEstimatedDiameter {
  kilometers: {
    estimated_diameter_min: number
    estimated_diameter_max: number
  }
  meters: {
    estimated_diameter_min: number
    estimated_diameter_max: number
  }
  miles: {
    estimated_diameter_min: number
    estimated_diameter_max: number
  }
  feet: {
    estimated_diameter_min: number
    estimated_diameter_max: number
  }
}

export interface NEOCloseApproachData {
  close_approach_date: string
  close_approach_date_full: string
  epoch_date_close_approach: number
  relative_velocity: {
    kilometers_per_second: string
    kilometers_per_hour: string
    miles_per_hour: string
  }
  miss_distance: {
    astronomical: string
    lunar: string
    kilometers: string
    miles: string
  }
  orbiting_body: string
}

export interface NEOObject {
  links: {
    self: string
  }
  id: string
  neo_reference_id: string
  name: string
  nasa_jpl_url: string
  absolute_magnitude_h: number
  estimated_diameter: NEOEstimatedDiameter
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: NEOCloseApproachData[]
  is_sentry_object: boolean
}

export interface NEOResponse {
  links: {
    next: string
    prev: string
    self: string
  }
  element_count: number
  near_earth_objects: {
    [date: string]: NEOObject[]
  }
}

// NASA Image and Video Library Search
export interface NASAMediaItem {
  href: string
  data: {
    center: string
    title: string
    nasa_id: string
    date_created: string
    keywords: string[]
    media_type: 'image' | 'video' | 'audio'
    description: string
    description_508?: string
    secondary_creator?: string
    location?: string
    album?: string[]
    photographer?: string
  }[]
  links: {
    href: string
    rel: string
    render?: string
  }[]
}

export interface NASASearchResponse {
  collection: {
    version: string
    href: string
    items: NASAMediaItem[]
    metadata: {
      total_hits: number
    }
    links?: {
      rel: string
      prompt: string
      href: string
    }[]
  }
}

// EPIC (Earth Polychromatic Imaging Camera)
export interface EPICImage {
  identifier: string
  caption: string
  image: string
  version: string
  centroid_coordinates: {
    lat: number
    lon: number
  }
  dscovr_j2000_position: {
    x: number
    y: number
    z: number
  }
  lunar_j2000_position: {
    x: number
    y: number
    z: number
  }
  sun_j2000_position: {
    x: number
    y: number
    z: number
  }
  attitude_quaternions: {
    q0: number
    q1: number
    q2: number
    q3: number
  }
  date: string
  coords: {
    centroid_coordinates: {
      lat: number
      lon: number
    }
    dscovr_j2000_position: {
      x: number
      y: number
      z: number
    }
    lunar_j2000_position: {
      x: number
      y: number
      z: number
    }
    sun_j2000_position: {
      x: number
      y: number
      z: number
    }
    attitude_quaternions: {
      q0: number
      q1: number
      q2: number
      q3: number
    }
  }
}

export type EPICResponse = EPICImage[]

// Stats
export interface StatsResponse {
  apod_count?: number
  mars_photos_count?: number
  neo_count?: number
  epic_count?: number
  media_count?: number
  totalMissions?: number
  photosToday?: number
  nearEarthObjects?: number
  daysActive?: number
}

// News
export interface NewsItem {
  id: string
  title: string
  date: string
  summary: string
  url: string
  image_url: string
  source: string
  tags: string[]
}

export type NewsResponse = NewsItem[]

// Health Check
export interface HealthCheckResponse {
  status: string
  message: string
  timestamp: string
  uptime: number
}

// API Parameters
export interface APODParams {
  date?: string
  start_date?: string
  end_date?: string
  count?: number
  thumbs?: boolean
}

export interface MarsPhotosParams {
  rover?: string
  sol?: number
  earth_date?: string
  camera?: string
  page?: number
}

export interface NEOParams {
  start_date?: string
  end_date?: string
}

export interface SearchParams {
  q: string
  media_type?: 'image' | 'video' | 'audio'
  year_start?: string
  year_end?: string
  page?: number
}

export interface EPICParams {
  date?: string
}
