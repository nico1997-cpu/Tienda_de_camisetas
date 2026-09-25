import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Compra } from '../../../core/models/compra.model';
import { CompraService } from '../../../core/services/compra.service';
import { mensajeDeError } from '../../../core/utils/http-error';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './mis-compras.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisComprasComponent implements OnInit {
  private readonly compraService = inject(CompraService);
  protected readonly moneda = environment.moneda;

  protected readonly compras = signal<Compra[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.compraService
      .historial()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (lista) => this.compras.set([...lista].sort((a, b) => b.fecha.localeCompare(a.fecha))),
        error: (err) => this.error.set(mensajeDeError(err)),
      });
  }
}
