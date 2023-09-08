package com.dbwt.springbootphotovoltaic.dao;

import com.dbwt.springbootphotovoltaic.entity.ElectricityOutputGeneration;
import com.dbwt.springbootphotovoltaic.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ElectricityOutputGenerationRepository extends JpaRepository<ElectricityOutputGeneration, Long> {
    List<ElectricityOutputGeneration> findByProductId(@RequestParam("productId") Long productId);

}
