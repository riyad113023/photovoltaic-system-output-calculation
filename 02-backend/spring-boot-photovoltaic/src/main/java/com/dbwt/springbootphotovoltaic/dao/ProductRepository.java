package com.dbwt.springbootphotovoltaic.dao;

import com.dbwt.springbootphotovoltaic.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    Page<Product> findByProjectId(@RequestParam("projectId") Long projectId, Pageable pageable);

    Page<Product> findByCreatedByContaining(@RequestParam("createdBy") String createdBy, Pageable pageable);

    Page<Product> findByCreatedByAndTitleContaining(@RequestParam("createdBy") String createdBy,@RequestParam("title") String title, Pageable pageable);

    Page<Product> findByCreatedByAndProjectId(@RequestParam("createdBy") String createdBy,@RequestParam("projectId") Long projectId, Pageable pageable);

    Page<Product> findByCreatedByAndIsActive(@RequestParam("createdBy") String createdBy,@RequestParam("isActive") Boolean isActive, Pageable pageable);
    List<Product> findByIsActive(@RequestParam("isActive") Boolean isActive);


}
