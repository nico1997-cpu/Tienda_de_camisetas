import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Camiseta, CamisetaPayload } from '../../../core/models/camiseta.model';
import { AuthService } from '../../../core/services/auth.service';
import { CamisetaService } from '../../../core/services/camiseta.service';
import { CartService } from '../../../core/services/cart.service';
import { mensajeDeError } from '../../../core/utils/http-error';

const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

@Component({
  selector: 'app-camiseta-list',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './camiseta-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamisetaListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly camisetaService = inject(CamisetaService);
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);
  protected readonly moneda = environment.moneda;

  protected readonly camisetas = signal<Camiseta[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly busqueda = signal('');
  private readonly imagenesRotas = signal<ReadonlySet<number>>(new Set());

  // Estado para Crear / Editar
  protected readonly modalAbierto = signal(false);
  protected readonly modoModal = signal<'crear' | 'editar'>('crear');
  protected readonly camisetaEditandoId = signal<number | null>(null);
  protected readonly guardando = signal(false);
  protected readonly errorFormulario = signal<string | null>(null);
  protected readonly previewImagenRota = signal(false);

  // Estado para Confirmación de Eliminación
  protected readonly camisetaAEliminar = signal<Camiseta | null>(null);
  protected readonly eliminando = signal(false);
  protected readonly errorEliminar = signal<string | null>(null);

  protected readonly form = this.fb.group({
    equipo: ['', [Validators.required, Validators.maxLength(100)]],
    liga: ['', [Validators.required, Validators.maxLength(100)]],
    temporada: ['', [Validators.required, Validators.maxLength(50)]],
    talla: ['M', [Validators.required]],
    precio: [null as number | null, [Validators.required, Validators.min(0)]],
    stock: [null as number | null, [Validators.required, Validators.min(0)]],
    imagenUrl: [''],
  });

  protected readonly previewUrl = signal<string>('');

  protected readonly filtradas = computed(() => {
    const q = normalizar(this.busqueda().trim());
    if (!q) return this.camisetas();
    return this.camisetas().filter((c) =>
      normalizar(`${c.equipo} ${c.liga} ${c.temporada} ${c.talla}`).includes(q),
    );
  });

  ngOnInit(): void {
    this.cargar();
    this.form.get('imagenUrl')?.valueChanges.subscribe((val) => {
      this.previewUrl.set(val?.trim() || '');
      this.previewImagenRota.set(false);
    });
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

  // --- Modal Crear / Editar ---
  protected abrirModalCrear(): void {
    this.modoModal.set('crear');
    this.camisetaEditandoId.set(null);
    this.errorFormulario.set(null);
    this.previewImagenRota.set(false);
    this.previewUrl.set('');
    this.form.reset({
      equipo: '',
      liga: '',
      temporada: '',
      talla: 'M',
      precio: null,
      stock: 10,
      imagenUrl: '',
    });
    this.modalAbierto.set(true);
  }

  protected abrirModalEditar(camiseta: Camiseta): void {
    this.modoModal.set('editar');
    this.camisetaEditandoId.set(camiseta.id);
    this.errorFormulario.set(null);
    this.previewImagenRota.set(false);
    this.previewUrl.set(camiseta.imagenUrl || '');
    this.form.patchValue({
      equipo: camiseta.equipo,
      liga: camiseta.liga,
      temporada: camiseta.temporada,
      talla: camiseta.talla,
      precio: camiseta.precio,
      stock: camiseta.stock,
      imagenUrl: camiseta.imagenUrl || '',
    });
    this.modalAbierto.set(true);
  }

  protected cerrarModal(): void {
    if (this.guardando()) return;
    this.modalAbierto.set(false);
  }

  protected guardarCamiseta(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: CamisetaPayload = {
      equipo: this.form.value.equipo!.trim(),
      liga: this.form.value.liga!.trim(),
      temporada: this.form.value.temporada!.trim(),
      talla: this.form.value.talla!.trim(),
      precio: Number(this.form.value.precio),
      stock: Number(this.form.value.stock),
      imagenUrl: this.form.value.imagenUrl?.trim() || null,
    };

    this.guardando.set(true);
    this.errorFormulario.set(null);

    if (this.modoModal() === 'crear') {
      this.camisetaService
        .crear(payload)
        .pipe(finalize(() => this.guardando.set(false)))
        .subscribe({
          next: (nueva) => {
            this.camisetas.update((lista) => [nueva, ...lista]);
            this.modalAbierto.set(false);
          },
          error: (err) => this.errorFormulario.set(mensajeDeError(err)),
        });
    } else {
      const id = this.camisetaEditandoId();
      if (!id) return;
      this.camisetaService
        .actualizar(id, payload)
        .pipe(finalize(() => this.guardando.set(false)))
        .subscribe({
          next: (actualizada) => {
            this.camisetas.update((lista) =>
              lista.map((c) => (c.id === actualizada.id ? actualizada : c))
            );
            this.imagenesRotas.update((set) => {
              const copia = new Set(set);
              copia.delete(actualizada.id);
              return copia;
            });
            this.modalAbierto.set(false);
          },
          error: (err) => this.errorFormulario.set(mensajeDeError(err)),
        });
    }
  }

  // --- Eliminación ---
  protected abrirModalEliminar(camiseta: Camiseta): void {
    this.camisetaAEliminar.set(camiseta);
    this.errorEliminar.set(null);
  }

  protected cancelarEliminar(): void {
    if (this.eliminando()) return;
    this.camisetaAEliminar.set(null);
  }

  protected confirmarEliminar(): void {
    const camiseta = this.camisetaAEliminar();
    if (!camiseta) return;

    this.eliminando.set(true);
    this.errorEliminar.set(null);

    this.camisetaService
      .eliminar(camiseta.id)
      .pipe(finalize(() => this.eliminando.set(false)))
      .subscribe({
        next: () => {
          this.camisetas.update((lista) => lista.filter((c) => c.id !== camiseta.id));
          this.camisetaAEliminar.set(null);
        },
        error: (err) => this.errorEliminar.set(mensajeDeError(err)),
      });
  }
}
