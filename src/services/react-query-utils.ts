import { AxiosResponse } from 'axios'
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { handleError } from '@/services/errorHandler.ts'

export async function handleApiResult<T = unknown>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const response = await promise
    if (
      (response.status === 200 || response.status === 201 || response.status === 202) &&
      response.data
    ) {
      return response.data as T
    } else {
      handleError(response)
      return undefined as unknown as T
      // throw Error(response.statusText)
    }
  } catch (err: unknown) {
    handleError(err)
    return undefined as unknown as T
  }
}

export type ApiQueryOptions<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, Error, TData, TQueryKey>,
  'queryFn' // queryFn is omitted because it is set at query hook creation
  // queryKey is NOT omitted here, as the user might want to override it
>

//api query hook
type ApiQueryHook<Params, Result> = <SelectResult = Result>(
  params: Params,
  options?: ApiQueryOptions<Result, SelectResult>,
) => UseQueryResult<SelectResult, Error>

export const buildApiQueryHook = <Params, Result>(
  cacheKey: string | ((params: Params) => QueryKey),
  fetch: (params: Params) => Promise<AxiosResponse>,
): ApiQueryHook<Params, Result> => {
  return <SelectResult = Result>(
    params: Params,
    options?: ApiQueryOptions<Result, SelectResult>,
  ) => {
    // The user can pass a queryKey in options to override the default one
    const queryKey =
      options?.queryKey || (typeof cacheKey === 'string' ? [cacheKey, params] : cacheKey(params))

    return useQuery<Result, Error, SelectResult, QueryKey>({
      ...options, // Spread options first
      queryKey, // Then ensure our resolved queryKey is used
      queryFn: () => handleApiResult<Result>(fetch(params)),
    })
  }
}

type ApiQueryNoParamsHook<Result> = <SelectResult = Result>(
  options?: ApiQueryOptions<Result, SelectResult, QueryKey>, // Explicitly state QueryKey for TQueryKey
) => UseQueryResult<SelectResult, Error>

export const buildApiQueryNoParamsHook = <Result>(
  defaultQueryKey: QueryKey, // Renamed from cacheKey to avoid confusion
  fetch: () => Promise<AxiosResponse>,
): ApiQueryNoParamsHook<Result> => {
  return <SelectResult = Result>(options?: ApiQueryOptions<Result, SelectResult, QueryKey>) => {
    // The user can pass a queryKey in options to override the default one
    const queryKey = options?.queryKey || defaultQueryKey
    return useQuery<Result, Error, SelectResult, QueryKey>({
      ...options, // Spread options first
      queryKey, // Then ensure our resolved queryKey is used
      queryFn: () => handleApiResult<Result>(fetch()),
    })
  }
}

export type ApiMutationOptions<TData = unknown, TVariables = void> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
>

export const buildApiMutationHook = <Params = void, Result = void>(
  fetch: (params: Params) => Promise<AxiosResponse>,
  mapOptions: (
    options?: ApiMutationOptions<Result, Params>,
  ) => undefined | ApiMutationOptions<Result, Params> = (x) => x,
): ((options?: ApiMutationOptions<Result, Params>) => UseMutationResult<Result, Error, Params>) => {
  return (options?: ApiMutationOptions<Result, Params>) => {
    const mutationOptions = mapOptions(options)
    return useMutation<Result, Error, Params>({
      mutationFn: (params: Params) => handleApiResult<Result>(fetch(params)),
      ...mutationOptions, // Spread mapped options
      onError: (error) => {
        // This onError is part of the useMutation options object
        if (mutationOptions?.onError) mutationOptions.onError(error, {} as Params, undefined)
        else {
          handleError(error, {
            showMessage: true,
          })
        }
      },
    })
  }
}
