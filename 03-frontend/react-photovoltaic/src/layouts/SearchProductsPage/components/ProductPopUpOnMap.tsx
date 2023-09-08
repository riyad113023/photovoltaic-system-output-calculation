import { useEffect, useState } from "react";
import ProductModel from "../../../models/ProductModel";
import ProjectModel from "../../../models/ProjectModel";
import { Button, Modal } from "react-bootstrap";
import { UpdateProduct } from "../../ManageProductPage/components/UpdateProduct";
import UpdateProductRequest from "../../../models/UpdateProductRequest";
import { useOktaAuth } from "@okta/okta-react";



export const ProductPopUpOnMap: React.FC<{ product: ProductModel, projects: ProjectModel[] }> = (props) => {

    const { authState } = useOktaAuth();
    const [show, setShow] = useState(false);
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const projectName = (value: number) => {

        for (let project of props.projects) {
            if (project.id === value) {
                return project.name;
            }
        }
    }

    const showProductUpdatePage = () => setShow(true);

    const closeProductUpdatePage = () => setShow(false);

    async function deleteProduct() {
        const url = `http://localhost:8080/api/secure/delete/product`;

        const product: UpdateProductRequest = new UpdateProductRequest(props.product.id, props.product.title,
            props.product.projectId, props.product.powerPeak, props.product.orientation, props.product.inclination,
            props.product.area, props.product.longitude, props.product.latitude, props.product.description);

        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        };

        const deleteProductResponse = await fetch(url, requestOptions);

        if (!deleteProductResponse.ok) {
            throw new Error('Something went wrong');
            setDisplayWarning(true);
        }
        else {
            setDisplaySuccess(true);
        }

    }


    return (

        <>
            <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                <div className='row g-0'>
                    {displaySuccess &&
                        <div className='alert alert-success' role='alert'>
                            Product Deleted Successfully!!
                        </div>
                    }

                    {displayWarning &&
                        <div className='alert alert-danger' role='alert'>
                            All fields must be filled out
                        </div>
                    }
                    <div className='col-md-2'>
                        <div className='d-none d-lg-block'>
                            {props.product.img ?
                                <img src={props.product.img}
                                    width='80'
                                    height='120'
                                    alt="Product"
                                />
                                :
                                <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                    width='80'
                                    height='120'
                                    alt="Product"
                                />
                            }
                        </div>
                        <div className='d-lg-none d-flex justify-content-center
                        align-items-center'>
                            {props.product.img ?
                                <img src={props.product.img}
                                    width='80'
                                    height='120'
                                    alt="Product"
                                />
                                :
                                <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                    width='80'
                                    height='120'
                                    alt="Product"
                                />
                            }
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className='card-body'>
                            <h5 className='card-title'>
                                {props.product.title}
                            </h5>
                            <h4>
                                {projectName(props.product.projectId)}
                            </h4>
                            <p className='card-text'>
                                {props.product.description}
                            </p>
                        </div>
                    </div>
                    <div className='col-md-4 d-flex justify-content-center align-items-center'>

                        <div>
                            {
                                props.product.isActive ?
                                    <button className='btn btn-outline-success mt-2' data-toggle="modal" onClick={showProductUpdatePage}>
                                        Update Product
                                    </button>
                                    :
                                    <button className='btn btn-outline-success mt-2' data-toggle="modal" onClick={showProductUpdatePage}>
                                        View Product
                                    </button>
                            }

                            <button className='btn btn-outline-success mt-2' onClick={deleteProduct}>
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={closeProductUpdatePage} dialogClassName='product_update_modal' centered>
                <Modal.Header>
                    Update Product
                </Modal.Header>
                <Modal.Body>
                    <UpdateProduct product={props.product} projects={props.projects} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeProductUpdatePage}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
} 