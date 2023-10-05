import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
  async viewAllClients(business_id) {
    const body = {
      business_id: business_id,
      
    }
    try {
      const response = await api.post("api/viewAllClients",body ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async getBusinesses() {
    const body = {
      
      
    }
    try {
      const response = await api.get("api/businesses" ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },


  async getClientTypes() {
    const body = {
      
      
    }
    try {
      const response = await api.get("api/clientType" ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },


  async createClient(clientDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.post("api/clients",clientDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },


  
  async updateClient(clientDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.put("api/clients/"+clientDetails.id,clientDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  
  async deleteClient(clientDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.delete("api/clients/"+clientDetails.id,clientDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

};


