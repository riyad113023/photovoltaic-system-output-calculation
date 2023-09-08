package com.dbwt.springbootphotovoltaic.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "product")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "project_id")
    private Long projectId;

    @ManyToOne
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;

    @Column(name = "power_peak")
    private Float powerPeak;

    @Column(name = "orientation")
    private String orientation;

    @Column(name = "inclination")
    private Float inclination;

    @Column(name = "area")
    private Float area;

    @Column(name = "latitude")
    private Float latitude;

    @Column(name = "longitude")
    private Float longitude;

    @Column(name = "img")
    private String img;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at")
    private Date createdDate;

    @Column(name = "is_active")
    private Boolean isActive;


}
