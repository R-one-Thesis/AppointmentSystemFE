import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
  async viewAllPreReg(business_id) {
    const body = {
      business_id: business_id,
      
    }
    try {
      const response = await api.post("api/viewAllPreReg",body ); // Use the 'api' instance here
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


  async createPreReg(preRegDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.post("api/preReg",preRegDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },


  
  async updatePreReg(preRegDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.put("api/preReg/"+preRegDetails.id,preRegDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  
  async deletePreReg(preRegDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.delete("api/preReg/"+preRegDetails.id,preRegDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async approvePreReg(preRegDetails) {
    const body = {
      
      registered: 'register'
    }
    try {
      const response = await api.put("api/applicantStatus/"+preRegDetails.id, body ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async rejectPreReg(preRegDetails) {
    const body = {
      registered: 'decline'
      
    }
    try {
      const response = await api.put("api/applicantStatus/"+preRegDetails.id,body ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },
  
};
