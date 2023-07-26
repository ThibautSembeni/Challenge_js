<script setup>
import NavBar from '@/components/NavBar.vue'
import { getCurrentUser } from '@/services/auth'
import router from '@/router'
const user = getCurrentUser()
if (user?.role === 'merchant') {
  router.push({ path: '/merchant', replace: true })
}
</script>

<template>
  <div :class="{ 'sm:ml-64': user?.role !== 'customer' }">
    <NavBar />
    <div class="p-4 lg:p-10">
      <div class="border-b border-gray-200 w-full">
        Hello
      </div>



    </div>
  </div>
</template>
