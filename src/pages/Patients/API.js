import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {

    async viewAllPatients() {

    
      try {
        const response = await api.get("api/patients"); // Use the 'api' instance here
        if (response) {
        
          return response.data;
        }
      } catch (error) {
        if(error.response?.status == '401'){
          return error.response?.status;

        }
        return error.response;
      }
    },
 
  
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

    async updatePatient(patientDetails) {
      const body = {
        
        
      }
      try {
        const response = await api.put("api/update-patients/"+patientDetails.id,patientDetails ); // Use the 'api' instance here
        if (response) {
          return response.data;
        }
      } catch (error) {
        console.log(error);
        return error.response;
      }
    },
  
  
   
  };