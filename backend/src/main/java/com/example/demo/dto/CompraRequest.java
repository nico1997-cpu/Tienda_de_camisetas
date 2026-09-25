package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CompraRequest {

    @NotNull
    private Long camisetaId;

    @NotNull
    @Positive
    private Integer cantidad;

    public Long getCamisetaId() { return camisetaId; }
    public void setCamisetaId(Long camisetaId) { this.camisetaId = camisetaId; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
