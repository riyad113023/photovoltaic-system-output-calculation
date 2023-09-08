import { useOktaAuth } from "@okta/okta-react"
import { AddNewProduct } from "./components/AddNewProduct";
import { AddNewProject } from "./components/AddNewProject";

export const ManageProductPage = () => {
    const {authState} = useOktaAuth();

    return(
        <div className='container'>
            <div className='mt-5'>
                <h3>Manage Product</h3>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button className='nav-link active' id='nav-add-product-tab' data-bs-toggle='tab'
                        data-bs-target='#nav-add-product' type='button' role='tab' aria-controls='nav-add-product'
                        aria-selected='false'>
                            Add new Product
                        </button>

                        <button className='nav-link' id='nav-add-project-tab' data-bs-toggle='tab'
                        data-bs-target='#nav-add-project' type='button' role='tab' aria-controls='nav-add-project'
                        aria-selected='true'>
                            Add new Project
                        </button>
                    </div>
                </nav>

                <div className='tab-content' id='nav-tabContent'>
                    <div className='tab-pane fade show active' id='nav-add-product' role='tabpanel'
                        aria-labelledby='nav-add-product-tab'>
                            <AddNewProduct/>                
                    </div>

                    <div className='tab-pane fade' id='nav-add-project' role='tabpanel'
                        aria-labelledby='nav-add-project-tab'>
                            <AddNewProject/>
                    </div>


                </div>

            </div>

        </div>

    );
}