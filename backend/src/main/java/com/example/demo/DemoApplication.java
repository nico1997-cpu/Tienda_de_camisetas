package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		// Carga el .env local; si no existe (ej. en el servidor de despliegue), lo ignora
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		if (dotenv != null) {
			dotenv.entries().forEach(entry -> {
				if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
					System.setProperty(entry.getKey(), entry.getValue());
				}
			});
		}

		SpringApplication.run(DemoApplication.class, args);
	}

}
