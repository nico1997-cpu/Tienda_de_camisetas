package com.example.demo.controllers;

import com.example.demo.models.Camiseta;
import com.example.demo.services.CamisetaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/camisetas")
public class CamisetaController {

    private final CamisetaService camisetaService;

    public CamisetaController(CamisetaService camisetaService) {
        this.camisetaService = camisetaService;
    }

    @GetMapping
    public List<Camiseta> listar() {
        return camisetaService.listarTodas();
    }

    @GetMapping("/{id}")
    public Camiseta ver(@PathVariable Long id) {
        return camisetaService.buscarPorId(id);
    }

    @PostMapping
    public Camiseta crear(@RequestBody Camiseta camiseta) {
        return camisetaService.crear(camiseta);
    }
}
