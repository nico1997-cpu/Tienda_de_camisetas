/** Entidad `Usuario` (GET /api/usuarios/perfil). El backend nunca devuelve la contraseña. */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

/** DTO `LoginRequest` */
export interface LoginRequest {
  email: string;
  contrasena: string;
}

/** DTO `RegistroRequest` (contrasena: mínimo 6 caracteres) */
export interface RegistroRequest {
  nombre: string;
  email: string;
  contrasena: string;
}

/** DTO `LoginResponse` — la respuesta de /login y /registro. */
export interface AuthResponse {
  token: string;
  nombre: string;
  email: string;
}
