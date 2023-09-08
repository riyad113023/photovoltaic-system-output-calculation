import { ReturnProduct } from "./ReturnProduct";
import { useEffect, useState } from "react";
import ProductModel from "../../../models/ProductModel";
import { error } from "console";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import ProjectModel from "../../../models/ProjectModel";

export const Carousel = () => {
const [products, setProducts] = useState<ProductModel[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [httpError, setHttpError] = useState(null);
const [projects, setProjects] = useState<ProjectModel[]>([]);


useEffect(() => {
    const fetchProducts = async () => {
        const baseUrl: string = "http://localhost:8080/api/products";

        const url: string = `${baseUrl}?page=0&size=9`;

        const response = await fetch(url);

        if(!response.ok){
            throw new Error('Somethings went wrong!');
        }

        const responseJson = await response.json();

        const responseData = responseJson._embedded.products;

        const loadedProducts: ProductModel[] = [];

        for(const key in responseData){
            loadedProducts.push({
                id : responseData[key].id,
                title : responseData[key].title,
                projectId : responseData[key].projectId,
                powerPeak : responseData[key].powerPeak,
                orientation : responseData[key].orientation,
                inclination : responseData[key].inclination,
                area : responseData[key].area,
                latitude : responseData[key].latitude,
                longitude : responseData[key].latitude,
                img : responseData[key].img,
                description: responseData[key].description,
                isActive: responseData[key].isActive,
                createdDate: responseData[key].createdDate
            });
        }

        setProducts(loadedProducts);
        setIsLoading(false);

    };

    fetchProducts().catch((error : any) => {
        setIsLoading(false);
        setHttpError(error.message);
    });


    const fetchProjects = async () => {
        const url: string = "http://localhost:8080/api/projects";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Somethings went wrong!');
        }

        const responseJson = await response.json();

        const responseData = responseJson._embedded.projects;

        const loadedProjects: ProjectModel[] = [];

        for (const key in responseData) {
            loadedProjects.push({
                id: responseData[key].id,
                name: responseData[key].name,
                description: responseData[key].description
            });
        }

        setProjects(loadedProjects);
        setIsLoading(false);
    };

    fetchProjects().catch((error: any) => {
        setIsLoading(false);
        setHttpError(error.message);
    });

}, []);

if(isLoading){
    return(
        <SpinnerLoading/>
    )
}

if(httpError){
    return(
        <div className='container m-3'>
            <p>{httpError}</p>
        </div>
    )
}

    return (
        <div className='container mt-3' style={{ height: 550 }}>
            <div className='homepage-carousel-title'>
                <h3>Current Products</h3>
            </div>

            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5
                d-none d-lg-block' data-bs-interval='false'>

                {/* Desktop */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>                       
                            {products.slice(0,3).map(product => (
                                <ReturnProduct product={product} projects={projects} key={product.id}/>
                            ))}
                        </div>
                    </div>
                </div>
                <button className='carousel-control-prev' type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Previous</span>
                </button>
                <button className='carousel-control-next' type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Next</span>
                </button>
            </div>

            {/* Mobile */}

            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to='/search'>View More</Link>
            </div>
        </div>
    );
}