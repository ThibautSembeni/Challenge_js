<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <SideBar />
  <div class="sm:ml-64">
    <NavBar />
    Hello Admin
    Voir les demandes marchand <RouterLink to="/admin/users">hhiihihi</RouterLink>
  </div>
</template>
