package com.dbwt.springbootphotovoltaic.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "daily_report_generation")
@Data
public class DailyReportGeneration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "day_timestamp")
    private Long dayTimestamp;

    @Column(name = "daily_output")
    private Double dailyOutput;

    @Column(name = "date_string")
    private String dateString;
}
