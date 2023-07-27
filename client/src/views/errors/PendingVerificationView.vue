<script setup>
import store from "@/stores/store";
import router from "@/router";

store.commit('setUser', null)
store.commit('setLoggedIn', false)

setTimeout(async () => {
  await router.push({name: 'login'})
}, 5000)
</script>
<template>
  <div class="container mx-auto max-w-7xl">
    <div class="flex justify-center items-center py-12">
      <div class="max-w-4xl w-full">
        <h1 class="text-3xl font-bold mb-8">Votre demande est en attente de validation...</h1>


        <br>
        <br>
        <router-link :to="{ name: 'logout' }" class="btn btn-primary">
          Deconnecter Vous
        </router-link>
      </div>
    </div>
  </div>
</template>
