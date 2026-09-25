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
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200", "AQUI_TU_ENLACE_DE_NETLIFY") // añade aquí tu dominio de producción
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type");
    }
}
