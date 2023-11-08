import { api } from "../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
 
  async viewDoctor() {
   
    try {
      const response = await api.get("api/view-doctors"); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },
  

  async viewAllSched() {
   
    try {
      const response = await api.get("api/view-schedules"); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async addSchedule(schedDetails) {
    
    
    try {
      const response = await api.post("api/add-schedule",schedDetails ); // Use the 'api' instance here
      if (response) {
        
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async updateSchedule(schedDetails) {
    const body = {
      
      
    }
    try {
      const response = await api.put("api/book-schedules/"+schedDetails ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

 
};
