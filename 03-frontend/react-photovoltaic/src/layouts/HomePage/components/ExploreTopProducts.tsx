import { Link } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";

export const ExploreTopProducts = () => {
    const { authState } = useOktaAuth();

    return (
        <div className='p-5 mb-2 bg-dark header'>
            <div className='container-fluid py-5 text-white 
            d-flex justify-content-center align-items-center'>
                <div>
                    <h1 className='display-5 fw-bold'>Find your next adventure !!</h1>
                    <p className='fs-4'>Where would you like to see a photovoltaic system ?</p>

                    {
                        authState?.isAuthenticated ?
                            <Link to='/search'>
                                <button className='btn btn-secondary'>
                                    Explore top products
                                </button>
                            </Link>
                            :
                            <Link to='/login'>
                                <button className='btn btn-secondary'>
                                    Explore top products
                                </button>
                            </Link>
                    }

                </div>

            </div>
        </div>
    );
}