import { useState } from "react";
import ProductModel from "../../../models/ProductModel";
import ProjectModel from "../../../models/ProjectModel";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import osmProviders from "../../../lib/osmProviders";
import L, { Map } from "leaflet";
import { useRef } from "react";
import "leaflet/dist/leaflet.css"
import { ProductPopUpOnMap } from "./ProductPopUpOnMap";

const markerIcon = new L.Icon({
    iconUrl: require("../../../Images/marker.png"),
    iconSize: [35, 45],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46]
});


export const ShowProductMap: React.FC<{ products: ProductModel[], projects: ProjectModel[] }> = (props) => {

    const [center, setCenter] = useState({ lat: 50.840672111486484, lng: 12.927794290232688 });

    const ZOOM_LEVEL = 9;
    const mapRef = useRef();


    return (

        <div className='row'>
            <div className='col text-center'>
                <MapContainer center={center} zoom={ZOOM_LEVEL} style={{ height: '600px', width: '100%' }}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {props.products.map(product => (
                        <Marker position={[product.latitude, product.longitude]} icon={markerIcon} key={product.id}>
                            <Popup minWidth={500} maxHeight={500} >
                            <ProductPopUpOnMap product={product} projects={props.projects} />
                            </Popup>
                        </Marker>
                    ))}


                </MapContainer>
            </div>
        </div>

    );

}