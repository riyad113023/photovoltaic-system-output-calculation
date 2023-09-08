
import { useOktaAuth } from "@okta/okta-react"
import { useState } from "react";
import ProjectModel from "../../../models/ProjectModel";
import AddNewProjectModel from "../../../models/AddNewProjectModel";

export const AddNewProject = () => {

    const { authState } = useOktaAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewProject() {
        const url = `http://localhost:8080/api/secure/add/project`;
        if (title !== '') {

            const project: AddNewProjectModel = new AddNewProjectModel(title,  description);

            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            };

            const submitNewProductResponse = await fetch(url, requestOptions);

            if (!submitNewProductResponse.ok) {
                throw new Error('Something went wrong');
            }
            else {

                setTitle('');
                setDescription('');
                setDisplaySuccess(true);
            }

        }
        else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }


    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Project Added Successfully!!
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
                                placeholder='Enter project name'
                                    onChange={e => setTitle(e.target.value)} value={title} />
                            </div>

                            <div className='col-md-12 mb-3'>
                                <label className='form-label'>Description</label>
                                <textarea className='form-control' name='description'
                                    onChange={e => setDescription(e.target.value)} value={description} />
                            </div>

                            <div>
                                <button type='button' className='btn btn-primary mt-3' onClick={submitNewProject}>
                                    Add Project
                                </button>
                            </div>

                        </div>
                    </form>
                </div>

            </div>

        </div>

    );


}

