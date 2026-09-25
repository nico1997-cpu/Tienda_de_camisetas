# Tienda de Camisetas — Frontend (Angular 20, Standalone + Signals)

Cliente web para la API REST en Spring Boot (`Tienda_de_camisetas/demo`). Compatible con Angular 17+.

## Ejecutar
```bash
npm install
# 1) Levanta la API (Spring Boot en http://localhost:8080)
# 2) Levanta el frontend:
npm start          # http://localhost:4200  (proxy.conf.json redirige /api → :8080)
```
Producción: cambia `apiUrl` en `src/environments/environment.ts` a la URL completa de tu API
y añade `backend-snippets/CorsConfig.java` al backend con tu dominio permitido.

## Estructura
```
src/app/
├── core/                      # Lógica sin UI (singleton)
│   ├── models/                # Camiseta, Usuario/AuthResponse, Compra
│   ├── services/              # AuthService, CamisetaService, CompraService, CartService
│   ├── interceptors/          # auth.interceptor.ts  (Bearer + manejo de 401)
│   ├── guards/                # auth.guard.ts
│   └── utils/                 # mensajes de error HTTP, redirección segura
├── shared/navbar/             # NavbarComponent
└── features/                  # Pantallas (carga perezosa por ruta)
    ├── auth/login, auth/registro
    ├── catalogo/camiseta-list
    ├── carrito/cart-view      # /carrito   (pública)
    ├── carrito/compra-view    # /checkout  (privada)
    └── compras/mis-compras    # /mis-compras (privada)
```

## Contrato con la API (según el código del backend)
| Acción | Endpoint |
|---|---|
| Registro | `POST /api/usuarios/registro` → `{token, nombre, email}` |
| Login | `POST /api/usuarios/login` → `{token, nombre, email}` |
| Catálogo | `GET /api/camisetas`, `GET /api/camisetas/{id}`, `POST /api/camisetas` |
| Comprar | `POST /api/compras` con `{camisetaId, cantidad}` (una camiseta por petición) |
| Historial | `GET /api/compras` |

El JWT dura 30 min (`jwt.expiration-ms=1800000`): el guard comprueba `exp` y el interceptor cierra sesión ante un 401.
