package com.dbwt.springbootphotovoltaic.dao;

import com.dbwt.springbootphotovoltaic.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
