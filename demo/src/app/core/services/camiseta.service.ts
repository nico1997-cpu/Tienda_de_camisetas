import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Camiseta, CamisetaPayload } from '../models/camiseta.model';

/**
 * El CamisetaController actual solo expone GET (lista), GET /{id} y POST.
 * Cuando agregues PUT/DELETE en el backend, añade aquí actualizar() y eliminar().
 */
@Injectable({ providedIn: 'root' })
export class CamisetaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/camisetas`;

  listar(): Observable<Camiseta[]> {
    return this.http.get<Camiseta[]>(this.url);
  }

  obtener(id: number): Observable<Camiseta> {
    return this.http.get<Camiseta>(`${this.url}/${id}`);
  }

  crear(camiseta: CamisetaPayload): Observable<Camiseta> {
    return this.http.post<Camiseta>(this.url, camiseta);
  }
}
