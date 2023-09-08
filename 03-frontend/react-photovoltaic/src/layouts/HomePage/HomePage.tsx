import { Carousel } from "./components/Carousel";
import { ExploreTopProducts } from "./components/ExploreTopProducts";
import { ProductServices } from "./components/ProductServices";

export const HomePage = () => {
    return(
        <>
            <ExploreTopProducts/>
            <Carousel/>
            <ProductServices/>
        
        </>
    );
}