package com.example.demo.controllers;

import com.example.demo.dto.CompraRequest;
import com.example.demo.models.Compra;
import com.example.demo.models.Usuario;
import com.example.demo.services.CompraService;
import com.example.demo.services.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    private final CompraService compraService;
    private final UsuarioService usuarioService;

    public CompraController(CompraService compraService, UsuarioService usuarioService) {
        this.compraService = compraService;
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public Compra crear(@Valid @RequestBody CompraRequest request, HttpServletRequest httpRequest) {
        Usuario usuario = usuarioAutenticado(httpRequest);
        return compraService.crear(usuario, request);
    }

    @GetMapping
    public List<Compra> historial(HttpServletRequest httpRequest) {
        Usuario usuario = usuarioAutenticado(httpRequest);
        return compraService.historialDe(usuario.getId());
    }

    private Usuario usuarioAutenticado(HttpServletRequest request) {
        String email = (String) request.getAttribute("usuarioEmail");
        return usuarioService.obtenerAutenticado(email);
    }
}
