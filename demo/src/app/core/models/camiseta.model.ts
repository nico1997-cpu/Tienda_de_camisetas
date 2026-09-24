/** Refleja la entidad `Camiseta` del backend (BigDecimal → number en JSON). */
export interface Camiseta {
  id: number;
  equipo: string;
  liga: string;
  temporada: string;
  talla: string; // S, M, L, XL
  precio: number;
  stock: number;
  imagenUrl?: string | null;
}

/** Cuerpo para POST /api/camisetas (sin id). */
export type CamisetaPayload = Omit<Camiseta, 'id'>;
