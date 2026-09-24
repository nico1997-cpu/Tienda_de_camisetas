import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Compra, CompraRequest } from '../models/compra.model';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/compras`;

  /** Requiere JWT. Registra la compra de una camiseta y descuenta stock. */
  crear(solicitud: CompraRequest): Observable<Compra> {
    return this.http.post<Compra>(this.url, solicitud);
  }

  /** Historial de compras del usuario autenticado. */
  historial(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.url);
  }
}
