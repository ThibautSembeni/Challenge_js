<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import DashboardKPIS from '@/components/KPI/DashboardKpis.vue'
</script>

<template>
  <SideBar />
  <div class="sm:ml-64">
    <NavBar />

    <div class="p-4 lg:p-10">
      <h1 class="text-3xl font-bold p-4"><i class="fa-solid fa-house"></i> Rapport Analytique</h1>
      <div class="border-b border-gray-200 w-full"></div>
      <DashboardKPIS />
    </div>
  </div>
</template>
