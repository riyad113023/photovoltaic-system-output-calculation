import { useEffect, useState } from "react";
import ProductModel from "../../models/ProductModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchProduct } from "./components/SearchProduct";
import { Pagination } from "../Utils/Pagination";
import { AddNewProduct } from "../ManageProductPage/components/AddNewProduct";
import ProjectModel from "../../models/ProjectModel";
import { ShowProductMap } from "./components/ShowProductMap";
import { useOktaAuth } from "@okta/okta-react";

export const SearchProductPage = () => {

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(3);
    const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [projectIdSelection, setProjectIdSelection] = useState(0);
    const [productStatusSelection, setProductStatusSelection] = useState(-1);
    const [productStatusNameSelection, setProductStatusNameSelection] = useState('All');

    const [projectNameSelection, setProjectNameSelection] = useState('All');
    const [projects, setProjects] = useState<ProjectModel[]>([]);

    const { authState } = useOktaAuth();

    useEffect(() => {
        const fetchProducts = async () => {

            let userEmail: string = '';

            userEmail = authState?.idToken?.claims.email!;

            console.log(userEmail);
            const baseUrl: string = "http://localhost:8080/api/products";


            let url: string = '';

            if (searchUrl === '') {
                url = `${baseUrl}/search/findByCreatedByContaining?createdBy=${userEmail}&page=${currentPage - 1}&size=${productsPerPage}`;
            }
            else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Somethings went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.products;

            setTotalAmountOfProducts(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedProducts: ProductModel[] = [];

            for (const key in responseData) {
                loadedProducts.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    projectId: responseData[key].projectId,
                    powerPeak: responseData[key].powerPeak,
                    orientation: responseData[key].orientation,
                    inclination: responseData[key].inclination,
                    area: responseData[key].area,
                    latitude: responseData[key].latitude,
                    longitude: responseData[key].longitude,
                    img: responseData[key].img,
                    description: responseData[key].description,
                    isActive: responseData[key].isActive,
                    createdDate: responseData[key].createdDate
                });
            }

            setProducts(loadedProducts);
            setIsLoading(false);

        };

        fetchProducts().catch((error: any) => {
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



        window.scrollTo(0, 0);

    }, [currentPage, searchUrl]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const searchHandleChange = () => {
        let userEmail: string = '';

        userEmail = authState?.idToken?.claims.email!;

        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        }
        else {
            setSearchUrl(`/search/findByCreatedByAndTitleContaining?createdBy=${userEmail}&title=${search}&page=<pageNumber>&size=${productsPerPage}`);
        }
        setProjectIdSelection(0);
    }

    const projectIdField = (value: number) => {
        setCurrentPage(1);
        let userEmail: string = '';

        userEmail = authState?.idToken?.claims.email!;

        if (value != 0) {
            setProjectIdSelection(value);
            setSearchUrl(`/search/findByCreatedByAndProjectId?createdBy=${userEmail}&projectId=${value}&page=<pageNumber>&size=${productsPerPage}`);
        }
        else {
            setProjectIdSelection(0);
            setSearchUrl(`/search/findByCreatedByContaining?createdBy=${userEmail}&page=<pageNumber>&size=${productsPerPage}`);
        }

        projectName(value);
    }

    const productStatusField = (value: number) => {
        setCurrentPage(1);
        let userEmail: string = '';

        userEmail = authState?.idToken?.claims.email!;

        if (value != -1) {
            setProductStatusSelection(value);
            setSearchUrl(`/search/findByCreatedByAndIsActive?createdBy=${userEmail}&isActive=${value}&page=<pageNumber>&size=${productsPerPage}`);
        }
        else {
            setProductStatusSelection(-1);
            setSearchUrl(`/search/findByCreatedByContaining?createdBy=${userEmail}&page=<pageNumber>&size=${productsPerPage}`);
        }

        productStatusName(value);
    }

    const projectName = (value: number) => {

        if (value == 0) {
            setProjectNameSelection('All');
        }
        else {

            for (let project of projects) {
                if (project.id === value) {
                    setProjectNameSelection(project.name);
                }
            }
        }
    }

    const productStatusName = (value: number) => {

        if (value == -1) {
            setProductStatusNameSelection('All');
        }
        else if (value == 1) {
            setProductStatusNameSelection('Active');
        }
        else {
            setProductStatusNameSelection('Inactive');
        }
    }



    const indexOfLastProduct: number = currentPage * productsPerPage;
    const indexOfFirstProduct: number = indexOfLastProduct - productsPerPage;
    let lastItem = productsPerPage * currentPage <= totalAmountOfProducts ?
        productsPerPage * currentPage : totalAmountOfProducts;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2' type='search'
                                    placeholder='Enter product name' aria-labelledby='Enter product name'
                                    onChange={e => setSearch(e.target.value)} />
                                <button className='btn btn-outline-success'
                                    onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className='col-4'>
                            <div className='row'>
                                <div className='col-6'>

                                    <div className='row'>
                                        <label className='col-sm-4 col-form-label'>Project: </label>
                                        <div className='col-sm-8'>
                                            <div className='dropdown'>
                                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                                    id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                                    aria-expanded='false'>
                                                    {projectNameSelection}
                                                </button>
                                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>

                                                    <li onClick={() => projectIdField(0)}>
                                                        <a className='dropdown-item' href='#'>
                                                            All
                                                        </a>
                                                    </li>

                                                    {projects.map(project => (

                                                        <li onClick={() => projectIdField(project.id)} key={project.id}>
                                                            <a className='dropdown-item' href='#'>
                                                                {project.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className='col-6'>
                                    <div className='row'>
                                        <label className='col-sm-4 col-form-label'>Status: </label>
                                        <div className='col-sm-8'>
                                            <div className='dropdown'>
                                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                                    id='dropdownMenuButton2' data-bs-toggle='dropdown'
                                                    aria-expanded='false'>
                                                    {productStatusNameSelection}
                                                </button>
                                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton2'>

                                                    <li onClick={() => productStatusField(-1)}>
                                                        <a className='dropdown-item' href='#'>
                                                            All
                                                        </a>
                                                    </li>
                                                    <li onClick={() => productStatusField(1)} key={1}>
                                                        <a className='dropdown-item' href='#'>
                                                            Active
                                                        </a>
                                                    </li>
                                                    <li onClick={() => productStatusField(0)} key={0}>
                                                        <a className='dropdown-item' href='#'>
                                                            Inactive
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                    {totalAmountOfProducts > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5>Number of results: {totalAmountOfProducts}</h5>
                            </div>
                            <p>
                                {indexOfFirstProduct + 1} to {lastItem} of {totalAmountOfProducts} items:
                            </p>
                            {products.map(product => (
                                <SearchProduct product={product} projects={projects} />
                            ))}
                        </>

                        :

                        <div className='m-5'>
                            <h3>
                                No product found !
                            </h3>
                        </div>

                    }

                    {
                        totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>

                <div>
                    <ShowProductMap products={products} projects={projects} />
                </div>
            </div>
        </div>
    );

}