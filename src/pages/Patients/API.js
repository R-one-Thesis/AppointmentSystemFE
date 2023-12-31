import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
 
  
    async addPatient(patientDetails) {
      
      
      try {
        const response = await api.post("api/register", patientDetails ); // Use the 'api' instance here
        if (response) {
          
          return response.data;
        }
      } catch (error) {
        console.log(error);
        return error.response;
      }
    },
  
   
  };