import { api } from "../boot/axios"; // Import the 'api' instance instead of 'axios'
import axios from "axios"; // Import the 'api' instance instead of 'axios'

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

  async updateSchedule(id, serviceDetails) {
    
    // const body = {
    //   services: servicesDetails
      
    // }
    try {
      const response = await api.put("api/book-schedules/"+id, serviceDetails); // Use the 'api' instance here
      
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },


    // async  sendSMS() {
    //   const options = {
    //     method: 'POST',
    //     url: 'https://api.movider.co/v1/sms',
    //     headers: {
    //       accept: 'application/json',
    //       'content-type': 'application/x-www-form-urlencoded',
    //       Authorization: 'Bearer 2YnvWH3Uy8TRVX3WMbPzSSqqGZh',
    //     }
    //   };
      
    //   axios
    //     .request(options)
    //     .then(function (response) {
    //       console.log(response.data);
    //     })
    //     .catch(function (error) {
    //       console.error(error);
    //     });
    // },


    async getSchedule(scheduleID) {
   
      try {
        const response = await api.get("api/get-schedule/"+scheduleID); // Use the 'api' instance here
        if (response) {
          return response.data;
        }
      } catch (error) {
        console.log(error);
        return error.response;
      }
    },


 
};
