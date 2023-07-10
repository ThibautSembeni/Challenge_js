<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import store from "@/stores/store";
const user = store.state.user
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
