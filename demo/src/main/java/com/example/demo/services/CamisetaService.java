package com.example.demo.services;

import com.example.demo.models.Camiseta;
import com.example.demo.repositories.CamisetaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CamisetaService {

    private final CamisetaRepository camisetaRepository;

    public CamisetaService(CamisetaRepository camisetaRepository) {
        this.camisetaRepository = camisetaRepository;
    }

    public List<Camiseta> listarTodas() {
        return camisetaRepository.findAll();
    }

    public Camiseta buscarPorId(Long id) {
        return camisetaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Camiseta no encontrada"));
    }

    public Camiseta crear(Camiseta camiseta) {
        return camisetaRepository.save(camiseta);
    }

    public Camiseta actualizarStock(Camiseta camiseta) {
        return camisetaRepository.save(camiseta);
    }
}
