import { api } from "../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
 

  async scanAccount(account_number) {

         let accountNumber = '';
        for (let i = 0; i < account_number.length; i += 2) {
          accountNumber += String.fromCharCode(parseInt(account_number.substr(i, 2), 16));
        }
    const body = {
        account_number: accountNumber
      
    }
    try {
      const response = await api.post("api/scanAccount",body); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async getGraphDetails(business_id) {
    const body = {
      business_id: business_id,
      
    }
    try {
      const response = await api.post("api/getGraphDetails",body ); // Use the 'api' instance here
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },
  
  async reScanAccount(account_number) {

const body = {
   account_number: account_number
 
}
try {
 const response = await api.post("api/scanAccount",body); // Use the 'api' instance here
 if (response) {
   return response.data;
 }
} catch (error) {
 console.log(error);
 return error.response;
}
},

  async topUp(details) {

  const body = {
    account: details.account_number,
    reciept_number: details.receipt_number,
    reciept_amount: details.amount,
    business_id: details.business_id,

  
  }
try {
 const response = await api.post("api/rewardPoints",body); // Use the 'api' instance here
 if (response) {
   return response.data;
 }
} catch (error) {
 console.log(error);
 return error.response;
}
},


async claim(details) {

  const body = {
    account_number: details.account_number,
    reciept_number: details.receipt_number,
    points_to_claim: details.amount,
    business_id: details.business_id,

  
  }
try {
 const response = await api.post("api/claimPoints",body); // Use the 'api' instance here
 if (response) {
   return response.data;
 }
} catch (error) {
 console.log(error);
 return error.response;
}
},



 
};
