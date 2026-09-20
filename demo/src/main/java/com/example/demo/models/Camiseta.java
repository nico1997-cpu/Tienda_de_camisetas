package com.example.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

@Entity
@Table(name = "camisetas")
public class Camiseta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String equipo;

    @NotBlank
    private String liga;

    @NotBlank
    private String temporada;

    @NotBlank
    private String talla; // S, M, L, XL

    @NotNull
    @PositiveOrZero
    private BigDecimal precio;

    @NotNull
    @PositiveOrZero
    private Integer stock;

    private String imagenUrl;

    public Camiseta() {}

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEquipo() { return equipo; }
    public void setEquipo(String equipo) { this.equipo = equipo; }

    public String getLiga() { return liga; }
    public void setLiga(String liga) { this.liga = liga; }

    public String getTemporada() { return temporada; }
    public void setTemporada(String temporada) { this.temporada = temporada; }

    public String getTalla() { return talla; }
    public void setTalla(String talla) { this.talla = talla; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}
