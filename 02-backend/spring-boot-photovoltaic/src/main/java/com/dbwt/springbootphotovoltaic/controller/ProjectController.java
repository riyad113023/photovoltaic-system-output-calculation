package com.dbwt.springbootphotovoltaic.controller;

import com.dbwt.springbootphotovoltaic.dao.ProjectRepository;
import com.dbwt.springbootphotovoltaic.requestmodels.AddProductRequest;
import com.dbwt.springbootphotovoltaic.requestmodels.AddProjectRequest;
import com.dbwt.springbootphotovoltaic.service.ProjectService;
import com.dbwt.springbootphotovoltaic.util.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ProjectController {

    private ProjectService projectService;


    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/secure/add/project")
    public void postProduct(@RequestHeader(value = "Authorization") String token,
                            @RequestBody AddProjectRequest addProjectRequest) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        projectService.postProject(addProjectRequest);
    }
}
