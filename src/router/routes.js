const routes = [
  {
    path: '/',
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
        meta: { label: 'Clients', icon: 'group', roles: ['any'] }, // Group label and icon
        children: [
          {
            path: '/Pre-Registration-Management', 
            component: () => import('pages/PreRegistration/PreRegistration.vue'),
            name: 'Pre Registration',
            meta: { icon: 'fas fa-user', roles: ['ADMIN', 'CASHIER'] }
          },
          {
            path: '/Clients-Management', 
            component: () => import('pages/Clients/ClientsManagement.vue'),
            name: 'Clients',
            meta: { icon: 'fas fa-users', roles: ['ADMIN', 'CASHIER'] }
          },
          
          // Add more routes for the Management group here
        ]
      },

      {
        path: '/',
        meta: { label: 'Users', icon: 'group', roles: ['ADMIN', 'VIEW_USERS'] }, // Group label and icon
        children: [
          {
            path: '/User-Management', 
            component: () => import('pages/Users/Users.vue'),
            name: 'Users',
            meta: { icon: 'fas fa-users', roles: ['ADMIN', 'VIEW_USERS'] }
          },
          // Add more routes for the Management group here
        ]
      },

      {
        path: '/',
        meta: { label: 'Accounts', icon: 'group', roles: ['ADMIN', 'VIEW_ACCOUNTS', 'CASHIER'] }, // Group label and icon
        children: [
          {
            path: '/Accounts', 
            component: () => import('pages/Accounts/Accounts.vue'),
            name: 'Accounts',
            meta: { icon: 'fas fa-credit-card', roles: ['ADMIN', 'VIEW_ACCOUNTS', 'CASHIER'] }
          },
          {
            path: '/Transactions', 
            component: () => import('pages/Accounts/Transactions.vue'),
            name: 'Transactions',
            meta: { icon: 'fas fa-credit-card', roles: ['ADMIN', 'VIEW_TRANSACTIONS', 'CASHIER'] }
          },
          // Add more routes for the Management group here
        ]
      },
      {
        path: '/',
        meta: { label: 'Transactions', icon: 'group', roles: ['any'] }, // Group label and icon
        children: [
          {
            path: '/View-Transactions', 
            component: () => import('pages/Transactions/Transactions.vue'),
            name: 'View Transactions',
            meta: { icon: 'dashboard', roles: ['any'] }
          },
          // Add more routes for the Management group here
        ]
      },
      
      
     
    ]
  },
  {
    path: '/Login', 
    component: () => import('pages/Login/Login.vue'),
    name: 'Login',
    roles:["any"]
  },


  {
    path: '/Calendar', 
    component: () => import('components/Calendar.vue'),
    name: 'Calendar',
    roles:["any"]
  },

  {
    path: '/CalendarDay', 
    component: () => import('components/CalendarDay.vue'),
    name: 'CalendarDay',
    roles:["any"]
  },

  {
    path: '/Hello', 
    component: () => import('components/Hello.vue'),
    name: 'Hello',
    roles:["any"]
  },

  // {
  //   path: '/CardBasic', 
  //   component: () => import('components/CardBasic.vue'),
  //   name: 'CardBasic',
  //   roles:["any"]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
