<script setup>
import store from "@/stores/store";

store.commit('setUser',null)
store.commit('setLoggedIn',false)
</script>
<template>
  <div>
    logout
  </div>
</template>

<style scoped>
</style>
