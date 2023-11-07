import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
 
  
    async addAdmin(adminDetails) {
      
      
      try {
        const response = await api.post("api/admin", adminDetails ); // Use the 'api' instance here
        if (response) {
          
          return response.data;
        }
      } catch (error) {
        console.log(error);
        return error.response;
      }
    },

    async viewAllAdmin() {

    
      try {
        const response = await api.get("api/admin"); // Use the 'api' instance here
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
  
   
  };