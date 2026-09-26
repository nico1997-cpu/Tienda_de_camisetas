package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Necesario cuando Angular corre en otro origen (p. ej. http://localhost:4200 o tu dominio de producción)
 * y llama directamente a la API. En desarrollo con `ng serve` NO hace falta: proxy.conf.json evita CORS.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://camisasjn.netlify.app", "http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept")
                .allowCredentials(true)
                .maxAge(3600); // Para cachear la respuesta preflight por 1 hora
    }
}
