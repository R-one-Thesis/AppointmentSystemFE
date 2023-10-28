const routes = [
  {
    path: '/Dashboard',
    redirect: '/Dashboard',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true, // Set requiresAuth: true on the parent route
    },
    children: [
      {
        path: '/Dashboard', 
        component: () => import('pages/IndexPage.vue'),
        name: 'Dashboard',
        meta: { icon: 'dashboard', roles: ['any'] }
      },

      {
        path: '/',
        meta: { label: 'Patients', icon: 'group', roles: ['any'] }, // Group label and icon
        children: [
          {
            path: '/Patients', 
            component: () => import('pages/Patients/Patients.vue'),
            name: 'Patients',
            meta: { icon: 'fas fa-user', roles: ['any'] }
          },
        
          
          // Add more routes for the Management group here
        ]
      },

      // {
      //   path: '/',
      //   meta: { label: 'Users', icon: 'group', roles: ['ADMIN', 'VIEW_USERS'] }, // Group label and icon
      //   children: [
      //     {
      //       path: '/User-Management', 
      //       component: () => import('pages/Users/Users.vue'),
      //       name: 'Users',
      //       meta: { icon: 'fas fa-users', roles: ['ADMIN', 'VIEW_USERS'] }
      //     },
      //     // Add more routes for the Management group here
      //   ]
      // },

   
      
      
     
    ]
  },

  {
    path: '/', 
    component: () => import('components/LandingPage.vue'),
    name: 'LandingPage',
    roles:["any"]
  },

  {
    path: '/Login', 
    component: () => import('pages/Login/Login.vue'),
    name: 'Login',
    roles:["any"]
  },

  {
    path: '/Register', 
    component: () => import('pages/Register/Register.vue'),
    name: 'Register',
    roles:["any"]
  },

  {
    path: '/RecordHistory', 
    component: () => import('components/RecordHistory.vue'),
    name: 'RecordHistory',
    roles:["any"]
  },
  

 
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
