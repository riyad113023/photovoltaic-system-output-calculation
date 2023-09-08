class UpdateProductRequest{
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

    constructor( id:number, title: string, projectId: number, powerPeak: number, 
        orientation: string, inclination: number, area: number, longitude: number, latitude: number, description:string){

            this.id = id;
            this.title = title;
            this.projectId = projectId;
            this.powerPeak = powerPeak;
            this.orientation = orientation;
            this.inclination = inclination;
            this.area = area;
            this.longitude = longitude;
            this.latitude = latitude;
            this.description = description;
    }

}

export default UpdateProductRequest;