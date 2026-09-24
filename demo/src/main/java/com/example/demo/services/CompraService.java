package com.example.demo.services;

import com.example.demo.dto.CompraRequest;
import com.example.demo.models.Camiseta;
import com.example.demo.models.Compra;
import com.example.demo.models.Usuario;
import com.example.demo.repositories.CompraRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final CamisetaService camisetaService;

    public CompraService(CompraRepository compraRepository, CamisetaService camisetaService) {
        this.compraRepository = compraRepository;
        this.camisetaService = camisetaService;
    }

    public Compra crear(Usuario usuario, CompraRequest request) {
        Camiseta camiseta = camisetaService.buscarPorId(request.getCamisetaId());

        if (camiseta.getStock() < request.getCantidad()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No hay stock suficiente");
        }

        camiseta.setStock(camiseta.getStock() - request.getCantidad());
        camisetaService.actualizarStock(camiseta);

        Compra compra = new Compra();
        compra.setUsuario(usuario);
        compra.setCamiseta(camiseta);
        compra.setCantidad(request.getCantidad());
        compra.setTotal(camiseta.getPrecio().multiply(BigDecimal.valueOf(request.getCantidad())));

        return compraRepository.save(compra);
    }

    public List<Compra> historialDe(Long usuarioId) {
        return compraRepository.findByUsuarioId(usuarioId);
    }
}
