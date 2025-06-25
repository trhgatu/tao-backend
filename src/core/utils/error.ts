export function isErrorWithName(
  error: unknown,
  name: string
): error is Error & { name: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as Record<string, unknown>).name === name
  )
}
