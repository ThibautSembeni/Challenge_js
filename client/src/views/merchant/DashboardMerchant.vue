<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import store from "@/stores/store";
import router from "@/router";

const credentials = store.state.credentials
if (credentials === null) {
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
        {{ credentials }}
      </pre>
    </h3>
  </div>
</template>
