import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

interface ErrorResponse {
  message: string
}

export const handleError = (
  error: unknown,
  option: {
    showMessage?: boolean
  } = {
    showMessage: true,
  },
): never => {
  if (error instanceof AxiosError && error.response && error.response.data) {
    const responseData = error?.response?.data as ErrorResponse
    option.showMessage &&
      toast(responseData?.message, {
        type: 'error',
      })
    throw responseData || error
  } else if (error instanceof Error && error.message) {
    option.showMessage &&
      toast(error.message, {
        type: 'error',
      })
    throw error
  } else {
    option.showMessage &&
      toast('A problem occurred. Please try again later.', {
        type: 'error',
      })
    throw error
  }
}
