package com.example.demo.repositories;

import com.example.demo.models.Camiseta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CamisetaRepository extends JpaRepository<Camiseta, Long> {

    List<Camiseta> findByEquipo(String equipo);

    List<Camiseta> findByLiga(String liga);
}
