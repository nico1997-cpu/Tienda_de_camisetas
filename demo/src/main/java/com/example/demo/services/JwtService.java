package com.example.demo.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${JWT_SECRET}")
    private String secretCode;

    @Value("${jwt.expiration-ms:1800000}") // 30 minutos por defecto
    private long jwtExpirationMs;

    private SecretKey jwtSecret;

    @PostConstruct
    public void init() {
        this.jwtSecret = Keys.hmacShaKeyFor(secretCode.getBytes(StandardCharsets.UTF_8));
    }

    public String generarToken(String email) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(ahora)
                .setExpiration(expiracion)
                .signWith(jwtSecret, SignatureAlgorithm.HS512)
                .compact();
    }

    public String extraerEmail(String token) {
        return obtenerClaims(token).getSubject();
    }

    public boolean esTokenValido(String token) {
        try {
            obtenerClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims obtenerClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
