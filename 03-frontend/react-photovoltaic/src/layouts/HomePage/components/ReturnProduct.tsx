import React from "react";
import ProductModel from "../../../models/ProductModel";
import ProjectModel from "../../../models/ProjectModel";

export const ReturnProduct: React.FC<{product: ProductModel, projects:ProjectModel[]}> = (props) => {

    const projectName = (value: number) => {

        for(let project of props.projects){
            if(project.id === value){
                return project.name;
            }
        }
    }
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                {props.product.img?
                        <img src={props.product.img}
                        width='151'
                        height='233'
                        alt="Product"
                        />
                        :
                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                        width='151'
                        height='233'
                        alt="Product"
                        />           
                }
                <h6 className='mt-2'>{props.product.title}</h6>
                <p>{projectName(props.product.projectId)}</p>
                <a className='btn main-color text-white' href='#'>View Details</a>
            </div>
        </div>
    );
}