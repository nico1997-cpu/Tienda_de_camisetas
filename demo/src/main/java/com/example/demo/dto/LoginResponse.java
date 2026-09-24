package com.example.demo.dto;

public class LoginResponse {

    private String token;
    private String nombre;
    private String email;

    public LoginResponse(String token, String nombre, String email) {
        this.token = token;
        this.nombre = nombre;
        this.email = email;
    }

    public String getToken() { return token; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
}
