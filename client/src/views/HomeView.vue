<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import store from "@/stores/store";
import {getCurrentUser} from "@/services/auth";
import router from "@/router";
const user = getCurrentUser()
if (user?.role === 'merchant'){
  router.push({path: '/merchant', replace: true})
}
</script>

<template>
  <SideBar />
  <div class="sm:ml-64">
    <NavBar />
    <br>
    <br>
    <br>
    user connecté
    <pre>

  {{user}}
    </pre>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, atque corporis, culpa dolorem esse
    et eum explicabo illum laudantium maiores mollitia nisi numquam obcaecati quidem reprehenderit
    rerum vel voluptate voluptatum!
  </div>
</template>
