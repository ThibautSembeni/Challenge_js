<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import store from "@/stores/store";
import router from "@/router";
import {getCurrentUser} from "@/services/auth";
import {onMounted} from "vue";
import {getCurrentCredentials} from "@/services/credentials";


const currentCredentials =  getCurrentCredentials()
if (currentCredentials === null) {
  router.push(`/merchant/setup`);
}
</script>

<template>
  <SideBar/>
  <div class="sm:ml-64">
    <NavBar/>
    <h2>
      Dashboard Merchant
    </h2>
    <h3>
      credentials: merchant
      <pre>
        {{currentCredentials}}
      </pre>
    </h3>
  </div>
</template>
