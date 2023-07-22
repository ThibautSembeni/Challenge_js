<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import store from '@/stores/store'
import DashboardKPIS from '@/components/KPI/DashboardKpis.vue'
import TransactionsNumberByDay from '@/components/KPI/TransactionsNumberByDay.vue'
import TransactionsNumberByYear from '@/components/KPI/TransactionsNumberByYear.vue'
const user = store.state.user
</script>

<template>
  <SideBar />
  <div class="sm:ml-64">
    <NavBar />
    <DashboardKPIS />
  </div>
</template>
