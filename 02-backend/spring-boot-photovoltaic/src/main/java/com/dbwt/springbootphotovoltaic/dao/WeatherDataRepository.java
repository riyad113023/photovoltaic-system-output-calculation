package com.dbwt.springbootphotovoltaic.dao;

import com.dbwt.springbootphotovoltaic.entity.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {

    List<WeatherData> findByTimestampBetween(long startTimestamp, long endTimestamp);
}
