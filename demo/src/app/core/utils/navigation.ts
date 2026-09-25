/** Evita open-redirect: solo se aceptan rutas internas ('/algo'), nunca URLs externas. */
export function destinoSeguro(url: string | null, porDefecto = '/catalogo'): string {
  return url && url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')
    ? url
    : porDefecto;
}
