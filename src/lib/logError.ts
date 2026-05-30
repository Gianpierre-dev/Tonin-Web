/**
 * Loguea un error a consola SOLO en dev. En producción es no-op (placeholder
 * para Sentry/Datadog/etc. cuando se conecte uno).
 *
 * Patrón: `logError('useFraseRandom.fetchNext', err, { moodName, excludedIds })`.
 * Mantener el `context` corto y consistente (módulo.acción) para que sea
 * grep-able. El `extra` es opcional para metadata estructurada.
 */
export const logError = (
  context: string,
  error: unknown,
  extra?: Record<string, unknown>,
): void => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(`[${context}]`, error, extra ?? '')
  }
  // TODO: cuando exista Sentry/logging server, enviar aquí.
}
