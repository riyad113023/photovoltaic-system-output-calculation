package com.dbwt.springbootphotovoltaic.service;

import com.dbwt.springbootphotovoltaic.dao.ProductRepository;
import com.dbwt.springbootphotovoltaic.dao.WeatherDataRepository;
import com.dbwt.springbootphotovoltaic.entity.Product;
import com.dbwt.springbootphotovoltaic.entity.WeatherData;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherDataService {

    private ProductRepository productRepository;

    private WeatherDataRepository weatherDataRepository;

    private ElectricityOutputGenerationService electricityOutputGenerationService;

    private long startTimestamp;
    private long endTimeStamp;

    public WeatherDataService(ProductRepository productRepository, WeatherDataRepository weatherDataRepository, ElectricityOutputGenerationService electricityOutputGenerationService) {
        this.productRepository = productRepository;
        this.weatherDataRepository = weatherDataRepository;
        this.electricityOutputGenerationService = electricityOutputGenerationService;
    }

    public List<WeatherData> callOpenWeatherMapAPI(Product product){
        List<WeatherData> weatherDataList = new ArrayList<>();

        RestTemplate restTemplate = new RestTemplate();

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        LocalDateTime zerothHour = yesterday.atStartOfDay();

        LocalDateTime startOfTwentyThirdHour = zerothHour.withHour(23).withMinute(0).withSecond(0);

        ZoneId zone = ZoneId.of("Europe/Berlin");
        long zerothHourTimestamp = zerothHour.atZone(zone).toEpochSecond();
        long startOfTwentyThirdHourTimestamp = startOfTwentyThirdHour.atZone(zone).toEpochSecond();

        System.out.println("0th Hour Timestamp: " + zerothHourTimestamp);
        System.out.println("Start of 23rd Hour Timestamp: " + startOfTwentyThirdHourTimestamp);

        startTimestamp = zerothHourTimestamp;
        endTimeStamp = startOfTwentyThirdHourTimestamp;
        String appId = "c09c8623fca58578dfe7400d5178e487";

        String url = String.format("https://history.openweathermap.org/data/2.5/history/city?lat=%s&lon=%s&type=hour&start=%s&end=%s&units=metric&appid=%s",
                product.getLatitude(), product.getLongitude(), startTimestamp, endTimeStamp, appId);

        System.out.println("API URL "+ url);
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JSONObject obj = new JSONObject(response.getBody());

            JSONArray arr = obj.getJSONArray("list");
            for (int i = 0; i < arr.length(); i++)
            {
                JSONObject main = arr.getJSONObject(i).getJSONObject("main");
                JSONObject wind = arr.getJSONObject(i).getJSONObject("wind");
                JSONObject clouds = arr.getJSONObject(i).getJSONObject("clouds");
                JSONArray weatherArr = arr.getJSONObject(i).getJSONArray("weather");
                JSONObject weatherObj = (JSONObject) weatherArr.get(0);


                WeatherData weatherData = new WeatherData();
                weatherData.setProductId(product.getId());
                weatherData.setLatitude(product.getLatitude());
                weatherData.setLongitude(product.getLongitude());
                weatherData.setTemperature(main.getFloat("temp"));
                weatherData.setPressure(main.getFloat("pressure"));
                weatherData.setHumidity(main.getFloat("humidity"));
                weatherData.setTemperatureMin(main.getFloat("temp_min"));
                weatherData.setTemperatureMax(main.getFloat("temp_max"));
                weatherData.setWindSpeed(wind.getFloat("speed"));
                weatherData.setWindDirection(wind.getFloat("deg"));
                weatherData.setCloudPercentage(clouds.getFloat("all"));
                weatherData.setWeatherMainGroup(weatherObj.getString("main"));
                weatherData.setWeatherMainGroupDescription(weatherObj.getString("description"));
                weatherData.setTimestamp(arr.getJSONObject(i).getLong("dt"));

                weatherDataList.add(weatherData);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return weatherDataList;
    }

    @Scheduled(cron = "0 25 00 * * ?", zone = "Europe/Berlin")
    public void fetchWeatherData(){
        System.out.println("cron fired" + LocalDate.now());
         List<Product> productArrayList = productRepository.findByIsActive(true);

         for (Product product : productArrayList){
             List<WeatherData> weatherDataList = callOpenWeatherMapAPI(product);

             weatherDataRepository.saveAll(weatherDataList);
         }

         electricityOutputGenerationService.calculateAndStoreProductOutputGenerationPerHour(startTimestamp, endTimeStamp);
    }


}
