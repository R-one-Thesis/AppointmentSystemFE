import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
  
  async addServices(serviceDetails) {
      
    try {
      const response = await api.post("api/services", serviceDetails ); // Use the 'api' instance here
      if (response) {
        
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async viewAllServices() {

    
    try {
      const response = await api.get("api/services"); // Use the 'api' instance here
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

  async updateService(serviceDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.put("api/services/"+serviceDetails.id,serviceDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async deleteService(serviceDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.delete("api/services/"+serviceDetails.id,serviceDetails); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },
   
  };