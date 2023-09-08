package com.dbwt.springbootphotovoltaic.service;

import com.dbwt.springbootphotovoltaic.dao.ProductRepository;
import com.dbwt.springbootphotovoltaic.entity.Product;
import com.dbwt.springbootphotovoltaic.requestmodels.AddProductRequest;
import com.dbwt.springbootphotovoltaic.requestmodels.UpdateProductRequest;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.Optional;

@Service
@Transactional
public class ProductService {


    private ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public void postProduct(AddProductRequest addProductRequest){
        Product product = new Product();
        product.setTitle(addProductRequest.getTitle());
        product.setDescription(addProductRequest.getDescription());
        product.setProjectId(addProductRequest.getProjectId());
        product.setPowerPeak(addProductRequest.getPowerPeak());
        product.setOrientation(addProductRequest.getOrientation());
        product.setInclination(addProductRequest.getInclination());
        product.setArea(addProductRequest.getArea());
        product.setLongitude(addProductRequest.getLongitude());
        product.setLatitude(addProductRequest.getLatitude());
        product.setImg(addProductRequest.getImg());
        product.setCreatedBy(addProductRequest.getCreateBy());
        product.setCreatedDate(new Date());
        product.setIsActive(true);

        productRepository.save(product);
    }

    public void updateProduct(UpdateProductRequest updateProductRequest, Product productToUpdate){
        productToUpdate.setTitle(updateProductRequest.getTitle());
        productToUpdate.setDescription(updateProductRequest.getDescription());
        productToUpdate.setProjectId(updateProductRequest.getProjectId());
        productToUpdate.setPowerPeak(updateProductRequest.getPowerPeak());
        productToUpdate.setOrientation(updateProductRequest.getOrientation());
        productToUpdate.setInclination(updateProductRequest.getInclination());
        productToUpdate.setArea(updateProductRequest.getArea());
        productToUpdate.setLongitude(updateProductRequest.getLongitude());
        productToUpdate.setLatitude(updateProductRequest.getLatitude());
        productToUpdate.setImg(updateProductRequest.getImg());

        productRepository.save(productToUpdate);
    }

    public Optional<Product> findProductById(Long id){
        return productRepository.findById(id);
    }

    public void deleteProduct(Product product){
         productRepository.delete(product);
    }


    public void deactivateProduct(long productId){
        Optional<Product> product = findProductById(productId);
        if(product.isPresent()){
            product.get().setIsActive(false);
            productRepository.save(product.get());
        }

    }



}
