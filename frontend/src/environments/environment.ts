export const environment = {
  production: false,
  // En desarrollo, `ng serve` redirige /api → http://localhost:8080 (ver proxy.conf.json).
  // En producción usa la URL completa de tu API, p. ej. 'https://mi-api.up.railway.app/api'
  // (y habilita CORS en Spring Boot: ver backend/src/main/java/.../CorsConfig.java).
  apiUrl: 'https://tienda-camisetas-backend-v1.onrender.com/api', // Nueva URL en Render
  moneda: 'COP',
};
