package com.dbwt.springbootphotovoltaic.dao;

import com.dbwt.springbootphotovoltaic.entity.DailyReportGeneration;
import com.dbwt.springbootphotovoltaic.entity.ElectricityOutputGeneration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ReportGenerationRepository extends JpaRepository<DailyReportGeneration, Long> {
    List<DailyReportGeneration> findByProductId(@RequestParam("productId") Long productId);
    List<DailyReportGeneration> findByProductIdOrderByDayTimestampAsc(@RequestParam("productId") Long productId);

}
