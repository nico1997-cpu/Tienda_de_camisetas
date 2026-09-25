package com.example.demo.controllers;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegistroRequest;
import com.example.demo.models.Usuario;
import com.example.demo.services.JwtService;
import com.example.demo.services.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioController(UsuarioService usuarioService, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    @PostMapping("/registro")
    public LoginResponse registrar(@Valid @RequestBody RegistroRequest request) {
        Usuario usuario = usuarioService.registrar(request);
        String token = jwtService.generarToken(usuario.getEmail());
        return new LoginResponse(token, usuario.getNombre(), usuario.getEmail(), usuario.getRol());
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioService.login(request);
        String token = jwtService.generarToken(usuario.getEmail());
        return new LoginResponse(token, usuario.getNombre(), usuario.getEmail(), usuario.getRol());
    }

    @GetMapping("/perfil")
    public Usuario perfil(HttpServletRequest request) {
        String email = (String) request.getAttribute("usuarioEmail");
        return usuarioService.obtenerAutenticado(email);
    }
}
