import { Injectable, computed, effect, signal } from '@angular/core';
import { Camiseta } from '../models/camiseta.model';

const CART_KEY = 'cart_items';

export interface CartItem {
  camiseta: Camiseta;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>(this.cargar());

  readonly items = this._items.asReadonly();
  readonly isEmpty = computed(() => this._items().length === 0);
  /** Total de unidades (lo que muestra el badge del navbar). */
  readonly count = computed(() => this._items().reduce((n, i) => n + i.cantidad, 0));
  readonly total = computed(
    () =>
      Math.round(this._items().reduce((s, i) => s + i.camiseta.precio * i.cantidad, 0) * 100) / 100,
  );

  constructor() {
    effect(() => this.guardar(this._items()));
  }

  cantidadDe(camisetaId: number): number {
    return this._items().find((i) => i.camiseta.id === camisetaId)?.cantidad ?? 0;
  }

  agregar(camiseta: Camiseta, cantidad = 1): void {
    if (camiseta.stock <= 0) return;
    this._items.update((items) => {
      const existente = items.find((i) => i.camiseta.id === camiseta.id);
      if (!existente) {
        return [...items, { camiseta, cantidad: Math.min(cantidad, camiseta.stock) }];
      }
      // Se reemplaza la camiseta para refrescar precio/stock con el dato más reciente.
      return items.map((i) =>
        i === existente
          ? { camiseta, cantidad: Math.min(i.cantidad + cantidad, camiseta.stock) }
          : i,
      );
    });
  }

  establecerCantidad(camisetaId: number, cantidad: number): void {
    if (cantidad <= 0) return this.remover(camisetaId);
    this._items.update((items) =>
      items.map((i) =>
        i.camiseta.id === camisetaId
          ? { ...i, cantidad: Math.min(Math.floor(cantidad), i.camiseta.stock) }
          : i,
      ),
    );
  }

  incrementar(camisetaId: number): void {
    this.establecerCantidad(camisetaId, this.cantidadDe(camisetaId) + 1);
  }

  decrementar(camisetaId: number): void {
    this.establecerCantidad(camisetaId, this.cantidadDe(camisetaId) - 1);
  }

  remover(camisetaId: number): void {
    this._items.update((items) => items.filter((i) => i.camiseta.id !== camisetaId));
  }

  vaciar(): void {
    this._items.set([]);
  }

  private cargar(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const datos = raw ? JSON.parse(raw) : [];
      return Array.isArray(datos) ? (datos as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private guardar(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* sin persistencia */
    }
  }
}
