import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, concatMap, finalize, from, map, of, throwError, toArray } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Compra } from '../../../core/models/compra.model';
import { AuthService } from '../../../core/services/auth.service';
import { CartItem, CartService } from '../../../core/services/cart.service';
import { CompraService } from '../../../core/services/compra.service';
import { mensajeDeError } from '../../../core/utils/http-error';

export interface ResultadoItem {
  item: CartItem;
  compra: Compra | null;
  error: string | null;
}

@Component({
  selector: 'app-compra-view',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './compra-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompraViewComponent {
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);
  private readonly compraService = inject(CompraService);
  protected readonly moneda = environment.moneda;

  protected readonly procesando = signal(false);
  protected readonly resultados = signal<ResultadoItem[] | null>(null);

  protected readonly exitosas = computed(() => (this.resultados() ?? []).filter((r) => r.compra));
  protected readonly fallidas = computed(() => (this.resultados() ?? []).filter((r) => r.error));
  protected readonly totalPagado = computed(() =>
    this.exitosas().reduce((suma, r) => suma + (r.compra?.total ?? 0), 0),
  );

  /**
   * La API registra una camiseta por compra (CompraRequest = camisetaId + cantidad),
   * por eso se envía una petición por cada línea del carrito, en secuencia.
   * Las líneas que se compran bien salen del carrito; las que fallan se quedan.
   */
  protected confirmar(): void {
    const items = this.cart.items();
    if (items.length === 0 || this.procesando()) return;

    this.procesando.set(true);

    from(items)
      .pipe(
        concatMap((item) =>
          this.compraService.crear({ camisetaId: item.camiseta.id, cantidad: item.cantidad }).pipe(
            map((compra): ResultadoItem => ({ item, compra, error: null })),
            catchError((err) =>
              // 401 = sesión vencida: el interceptor ya redirige a /login, se corta el proceso.
              err?.status === 401
                ? throwError(() => err)
                : of<ResultadoItem>({
                    item,
                    compra: null,
                    error: mensajeDeError(err, {
                      409: 'No hay stock suficiente.',
                      404: 'Esta camiseta ya no está disponible.',
                      400: 'Los datos de la compra no son válidos.',
                    }),
                  }),
            ),
          ),
        ),
        toArray(),
        finalize(() => this.procesando.set(false)),
      )
      .subscribe({
        next: (resultados) => {
          resultados
            .filter((r) => r.compra)
            .forEach((r) => this.cart.remover(r.item.camiseta.id));
          this.resultados.set(resultados);
        },
        error: () => {
          /* sesión vencida: ya se gestionó en el interceptor */
        },
      });
  }
}
