import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
  async viewAllUsers(business_id) {

    const body = {
      business_id: business_id,
      
    }
   
    try {
      const response = await api.post("api/viewAllUsers", body); // Use the 'api' instance here
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

  async getUserTypes() {
    const body = {
      
      
    }
    try {
      const response = await api.get("api/userType" ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },




  async createUser(userDetails) {
    
    
    try {
      const response = await api.post("api/users",userDetails ); // Use the 'api' instance here
      if (response) {
        
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },


  
  async updateUser(userDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.put("api/users/"+userDetails.id,userDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  
  async deleteUser(userDetails) {
   

    const body = {
      
      
    }
    try {
      const response = await api.delete("api/users/"+userDetails.id,userDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },


 
};
