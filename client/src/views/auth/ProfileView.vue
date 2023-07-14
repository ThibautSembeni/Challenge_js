<script setup>

import SideBar from "@/components/SideBar.vue";

import NavBar from "@/components/NavBar.vue";
import TabPanel from "@/components/TabPanel.vue";

const tabs = [
  {title: 'My details', name: 'details'},
  {title: 'My orders', name: 'orders'},
  {title: 'Security', name: 'security'}
];


</script>
<template>
  <SideBar/>
  <div class="sm:ml-64">
    <NavBar/>
    <div class="">

      <h1>My Account</h1>

      <TabPanel :tabs="tabs" :is-vertical="true">
        <template #details>
          details
        </template>

        <template #orders>
          orders
        </template>

        <template #security>
          security
        </template>

      </TabPanel>

    </div>
  </div>

</template>

<style scoped>

</style>
