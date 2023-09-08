import ProjectModel from "./ProjectModel";

class ProductModel{
    id: number;
    title: string;
    projectId: number;
    powerPeak: number;
    orientation: string;
    inclination: number;
    area: number;
    longitude: number;
    latitude: number;
    img?: string;
    description: string;
    isActive: boolean;
    createdDate: string;

    constructor(id:number, title: string, projectId: number, powerPeak: number, orientation: string, inclination: number,
         area: number, longitude: number, latitude: number, img:string, description: string, isActive: boolean, createdDate: string){

            this.id = id;
            this.title = title;
            this.projectId = projectId;
            this.powerPeak = powerPeak;
            this.orientation = orientation;
            this.inclination = inclination;
            this.area = area;
            this.longitude = longitude;
            this.latitude = latitude;
            this.img = img
            this.description = description;
            this.isActive = isActive;
            this.createdDate = createdDate;
    }

}

export default ProductModel;