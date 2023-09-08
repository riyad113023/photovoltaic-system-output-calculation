package com.dbwt.springbootphotovoltaic.service;

import com.dbwt.springbootphotovoltaic.dao.ElectricityOutputGenerationRepository;
import com.dbwt.springbootphotovoltaic.dao.ProductRepository;
import com.dbwt.springbootphotovoltaic.dao.WeatherDataRepository;
import com.dbwt.springbootphotovoltaic.entity.ElectricityOutputGeneration;
import com.dbwt.springbootphotovoltaic.entity.Product;
import com.dbwt.springbootphotovoltaic.entity.WeatherData;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;


@Service
public class ElectricityOutputGenerationService {

    private ProductRepository productRepository;

    private ElectricityOutputGenerationRepository electricityOutputGenerationRepository;

    private WeatherDataRepository weatherDataRepository;


    public ElectricityOutputGenerationService(ProductRepository productRepository, ElectricityOutputGenerationRepository electricityOutputGenerationRepository, WeatherDataRepository  weatherDataRepository) {
        this.productRepository = productRepository;
        this.electricityOutputGenerationRepository = electricityOutputGenerationRepository;
        this.weatherDataRepository = weatherDataRepository;
    }


    public void calculateAndStoreProductOutputGenerationPerHour(long startTimestamp, long endTimestamp){
        List<WeatherData> weatherDataList = weatherDataRepository.findByTimestampBetween(startTimestamp, endTimestamp);
        for(WeatherData weatherData : weatherDataList){
            calculateProductOutputGenerationPerHour(weatherData);
        }
    }
    public void calculateProductOutputGenerationPerHour(WeatherData weatherData){

        Optional<Product> product =  productRepository.findById(weatherData.getProductId());
        double efficiency = calculateEfficiency(product.get(), weatherData);
        double output = product.get().getArea() * product.get().getPowerPeak() * efficiency;

        saveProductOutputGenerationPerHour(weatherData, output);
    }

    private void saveProductOutputGenerationPerHour(WeatherData weatherData, double output) {
        ElectricityOutputGeneration electricityOutputGeneration = new ElectricityOutputGeneration();
        electricityOutputGeneration.setProductId(weatherData.getProductId());
        electricityOutputGeneration.setTimestamp(weatherData.getTimestamp());
        electricityOutputGeneration.setElectricityOutput(output);
        electricityOutputGenerationRepository.save(electricityOutputGeneration);

    }

    private double calculateEfficiency(Product product, WeatherData weatherData) {
        double efficiencyDefault = 0.75;
        double efficiencyLow = 0.50;
        double efficiencyHigh = 0.90;

        if(weatherData.getWeatherMainGroup().equalsIgnoreCase("Rain")){
            return 0.0;
        }

        if(getHourOfDayFromTimestamp(weatherData.getTimestamp()) < 6
                || getHourOfDayFromTimestamp(weatherData.getTimestamp()) > 17){
            return 0.0;
        }

        if(weatherData.getWeatherMainGroup().equalsIgnoreCase("Clear")){
            if(weatherData.getTemperature() >= 25){
                if(checkIfInclinationOkay(product) && checkIfOrientationOkay(product) && weatherData.getWindSpeed() < 2.00){
                    return efficiencyHigh;
                }
                else {
                    return 0.60;
                }
            }
            else{
                if(!checkIfInclinationOkay(product) || !checkIfOrientationOkay(product)){
                    return efficiencyLow;
                }
                else {
                    return efficiencyDefault;
                }
            }
        }
        else if (weatherData.getWeatherMainGroup().equalsIgnoreCase("Clouds")) {
            if(weatherData.getCloudPercentage() >=10 && weatherData.getCloudPercentage() <= 20){
                if(weatherData.getTemperature() >= 25){
                    if(checkIfInclinationOkay(product) && checkIfOrientationOkay(product) && weatherData.getWindSpeed() < 2.00){
                        return efficiencyHigh;
                    }
                }
                else {
                    return 0.60;
                }
            }
            if(weatherData.getCloudPercentage() >=20 && weatherData.getCloudPercentage() <= 40){
                if(weatherData.getTemperature() >= 25){
                    if(checkIfInclinationOkay(product) && checkIfOrientationOkay(product)){
                        return efficiencyDefault;
                    }
                    else {
                        return efficiencyLow;
                    }
                }
                else {
                    return 0.60;
                }
            }
        }
        else {
            return  efficiencyDefault;
        }
        return efficiencyDefault;
    }

    private boolean checkIfInclinationOkay(Product product){
        double upperLimit = product.getLatitude() + 5;
        double lowerLimit = product.getLatitude() - 5;

        if(product.getInclination() >= lowerLimit && product.getInclination() <= upperLimit){
            return true;
        }
        else {
            return false;
        }
    }

    private boolean checkIfOrientationOkay(Product product){

        if(product.getLatitude() >= 0 && product.getOrientation().equalsIgnoreCase("South")){
            return true;
        }
        if(product.getLatitude() < 0 && product.getOrientation().equalsIgnoreCase("North")){
            return true;
        }
        else {
            return false;
        }
    }

    public int getHourOfDayFromTimestamp(long timestamp){
        // Create an Instant object from the timestamp
        Instant instant = Instant.ofEpochSecond(timestamp);

        // Create a LocalDateTime object from the Instant and specify the time zone if needed
        LocalDateTime dateTime = LocalDateTime.ofInstant(instant, ZoneId.of("Europe/Berlin"));

        // Get the hour of the day
        int hour = dateTime.getHour();

        System.out.println("Hour of the day: " + hour);

        return hour;
    }


}
