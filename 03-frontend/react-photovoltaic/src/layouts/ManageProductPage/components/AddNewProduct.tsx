import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import AddProductRequest from "../../../models/AddProductReqeust";
import ProjectModel from "../../../models/ProjectModel";

export const AddNewProduct = () => {

    const { authState } = useOktaAuth();

    const [title, setTitle] = useState('');
    const [projectId, setProjectId] = useState(0);
    const [powerPeak, setPowerPeak] = useState(0);
    const [orientationId, setOrientationId] = useState(0);
    const [orientation, setOrientation] = useState('Select Orientation');
    const [inclination, setInclination] = useState(0);
    const [area, setArea] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [projects, setProjects] = useState<ProjectModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [projectNameSelection, setProjectNameSelection] = useState('Select Project');


    useEffect(() => {

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

    function projectIdField(value: number) {
        setProjectId(value);
        projectName(value);
    }

    const projectName = (value: number) => {

        for (let project of projects) {
            if (project.id === value) {
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

    async function base64ConversionForImages(e: any) {
        if (e.target.files[0]) {
            getBase64(e.target.files[0]);
        }

    }

    async function submitNewProduct() {
        const url = `http://localhost:8080/api/secure/add/product`;
        if (title !== '') {

            const product: AddProductRequest = new AddProductRequest(title, projectId, powerPeak,
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

            const submitNewProductResponse = await fetch(url, requestOptions);

            if (!submitNewProductResponse.ok) {
                throw new Error('Something went wrong');
            }
            else {

                setTitle('');
                setProjectId(0);
                setDescription('');
                setArea(0);
                setPowerPeak(0);
                setOrientation('');
                setInclination(0);
                setArea(0);
                setLatitude(0);
                setLongitude(0);
                setDisplaySuccess(true);
            }

        }
        else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    function getBase64(file: any) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setSelectedImage(reader.result);
        }
        reader.onerror = function (error) {
            console.log('error', error);
        }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Product Add Successfully!!
                </div>
            }

            {displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }

            <div className='card'>
                <div className='card-header'>
                    Add a new Product
                </div>

                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type='text' className='form-control' name='title' required
                                placeholder='Enter product name'
                                    onChange={e => setTitle(e.target.value)} value={title} />
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Project</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false' >
                                    {projectNameSelection}
                                </button>
                                <ul id='addNewProductId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>

                                    {projects.map(project => (
                                        <li key={project.id}><a onClick={() => projectIdField(project.id)} className='dropdown-item'>{project.name}</a></li>
                                    ))}

                                </ul>
                            </div>

                            <div className='col-md-12 mb-3'>
                                <label className='form-label'>Description</label>
                                <textarea className='form-control' name='description'
                                    onChange={e => setDescription(e.target.value)} value={description} />
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Power Peak (watts)</label>
                                <input type='number' className='form-control' name='powerPeak' required step='any'
                                placeholder='Enter power peak in Watts (w)'
                                    onChange={e => setPowerPeak(Number(e.target.value))} value={powerPeak} />
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
                                    onChange={e => setInclination(Number(e.target.value))} value={inclination} />
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Area(m*m)</label>
                                <input type='number' className='form-control' name='area' required step='any'
                                placeholder='Enter Area in m * m'
                                    onChange={e => setArea(Number(e.target.value))} value={area} />
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Latitude</label>
                                <input type='number' className='form-control' name='latitude' required step='any'
                                    onChange={e => setLatitude(Number(e.target.value))} value={latitude} />
                            </div>

                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Longitude</label>
                                <input type='number' className='form-control' name='longitude' required step='any'
                                    onChange={e => setLongitude(Number(e.target.value))} value={longitude} />
                            </div>

                            <input type="file" onChange={e => base64ConversionForImages(e)} />
                            <div>
                                <button type='button' className='btn btn-primary mt-3' onClick={submitNewProduct}>
                                    Add Product
                                </button>
                            </div>

                        </div>
                    </form>
                </div>

            </div>

        </div>

    );

}