import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
  async viewAllAccounts(business_id) {
    const body = {
      business_id: business_id,
      
    }
    try {
      const response = await api.post("api/viewAllAccounts",body ); // Use the 'api' instance here
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

  async getAccountTransaction(accountId){
    const body = {
      
      
    }
    try {
      const response = await api.get("api/transactions/"+accountId ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }


  },

  async viewAllTransactions(business_id) {
    const body = {
      business_id: business_id,
      
    }
    try {
      const response = await api.post("api/viewAllTransactions",body ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },
  

};


