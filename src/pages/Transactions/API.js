import { api } from "../../boot/axios"; // Import the 'api' instance instead of 'axios'

const url = process.env.VUE_APP_API_URL;

export default {
  async test() {
    console.log("test");
    console.log(process.env.VUE_APP_API_URL);
    try {
      const response = await api.get("api/rewardPoints"); // Use the 'api' instance here
      if (response) {
        return response.data.data;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
};
