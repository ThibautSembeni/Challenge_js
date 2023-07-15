<script setup>
import store from "@/stores/store";

store.commit('setUser', null)
store.commit('setLoggedIn', false)
</script>
<template>
  <div>
    logout
  </div>
  <br>
  <br>
  <br>
  <div>

    <RouterLink to="login">

      Go pour login page
    </RouterLink>
  </div>
</template>

<style scoped>
</style>
