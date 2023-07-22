<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <SideBar />
  <div class="sm:ml-64">
    <NavBar />
    Hello Admin
    Voir les demandes marchand

    <br>
    <br>
    <RouterLink to="/admin/users">Users View</RouterLink>
    <RouterLink to="/admin/users/pending">Merchant View</RouterLink>
  </div>
</template>
