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

    public Camiseta actualizar(Long id, Camiseta datos) {
        Camiseta camiseta = buscarPorId(id);
        camiseta.setEquipo(datos.getEquipo());
        camiseta.setLiga(datos.getLiga());
        camiseta.setTemporada(datos.getTemporada());
        camiseta.setTalla(datos.getTalla());
        camiseta.setPrecio(datos.getPrecio());
        camiseta.setStock(datos.getStock());
        camiseta.setImagenUrl(datos.getImagenUrl());
        return camisetaRepository.save(camiseta);
    }

    public void eliminar(Long id) {
        Camiseta camiseta = buscarPorId(id);
        try {
            camisetaRepository.delete(camiseta);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede eliminar la camiseta porque ya tiene compras asociadas.");
        }
    }

    public Camiseta actualizarStock(Camiseta camiseta) {
        return camisetaRepository.save(camiseta);
    }
}
