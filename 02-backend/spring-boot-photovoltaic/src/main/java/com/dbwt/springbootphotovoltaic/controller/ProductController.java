package com.dbwt.springbootphotovoltaic.controller;

import com.dbwt.springbootphotovoltaic.entity.Product;
import com.dbwt.springbootphotovoltaic.requestmodels.AddProductRequest;
import com.dbwt.springbootphotovoltaic.requestmodels.UpdateProductRequest;
import com.dbwt.springbootphotovoltaic.service.ProductService;
import com.dbwt.springbootphotovoltaic.util.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ProductController {

    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping("/secure/get/product")
    public void getProductByUser(@RequestHeader(value = "Authorization") String token) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
    }

    @PostMapping("/secure/add/product")
    public void postProduct(@RequestHeader(value = "Authorization") String token,
                            @RequestBody AddProductRequest addProductRequest) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        addProductRequest.setCreateBy(userEmail);
        productService.postProduct(addProductRequest);
    }


    @PostMapping("/secure/update/product")
    public void updateProduct(@RequestHeader(value = "Authorization") String token,
                            @RequestBody UpdateProductRequest updateProductRequest) throws Exception{

        Optional<Product> product =productService.findProductById(updateProductRequest.getId());

        if(product.isPresent()){
            productService.updateProduct(updateProductRequest, product.get());
        }
    }


    @PostMapping("/secure/delete/product")
    public void deleteProduct(@RequestHeader(value = "Authorization") String token,
                              @RequestBody UpdateProductRequest updateProductRequest) throws Exception{

        Optional<Product> product =productService.findProductById(updateProductRequest.getId());

        if(product.isPresent()){
            productService.deleteProduct(product.get());
        }
    }

}
