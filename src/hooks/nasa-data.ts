import {
  buildApiMutationHook,
  buildApiQueryHook,
  buildApiQueryNoParamsHook,
} from '@/services/react-query-utils.ts'
import { nasaApi } from '@/services/api.ts'
import {
  APODParams,
  APODResponse,
  MarsPhotosParams,
  MarsPhotosResponse,
  MarsRoversResponse,
  NASASearchResponse,
  NEOParams,
  NEOResponse,
  NewsResponse,
  SearchParams,
  StatsResponse,
} from '@/types/api.ts'

export const useNasaStats = buildApiQueryNoParamsHook<StatsResponse>(['stats'], () =>
  nasaApi.stats(),
)

export const useNasaNews = buildApiQueryNoParamsHook<NewsResponse>(['news'], () => nasaApi.news())

export const useGetAPOD = buildApiQueryHook<APODParams, APODResponse>(
  (params) => ['apod', params],
  (params) => nasaApi.apod(params),
)

export const useGetMarsPhotos = buildApiQueryHook<MarsPhotosParams, MarsPhotosResponse>(
  (params) => ['mars-photos', params],
  (params) => nasaApi.marsPhotos(params),
)

export const useGetMarsRovers = buildApiQueryNoParamsHook<MarsRoversResponse>(['mars-rovers'], () =>
  nasaApi.marsRovers(),
)

export const useGetNEOs = buildApiQueryHook<NEOParams, NEOResponse>(
  (params) => ['neo', params],
  (params) => nasaApi.nearEarthObjects(params),
)

export const useNasaSearchMutation = buildApiMutationHook<SearchParams, NASASearchResponse>(
  (params) => nasaApi.search(params),
)
