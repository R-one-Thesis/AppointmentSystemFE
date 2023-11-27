import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
  
  async addDoctor(doctorDetails) {
      
    try {
      const response = await api.post("api/add-doctors", doctorDetails ); // Use the 'api' instance here
      if (response) {
        
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async viewAllDoctors() {

    
    try {
      const response = await api.get("api/view-doctors"); // Use the 'api' instance here
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

  async updateDoctor(doctorDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.put("api/edit-doctors/"+doctorDetails.id,doctorDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async deleteDoctor(doctorDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.delete("api/delete-doctors/"+doctorDetails.id,doctorDetails); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },
   
  };