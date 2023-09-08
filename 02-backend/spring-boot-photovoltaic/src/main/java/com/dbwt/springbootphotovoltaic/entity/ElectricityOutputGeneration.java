package com.dbwt.springbootphotovoltaic.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "electricity_output_generation")
@Data
public class ElectricityOutputGeneration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "timestamp")
    private Long timestamp;

    @Column(name = "electricity_output")
    private Double electricityOutput;
}
