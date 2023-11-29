import { defineStore } from 'pinia'
import { api } from "../boot/axios";
export const auth = defineStore('user', {
  state: () => ({
    authUser: null,
    token: null,
    roles: null,
    admin_id: null,
    patient_id: null,
    darkMode: false,
  }),
  persist: {
    storage: sessionStorage,
    paths: ['user'],
  },
  getters: {
    user: (state) => state.authUser,

  },
  actions: {
  

    // async getToken(){
    //     await api.get("/sanctum/csrf-cookie");

    // },
    async login(userDetails){
        
        try {


          const csrfToken = getCSRFToken(); // Implement this function to retrieve the CSRF token

            // Set the CSRF token in the request headers
            axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

            // Your login request
            const response = await axios.post("api/login", userDetails);
            console.log(response.data);
            const data = await api.post("api/login", userDetails)
            console.log(data.data)
            if(data.data.user_type == 'patient') {
              this.patient_id = data.data.patient_id
            }
            if(data.data.admin_id) {
              this.admin_id = data.data.admin_id
              console.log(data.data.admin_id)
            }
            if(data.data.user_name){

              this.authUser = 
              {userName: data.data.user_name,
               usertype: data.data.user_type,
             
              };
             

          
              if(data.data.user_type){
                this.roles = []
                this.roles.push(data.data.user_type.toUpperCase())

              }
           
              this.token = data.data.token;
              
             
          }
               
            // this.authUser = data.data;
            return data.data;
        } catch (error) {
            console.log(error)
            return error.response;
        }
        
    },
   
    async setUser(userDetails){
        console.log(userDetails)
        if (userDetails){

            this.authUser = userDetails;
            
        }

    },
    


    


  },
  persist: true,
})
