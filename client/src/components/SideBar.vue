<template>
  <div
    class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
    id="navbar-user"
  >
    <aside
      id="default-sidebar"
      class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <li v-for="page in mergedPages" :key="page.name">
            <router-link
              :to="{ name: page.to }"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i
                :class="`${page.icon} w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white flex items-center justify-center`"
              ></i>
              <span class="ml-3">{{ page.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getCurrentUser, isImperonating } from '@/services/auth'

const defaultValue = [
  {
    name: 'Dashboard',
    to: 'home',
    icon: 'fa-solid fa-house'
  },
  {
    name: 'Paiements',
    to: 'payments',
    icon: 'fa-solid fa-dollar-sign'
  },
  {
    name: 'Clients',
    to: 'customers',
    icon: 'fa-solid fa-users'
  },
  {
    name: 'Produits',
    to: 'products',
    icon: 'fa-solid fa-boxes-stacked'
  }
]

const adminRoutes = [
  {
    name: 'Utilisateurs',
    to: 'UsersView',
    icon: 'fa-solid fa-user'
  },
  {
    name: 'Dashboard',
    to: 'home',
    icon: 'fa-solid fa-house'
  },
  {
    name: 'Paiements',
    to: 'payments',
    icon: 'fa-solid fa-dollar-sign'
  }
]

const mergedPages = ref([])

onMounted(async () => {
  const currentUser = await getCurrentUser()
  const impersonatedMerchant = await isImperonating()
  if (currentUser.hasOwnProperty('role') && currentUser.role === 'admin') {
    if (impersonatedMerchant) {
      mergedPages.value = [...defaultValue]
    } else {
      mergedPages.value = [...adminRoutes]
    }
  } else {
    mergedPages.value = [...defaultValue]
  }
})
</script>
