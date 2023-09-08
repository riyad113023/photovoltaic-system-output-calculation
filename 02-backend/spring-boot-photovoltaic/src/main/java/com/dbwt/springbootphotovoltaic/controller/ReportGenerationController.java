package com.dbwt.springbootphotovoltaic.controller;

import com.dbwt.springbootphotovoltaic.requestmodels.UpdateProductRequest;
import com.dbwt.springbootphotovoltaic.service.EmailSenderService;
import com.dbwt.springbootphotovoltaic.service.ProductService;
import com.dbwt.springbootphotovoltaic.service.ReportGenerationService;
import com.dbwt.springbootphotovoltaic.util.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ReportGenerationController {

    private ReportGenerationService reportGenerationService;

    private ProductService productService;

    @Autowired
    public ReportGenerationController(ReportGenerationService reportGenerationService, ProductService productService) {
        this.reportGenerationService = reportGenerationService;
        this.productService = productService;
    }

    @PostMapping("/secure/generate/report")
    public void getReportByProductId(@RequestHeader(value = "Authorization") String token,
                                     @RequestBody UpdateProductRequest updateProductRequest) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        boolean isSuccessful= reportGenerationService.getElectricityOutputGenerationByProductId(updateProductRequest.getId());
        if(isSuccessful){
            productService.deactivateProduct(updateProductRequest.getId());
            reportGenerationService.generateEmail(userEmail, updateProductRequest.getId());
        }
    }

}
