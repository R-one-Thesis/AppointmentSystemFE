import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
 
    async viewAllPending() {

    
        try {
          const response = await api.get("api/bookings"); // Use the 'api' instance here
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

    async approvePatient(id) {
        const body = {
            
        }
        try {
            const response = await api.put("api/approve-bookings/"+id ); // Use the 'api' instance here
            if (response) {
            return response.data;
            }
        } catch (error) {
            console.log(error);
            return error.response;
        }
    },

    async rejectPatient(id) {
        const body = {
            
        }
        try {
            const response = await api.put("api/reject-bookings/"+id ); // Use the 'api' instance here
            if (response) {
            return response.data;
            }
        } catch (error) {
            console.log(error);
            return error.response;
        }
    },
  
   
  };