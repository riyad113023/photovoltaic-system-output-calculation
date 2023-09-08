package com.dbwt.springbootphotovoltaic.service;

import com.dbwt.springbootphotovoltaic.dao.ProjectRepository;
import com.dbwt.springbootphotovoltaic.entity.Project;
import com.dbwt.springbootphotovoltaic.requestmodels.AddProjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public void postProject(AddProjectRequest addProjectRequest){
        Project project = new Project();
        project.setName(addProjectRequest.getName());
        project.setDescription(addProjectRequest.getDescription());

        projectRepository.save(project);

    }
}
