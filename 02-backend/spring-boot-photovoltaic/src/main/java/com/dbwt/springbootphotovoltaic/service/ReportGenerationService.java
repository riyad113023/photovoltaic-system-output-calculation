package com.dbwt.springbootphotovoltaic.service;

import com.dbwt.springbootphotovoltaic.dao.ElectricityOutputGenerationRepository;
import com.dbwt.springbootphotovoltaic.dao.ProductRepository;
import com.dbwt.springbootphotovoltaic.dao.ReportGenerationRepository;
import com.dbwt.springbootphotovoltaic.entity.ElectricityOutputGeneration;
import com.dbwt.springbootphotovoltaic.entity.DailyReportGeneration;
import com.dbwt.springbootphotovoltaic.entity.Product;
import com.dbwt.springbootphotovoltaic.entity.WeatherData;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportGenerationService {

    private ElectricityOutputGenerationRepository electricityOutputGenerationRepository;
    private ReportGenerationRepository reportGenerationRepository;

    private ProductRepository productRepository;

    private EmailSenderService emailSenderService;


    private ProductService productService;

    public ReportGenerationService(ElectricityOutputGenerationRepository electricityOutputGenerationRepository, ReportGenerationRepository reportGenerationRepository,
                                   ProductRepository productRepository, EmailSenderService emailSenderService,
                                   ProductService productService) {
        this.electricityOutputGenerationRepository = electricityOutputGenerationRepository;
        this.productRepository = productRepository;
        this.emailSenderService = emailSenderService;
        this.reportGenerationRepository = reportGenerationRepository;
        this.productService = productService;
    }

    public boolean getElectricityOutputGenerationByProductId(long productId){

        List<ElectricityOutputGeneration> electricityOutputGenerationList = electricityOutputGenerationRepository.findByProductId(productId);

        Map<Long, List<ElectricityOutputGeneration>> map = new HashMap<>();

        try {
            for(ElectricityOutputGeneration electricityOutputGeneration : electricityOutputGenerationList){
                long timestampOfDayStart =  getStartOfDayTimestamp(electricityOutputGeneration.getTimestamp());
                if(map.containsKey(timestampOfDayStart)){
                    map.get(timestampOfDayStart).add(electricityOutputGeneration);
                }
                else{
                    List<ElectricityOutputGeneration> electricityOutputGenerations =  new ArrayList<>();
                    electricityOutputGenerations.add(electricityOutputGeneration);
                    map.put(timestampOfDayStart, electricityOutputGenerations);
                }
            }

            if(map.size() >0){

                LinkedHashMap<Long, List<ElectricityOutputGeneration>> sortedMap = map.entrySet()
                        .stream()
                        .sorted(Map.Entry.comparingByKey())
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                Map.Entry::getValue,
                                (oldValue, newValue) -> oldValue, LinkedHashMap::new));

                calculateAndStoreDailyOutputOfProduct( productId, sortedMap);
                return true;
            }
            else {
                return false;
            }
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return false;
        }
    }

    private void calculateAndStoreDailyOutputOfProduct(long productId, Map<Long, List<ElectricityOutputGeneration>> map) {
        List<DailyReportGeneration> dailyReportGenerationList = new ArrayList<>();

        try {
            for (Map.Entry<Long, List<ElectricityOutputGeneration>> entry : map.entrySet()) {
                Long key = entry.getKey();
                List<ElectricityOutputGeneration> electricityOutputGenerationList = entry.getValue();

                double totalDailyOutput = 0.0;

                for(ElectricityOutputGeneration electricityOutputGeneration : electricityOutputGenerationList){
                    totalDailyOutput += electricityOutputGeneration.getElectricityOutput();
                }

                DailyReportGeneration dailyReportGeneration =  new DailyReportGeneration();
                dailyReportGeneration.setProductId(productId);
                dailyReportGeneration.setDayTimestamp(key);
                dailyReportGeneration.setDailyOutput(totalDailyOutput);
                // Create an Instant object from the timestamp
                Instant instant = Instant.ofEpochSecond(key);

                // Convert Instant to LocalDateTime
                LocalDateTime dateTime = LocalDateTime.ofInstant(instant, ZoneId.of("Europe/Berlin"));

                // Define the desired date format
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

                // Format LocalDateTime to String representation
                String dateString = dateTime.format(formatter);

                dailyReportGeneration.setDateString(dateString);
                dailyReportGenerationList.add(dailyReportGeneration);
            }

            reportGenerationRepository.saveAll(dailyReportGenerationList);
        }
        catch (Exception e){
            throw e;
        }
    }


    public long getStartOfDayTimestamp(long timestamp){
        // Create an Instant object from the timestamp
        Instant instant = Instant.ofEpochSecond(timestamp);

        // Create a LocalDateTime object from the Instant and specify the time zone if needed
        LocalDateTime dateTime = LocalDateTime.ofInstant(instant, ZoneId.of("Europe/Berlin"));

        // Get the LocalDate part of the LocalDateTime
        LocalDate localDate = dateTime.toLocalDate();

        // Create a LocalTime object for the start of the day
        LocalTime startTime = LocalTime.MIN;

        // Create a LocalDateTime object combining the LocalDate and start time
        LocalDateTime startOfDay = LocalDateTime.of(localDate, startTime);

        // Get the timestamp of the start of the day
        long startTimestamp = startOfDay.atZone(ZoneId.of("Europe/Berlin")).toEpochSecond();

        System.out.println("Start timestamp of the day: " + startTimestamp);
        return startTimestamp;
    }

    public void generateEmail(String userEmail, Long productId) {

        List<DailyReportGeneration>  dailyReportGenerationList = reportGenerationRepository.findByProductIdOrderByDayTimestampAsc(productId);

        Optional<Product> product = productRepository.findById(productId);

        double output = 0.0;
        DecimalFormat df = new DecimalFormat("#.##");


        for (DailyReportGeneration dailyReportGeneration : dailyReportGenerationList){

            output += Double.valueOf(df.format(dailyReportGeneration.getDailyOutput()));
        }

        String startDate = dailyReportGenerationList.get(0).getDateString();
        String endDate = dailyReportGenerationList.get(dailyReportGenerationList.size()-1).getDateString();

        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("Dear user, ");
        stringBuilder.append(System.getProperty("line.separator"));
        stringBuilder.append(System.getProperty("line.separator"));
        stringBuilder.append("The electricity output for product: " + product.get().getTitle());
        stringBuilder.append(System.getProperty("line.separator"));
        stringBuilder.append("From " + startDate + " to "+ endDate + " is:");
        stringBuilder.append(System.getProperty("line.separator"));
        stringBuilder.append(Double.valueOf(df.format(output)) + " watts");



        String subject = "Electricity output for product";

        emailSenderService.sendEmail(userEmail, subject, stringBuilder.toString());

    }

    @Scheduled(cron = "0 10 00 * * ?", zone = "Europe/Berlin")
    public void checkAndGenerateReportForExpiredProducts(){
        List<Product> productArrayList = productRepository.findByIsActive(true);

        for (Product product : productArrayList){
            LocalDate createDate = product.getCreatedDate().toInstant().atZone(ZoneId.of("Europe/Berlin")).toLocalDate();
            LocalDate today = LocalDate.now();

            if(today.minusDays(30).isAfter(createDate) ){
                System.out.println(product.getTitle() + " is Expired");
                boolean isSuccessful= getElectricityOutputGenerationByProductId(product.getId());
                if(isSuccessful){
                    productService.deactivateProduct(product.getId());
                    generateEmail(product.getCreatedBy(), product.getId());
                }
            }
        }
    }
}
