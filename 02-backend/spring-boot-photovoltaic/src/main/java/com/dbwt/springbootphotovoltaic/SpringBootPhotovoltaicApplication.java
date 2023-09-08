package com.dbwt.springbootphotovoltaic;

import com.dbwt.springbootphotovoltaic.service.ElectricityOutputGenerationService;
import com.dbwt.springbootphotovoltaic.service.EmailSenderService;
import com.dbwt.springbootphotovoltaic.service.ReportGenerationService;
import com.dbwt.springbootphotovoltaic.service.WeatherDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpringBootPhotovoltaicApplication {

	public static void main(String[] args) {SpringApplication.run(SpringBootPhotovoltaicApplication.class, args);
	}



}
