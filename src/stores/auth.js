import { defineStore } from 'pinia'
import { api } from "../boot/axios";
export const auth = defineStore('user', {
  state: () => ({
    authUser: null,
    token: null,
    roles: null,
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
            const data = await api.post("api/login", userDetails)
            console.log(data.data)

            this.user_name = data.data.user_name;
            this.user_type = data.data.user_type;

            this.token = data.data.token;
                
               
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
