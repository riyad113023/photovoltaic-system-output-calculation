package com.dbwt.springbootphotovoltaic.config;

import com.dbwt.springbootphotovoltaic.entity.Product;
import com.dbwt.springbootphotovoltaic.entity.Project;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private String theAllowedOrigins = "http://localhost:3000";

    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry corsRegistry){
        HttpMethod[] theUnsupportedActions = {
                HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH, HttpMethod.DELETE
        };
        
        config.exposeIdsFor(Project.class);

        config.exposeIdsFor(Product.class);
        
        disableHttpMethods(Project.class, config, theUnsupportedActions);

        /* Configure CORS Mapping*/
        corsRegistry.addMapping(config.getBasePath() + "/**")
                .allowedOrigins(theAllowedOrigins);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) ->
                        httpMethods.disable(theUnsupportedActions))
                                .withCollectionExposure((metdata, httpMethods) ->
                                        httpMethods.disable(theUnsupportedActions));
    }


}
