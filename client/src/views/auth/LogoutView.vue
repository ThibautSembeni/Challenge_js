<script setup>
import store from '@/stores/store'
import { onMounted } from 'vue'
import { logout } from '@/services/auth'
store.commit('setUser', null)
store.commit('setLoggedIn', false)

onMounted(async () => {
  await logout()
})
</script>
<template>
  <div>logout</div>
  <br />
  <br />
  <br />
  <div>
    <RouterLink :to="{ name: 'login' }"> Go pour login page </RouterLink>
  </div>
</template>

<style scoped></style>
