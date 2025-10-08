type Result<T> = [T, null] | [null, Error]

interface WrapOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  finally?: () => void
}

export type ReturnWrap<T, U = object> = (config: WrapOptions<T> & U) => Promise<Result<T>>

export async function wrap<T>(promise: Promise<T>, config?: WrapOptions<T>): Promise<Result<T>> {
  try {
    const data = await promise
    config?.onSuccess?.(data)
    return [data, null]
  } catch (caught) {
    const error = caught as Error
    config?.onError?.(error)
    return [null, error]
  } finally {
    config?.finally?.()
  }
}
