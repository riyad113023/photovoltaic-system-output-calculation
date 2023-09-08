import { useEffect, useState } from "react";
import ProductModel from "../../../models/ProductModel";
import UpdateProductRequest from "../../../models/UpdateProductRequest";
import ProjectModel from "../../../models/ProjectModel";
import { useOktaAuth } from "@okta/okta-react"
import { Button, Modal } from "react-bootstrap";
import { UpdateProduct } from "../../ManageProductPage/components/UpdateProduct";
import { BarChart } from "./BarChart";


export const SearchProduct: React.FC<{ product: ProductModel, projects: ProjectModel[] }> = (props) => {

    const { authState } = useOktaAuth();

    const [showDetails, setShowDetails] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showModal, setShowModal] = useState(false);



    const projectName = (value: number) => {

        for (let project of props.projects) {
            if (project.id === value) {
                return project.name;
            }
        }
    }

    const handleViewDetails = () => {

        setShowDetails(true);
    }

    const formatDate =(dateString: string) => {
        const date = new Date(dateString);

        // Extract the day, month, and year
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());

        // Return the formatted date
        return `${day}-${month}-${year}`;
    }

    const closeProductShowPage = () => setShowDetails(false);

    const closeProductOutputChartPage = () => setShowChart(false);
    const closeModal = () => setShowModal(false);

    async function handleGenerateReport() {
        const url = `http://localhost:8080/api/secure/generate/report`;

        const product: UpdateProductRequest = new UpdateProductRequest(props.product.id, props.product.title, props.product.projectId, props.product.powerPeak,
            props.product.orientation, props.product.inclination, props.product.area, props.product.longitude,
            props.product.latitude, props.product.description);

        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        };

        const responseForReportGeneration = await fetch(url, requestOptions);

        if (!responseForReportGeneration.ok) {
            throw new Error('Something went wrong');
        }
        else{
            setShowModal(true);
        }

    }

    async function handleViewReportChart() {
        setShowChart(true);
    }

    return (

        <>
            <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                <div className='row g-0'>
                    <div className='col-md-2'>
                        <div className='d-none d-lg-block'>
                            {props.product.img ?
                                <img src={props.product.img}
                                    width='123'
                                    height='196'
                                    alt="Product"
                                />
                                :
                                <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                    width='123'
                                    height='196'
                                    alt="Product"
                                />
                            }
                        </div>
                        <div className='d-lg-none d-flex justify-content-center
                        align-items-center'>
                            {props.product.img ?
                                <img src={props.product.img}
                                    width='123'
                                    height='196'
                                    alt="Product"
                                />
                                :
                                <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                    width='123'
                                    height='196'
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
                            <p className='card-text'>
                                Start Date: {formatDate(props.product.createdDate)}
                            </p>
                        </div>
                    </div>
                    <div className='col-md-4 d-flex justify-content-center align-items-center'>
                        <div>
                            <button className='btn btn-outline-success' onClick={() => handleViewDetails()}>
                                View Details
                            </button>
                        </div>

                        {props.product.isActive ?

                            <div>
                                <button className='btn btn-outline-success' onClick={handleGenerateReport}>
                                    Generate Report
                                </button>
                            </div>
                            :
                            <div>
                                <button className='btn btn-outline-success' onClick={handleViewReportChart}>
                                    View Report
                                </button>
                            </div>
                        }
                    </div>

                </div>
            </div>

            <Modal show={showDetails} onHide={closeProductShowPage} dialogClassName='product_detail_modal' centered>
                <Modal.Header>
                    Update Product
                </Modal.Header>
                <Modal.Body>
                    <UpdateProduct product={props.product} projects={props.projects} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeProductShowPage}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showChart} onHide={closeProductOutputChartPage} dialogClassName='product_output_chart_modal' centered>
                <Modal.Header>
                    Product Electricity Output Chart
                </Modal.Header>
                <Modal.Body>
                    <BarChart productId={props.product.id} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeProductOutputChartPage}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showModal} onHide={closeModal} centered>
                <Modal.Header>
                    Success
                </Modal.Header>
                <Modal.Body>
                    <p>Report Generated Successfully! Email Sent to {authState?.idToken?.claims.email}.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
} 