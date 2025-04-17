import axios from "axios";

const apiUrl = "http://localhost:8083/api/catalog/activity-types";


// get tour have activity tour and activity type
export const getActivityType = async () => {
    try{
        const response = await axios.get(apiUrl)
        return response.data;
    }catch(error){
        console.error("Error fetching tour with activity:", error);
        throw error;
    }
}