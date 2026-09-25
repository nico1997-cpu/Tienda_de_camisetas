import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegistroRequest } from '../models/usuario.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface SesionUsuario {
  nombre: string;
  email: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/usuarios`;

  private readonly _token = signal<string | null>(this.leer(TOKEN_KEY));
  private readonly _usuario = signal<SesionUsuario | null>(this.leerUsuario());

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);
  readonly esAdmin = computed(() => this._usuario()?.rol?.toUpperCase() === 'ADMIN');

  login(datos: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.url}/login`, datos)
      .pipe(tap((res) => this.guardarSesion(res)));
  }

  registrar(datos: RegistroRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.url}/registro`, datos)
      .pipe(tap((res) => this.guardarSesion(res)));
  }

  logout(): void {
    this.borrar(TOKEN_KEY);
    this.borrar(USER_KEY);
    this._token.set(null);
    this._usuario.set(null);
  }

  /** Para el guard: hay token y no ha expirado (el backend emite JWT de 30 min). */
  hasValidSession(): boolean {
    const token = this._token();
    if (!token) return false;
    if (this.estaExpirado(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  private guardarSesion(res: AuthResponse): void {
    const usuario: SesionUsuario = {
      nombre: res.nombre,
      email: res.email,
      rol: res.rol || 'USER',
    };
    this.escribir(TOKEN_KEY, res.token);
    this.escribir(USER_KEY, JSON.stringify(usuario));
    this._token.set(res.token);
    this._usuario.set(usuario);
  }

  private estaExpirado(token: string): boolean {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
      return true; // token malformado → se trata como inválido
    }
  }

  private leerUsuario(): SesionUsuario | null {
    try {
      const raw = this.leer(USER_KEY);
      return raw ? (JSON.parse(raw) as SesionUsuario) : null;
    } catch {
      return null;
    }
  }

  // localStorage puede lanzar (modo privado, cuota): se encapsula para no romper la app.
  private leer(clave: string): string | null {
    try { return localStorage.getItem(clave); } catch { return null; }
  }
  private escribir(clave: string, valor: string): void {
    try { localStorage.setItem(clave, valor); } catch { /* sin persistencia */ }
  }
  private borrar(clave: string): void {
    try { localStorage.removeItem(clave); } catch { /* sin persistencia */ }
  }
}
