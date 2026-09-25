package com.example.demo.controllers;

import com.example.demo.models.Camiseta;
import com.example.demo.models.Usuario;
import com.example.demo.services.CamisetaService;
import com.example.demo.services.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/camisetas")
public class CamisetaController {

    private final CamisetaService camisetaService;
    private final UsuarioService usuarioService;

    public CamisetaController(CamisetaService camisetaService, UsuarioService usuarioService) {
        this.camisetaService = camisetaService;
        this.usuarioService = usuarioService;
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
    public Camiseta crear(@Valid @RequestBody Camiseta camiseta, HttpServletRequest request) {
        validarAdmin(request);
        return camisetaService.crear(camiseta);
    }

    @PutMapping("/{id}")
    public Camiseta actualizar(@PathVariable Long id, @Valid @RequestBody Camiseta camiseta, HttpServletRequest request) {
        validarAdmin(request);
        return camisetaService.actualizar(id, camiseta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id, HttpServletRequest request) {
        validarAdmin(request);
        camisetaService.eliminar(id);
    }

    private void validarAdmin(HttpServletRequest request) {
        String email = (String) request.getAttribute("usuarioEmail");
        Usuario usuario = usuarioService.obtenerAutenticado(email);
        if (usuario == null || !"ADMIN".equalsIgnoreCase(usuario.getRol())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acceso denegado: se requiere rol de administrador");
        }
    }
}
