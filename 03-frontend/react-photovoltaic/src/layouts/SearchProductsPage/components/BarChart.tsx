import { Bar } from "react-chartjs-2"
import { useEffect, useState } from "react";
import BarChartModel from "../../../models/BarChartModel";
import { Chart as ChartJS, registerables } from 'chart.js/auto'
ChartJS.register(...registerables);



export const BarChart: React.FC<{ productId: number }> = (props) => {
    const [barChartModels, setBarChartModels] = useState<BarChartModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [userData, setUserData] = useState({
        labels: barChartModels.map((data) => data.time),
        datasets: [{
            label: "Electricity Output",
            data: barChartModels.map((data) => data.output)
        }]
    });


    useEffect(() => {

        const fetchChartData = async () =>{
            const url: string = `http://localhost:8080/api/dailyReportGenerations/search/findByProductId?productId=${props.productId}`;
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error('Somethings went wrong!');
            }
    
            let responseJson = await response.json();
    
            let responseData = responseJson._embedded.dailyReportGenerations;
    
            let loadedResults: BarChartModel[] = [];
    
            for (const key in responseData) {
                loadedResults.push({
                    time: responseData[key].dateString,
                    output: responseData[key].dailyOutput
                });
            }
    
            setUserData({
                labels: loadedResults.map((data) => data.time),
                datasets: [{
                    label: "Electricity Output",
                    data: loadedResults.map((data) => data.output)
                }]
            });
        };

        fetchChartData().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });

        

    }, []);


    return (
        <Bar data={userData} />
    )
}