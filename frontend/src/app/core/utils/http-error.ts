import { HttpErrorResponse } from '@angular/common/http';

/**
 * Convierte un error HTTP en un mensaje legible.
 * Spring Boot no incluye `message` en el cuerpo por defecto, así que se mapea por código de estado.
 */
export function mensajeDeError(err: unknown, porEstado: Record<number, string> = {}): string {
  if (err instanceof HttpErrorResponse) {
    if (porEstado[err.status]) return porEstado[err.status];
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que la API esté en ejecución.';
    }
    if (err.status >= 500) return 'Error interno del servidor. Inténtalo de nuevo más tarde.';
    const mensaje = err.error?.message;
    if (typeof mensaje === 'string' && mensaje.length > 0) return mensaje;
  }
  return 'Ocurrió un error inesperado.';
}
