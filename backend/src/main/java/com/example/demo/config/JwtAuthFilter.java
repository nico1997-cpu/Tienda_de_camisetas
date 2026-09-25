package com.example.demo.config;

import com.example.demo.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (jwtService.esTokenValido(token)) {
                // Dejamos el email disponible para que el controller lo use, sin repetir el parseo del token
                request.setAttribute("usuarioEmail", jwtService.extraerEmail(token));
            }
        }

        // El filtro nunca bloquea aquí: solo "etiqueta" la petición si el token es válido.
        // Cada controller protegido revisa si el atributo llegó o no (lo hacemos en la tarea 7).
        filterChain.doFilter(request, response);
    }
}
