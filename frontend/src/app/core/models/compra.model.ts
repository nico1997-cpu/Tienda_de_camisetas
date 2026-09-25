import { Camiseta } from './camiseta.model';
import { Usuario } from './usuario.model';

/** DTO `CompraRequest`: el backend procesa UNA camiseta por compra. */
export interface CompraRequest {
  camisetaId: number;
  cantidad: number;
}

/** Entidad `Compra` (el backend la devuelve directamente; no existe CompraResponse). */
export interface Compra {
  id: number;
  usuario: Usuario;
  camiseta: Camiseta;
  cantidad: number;
  total: number;
  fecha: string; // ISO local: '2026-09-24T10:15:30.123'
}
