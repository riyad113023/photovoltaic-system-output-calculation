package com.dbwt.springbootphotovoltaic.requestmodels;

import lombok.Data;

import javax.persistence.Column;

@Data
public class AddProductRequest {

    private String title;

    private String description;

    private Long projectId;

    private Float powerPeak;

    private String orientation;

    private Float inclination;

    private Float area;

    private Float latitude;

    private Float longitude;

    private String img;

    private String createBy;
}
