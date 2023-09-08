import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import AddProductRequest from "../../../models/AddProductReqeust";
import ProjectModel from "../../../models/ProjectModel";
import ProductModel from "../../../models/ProductModel";
import UpdateProductRequest from "../../../models/UpdateProductRequest";

export const UpdateProduct: React.FC<{ product: ProductModel, projects: ProjectModel[] }> = (props) => {

    const { authState } = useOktaAuth();

    const[title, setTitle] = useState(props.product.title);
    const [projectId, setProjectId] = useState(props.product.projectId);
    const [powerPeak, setPowerPeak] = useState(props.product.powerPeak);
    const [orientation, setOrientation] = useState(props.product.orientation);
    const [inclination, setInclination] = useState(props.product.inclination);
    const [area, setArea] = useState(props.product.area);
    const [longitude, setLongitude] = useState(props.product.longitude);
    const [latitude, setLatitude] = useState(props.product.latitude);
    const [description, setDescription] = useState(props.product.description);
    const [selectedImage, setSelectedImage] = useState<any>(props.product.img);

    const [displayWarning, setDisplayWarning ] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [projectNameSelection, setProjectNameSelection] = useState('Select Project');
    const [orientationId, setOrientationId] = useState(0);



    useEffect(() => {
        projectName(props.product.projectId);

    }, []);

    function projectIdField(value: number){
        setProjectId(value);
        projectName(value);
    }

    const projectName = (value: number) => {

            for(let project of props.projects){
                if(project.id === value){
                    setProjectNameSelection(project.name);
                }
            }
        
    }

    function orientationField(value: number) {
        setOrientationId(value);
        orient(value);
    }

    const orient = (value: number) => {

        if (value === 1) {
            setOrientation('East');
        }
        else if (value === 2) {
            setOrientation('West');
        }
        else if (value === 3) {
            setOrientation('North');
        }
        else if (value === 4) {
            setOrientation('South');
        }

    }

    async function base64ConversionForImages(e: any){
        if(e.target.files[0]){
            getBase64(e.target.files[0]);
        }
        
    }

    async function submitUpdateProduct(){
        const url = `http://localhost:8080/api/secure/update/product`;
        if(title !== ''){

            const product: UpdateProductRequest = new UpdateProductRequest(props.product.id ,title, projectId, powerPeak, 
                orientation, inclination, area, longitude, latitude, description);

                product.img = selectedImage;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                };

                const submitUpdateProductResponse = await fetch(url, requestOptions);

                if(!submitUpdateProductResponse.ok){
                    throw new Error('Something went wrong');
                }
                else{
                    setDisplaySuccess(true);
                }

        }
        else{
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    function getBase64(file: any){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (){
            setSelectedImage(reader.result);
        }
        reader.onerror = function(error){
            console.log('error', error);
        }
    }

    return(
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Product updated Successfully!!
                </div>
            }

            {displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }

            <div className='card'>
                <div className='card-header'>                    
                    Update Product
                </div>

                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type='text' className='form-control' name='title' required
                                onChange={e => setTitle(e.target.value)} value={title}/>
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Project</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button'
                                id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false' >
                                    {projectNameSelection}
                                </button>
                                <ul id='addNewProductId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>

                                    {props.projects.map(project => (
                                        <li key={project.id}><a onClick={() => projectIdField(project.id)} className='dropdown-item'>{project.name}</a></li>
                                    ))}

                                </ul>
                            </div>

                            <div className='col-md-12 mb-3'>
                                <label className='form-label'>Description</label>
                                <textarea className='form-control' name='description'
                                onChange={e => setDescription(e.target.value)} value={description}/>
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Power Peak</label>
                                <input type='number' className='form-control' name='powerPeak' required step='any'
                                onChange={e => setPowerPeak(Number(e.target.value))} value={powerPeak}/>
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Orientation</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton2' data-bs-toggle='dropdown' aria-expanded='false' >
                                    {orientation}
                                </button>
                                <ul id='addNewProductId' className='dropdown-menu' aria-labelledby='dropdownMenuButton2'>

                                    <li key={1}><a onClick={() => orientationField(1)} className='dropdown-item'>East</a></li>
                                    <li key={2}><a onClick={() => orientationField(2)} className='dropdown-item'>West</a></li>
                                    <li key={3}><a onClick={() => orientationField(3)} className='dropdown-item'>North</a></li>
                                    <li key={4}><a onClick={() => orientationField(4)} className='dropdown-item'>South</a></li>

                                </ul>
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Inclination</label>
                                <input type='number' className='form-control' name='inclination' required step='any'
                                onChange={e => setInclination(Number(e.target.value))} value={inclination}/>
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Area</label>
                                <input type='number' className='form-control' name='area' required step='any'
                                onChange={e => setArea(Number(e.target.value))} value={area}/>
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Latitude</label>
                                <input type='number' className='form-control' name='latitude' required step='any'
                                onChange={e => setLatitude(Number(e.target.value))} value={latitude}/>
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Longitude</label>
                                <input type='number' className='form-control' name='longitude' required step='any'
                                onChange={e => setLongitude(Number(e.target.value))} value={longitude}/>
                            </div>

                            {
                                props.product.isActive &&
                                <input type="file" onChange={e => base64ConversionForImages(e)}/>

                            }
                            <div>
                                {
                                    props.product.isActive &&
                                    <button type='button' className='btn btn-primary mt-3' onClick={submitUpdateProduct}>
                                    Update Product
                                </button>
                                }

                            </div>

                        </div>
                    </form>
                </div>

            </div>

        </div>

    );

}