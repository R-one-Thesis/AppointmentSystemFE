<template>
  
  <div v-for="item in routes" :key="item.name">
    <q-list v-if="(item.children!=null) && (item.meta.roles.some((x) => roles.includes(x)) || item.meta.roles.includes('any'))" expand-icon-class="text-white drawer-list">
    
    <q-item>
      <q-item-section avatar>
        <q-item-label class="menu-label text-bold text-uppercase">{{ item.meta.label }}</q-item-label>
      </q-item-section>
    
    </q-item>
      <div class="drawerItems">
        <layout-drawer-list :routes="item.children" />

      </div>
      
 
      <hr class="menu-separator">
   
  </q-list>
  <q-list style="display:flex; justify-content: center;" v-else>
    <q-item v-if="item.meta.roles.some((x) => roles.includes(x)) || item.meta.roles.includes('any')" :to="item.path" class="drawerClass text-bold" active-class="q-item-no-link-highlighting drawerActive" style="width: 250px; min-height: 35px;">
      <q-item-section avatar>
        <q-icon :name="item.meta.icon"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{item.name}}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  </div>
</template>

<script>
import LayoutDrawerList from "./LayoutDrawerList.vue";
import { defineComponent, ref } from "vue";
import { auth } from "../stores/auth";

export default defineComponent({
  name: "LayoutDrawerList",
  props: {
    routes: {
      type: Object,
      required: true
    },
  },
  setup() {
    const store = auth(); // Access the Pinia store instance
    console.log(store.roles)
    // Now you can use the store's state, getters, mutations, and actions

    // For example:
    // const myState = store.$state.myState;
    // const myGetter = store.myGetter;
    // store.myMutation(newValue);
    // await store.myAction(payload);

   return{
    roles: store.roles
   }
  },
});
</script>

<style >
.logo-container {
  display: flex;
  justify-content: center; /* Align the logo horizontally */
  align-items: center; /* Align the logo vertically */
  padding: 16px; /* Add padding around the logo to separate it from navigation items */
}

.logo {
  width: 80px; /* Adjust the width as needed */
  height: auto; /* Maintain the aspect ratio of the logo */
  margin-right: 16px; /* Add some space between the logo and the navigation items */
}


.menu-separator {
  margin: 10px 25px;
  border: 0;
  border-top: 1px solid #ccc;
}
.drawerItems{
  display: flex;
  flex-direction: column;
  gap: 10px;

}
</style>