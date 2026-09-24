import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Camiseta } from '../../../core/models/camiseta.model';
import { CamisetaService } from '../../../core/services/camiseta.service';
import { CartService } from '../../../core/services/cart.service';
import { mensajeDeError } from '../../../core/utils/http-error';

const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

@Component({
  selector: 'app-camiseta-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './camiseta-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamisetaListComponent implements OnInit {
  private readonly camisetaService = inject(CamisetaService);
  protected readonly cart = inject(CartService);
  protected readonly moneda = environment.moneda;

  protected readonly camisetas = signal<Camiseta[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busqueda = signal('');
  private readonly imagenesRotas = signal<ReadonlySet<number>>(new Set());

  protected readonly filtradas = computed(() => {
    const q = normalizar(this.busqueda().trim());
    if (!q) return this.camisetas();
    return this.camisetas().filter((c) =>
      normalizar(`${c.equipo} ${c.liga} ${c.temporada} ${c.talla}`).includes(q),
    );
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.camisetaService
      .listar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (lista) => this.camisetas.set(lista),
        error: (err) => this.error.set(mensajeDeError(err)),
      });
  }

  protected alBuscar(evento: Event): void {
    this.busqueda.set((evento.target as HTMLInputElement).value);
  }

  protected agregar(camiseta: Camiseta): void {
    this.cart.agregar(camiseta);
  }

  protected puedeAgregar(c: Camiseta): boolean {
    return c.stock > this.cart.cantidadDe(c.id);
  }

  protected etiquetaBoton(c: Camiseta): string {
    if (c.stock <= 0) return 'Agotada';
    if (!this.puedeAgregar(c)) return `Máximo en el carrito (${this.cart.cantidadDe(c.id)})`;
    return 'Agregar al carrito';
  }

  protected mostrarImagen(c: Camiseta): boolean {
    return !!c.imagenUrl && !this.imagenesRotas().has(c.id);
  }

  protected marcarImagenRota(id: number): void {
    this.imagenesRotas.update((set) => new Set(set).add(id));
  }
}
