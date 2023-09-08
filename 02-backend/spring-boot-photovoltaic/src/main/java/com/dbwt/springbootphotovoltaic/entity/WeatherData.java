package com.dbwt.springbootphotovoltaic.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "weather_data")
@Data
public class WeatherData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    private Long productId;

    @Column(name = "latitude")
    private Float latitude;

    @Column(name = "longitude")
    private Float longitude;

    @Column(name = "timestamp")
    private Long timestamp;

    @Column(name = "temperature")
    private Float temperature;


    @Column(name = "pressure")
    private Float pressure;

    @Column(name = "humidity")
    private Float humidity;

    @Column(name = "temperature_min")
    private Float temperatureMin;

    @Column(name = "temperature_max")
    private Float temperatureMax;

    @Column(name = "wind_speed")
    private Float windSpeed;

    @Column(name = "wind_direction")
    private Float windDirection;

    @Column(name = "cloud_percentage")
    private Float cloudPercentage;

    @Column(name = "weather_main_group")
    private String weatherMainGroup;

    @Column(name = "weather_main_group_description")
    private String weatherMainGroupDescription;

}
