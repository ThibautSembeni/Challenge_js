<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-800">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="#" class="flex items-center">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-8 mr-3" alt="Strape Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >MARQUESPLACE</span
        >
      </a>

      <div class="flex items-center md:order-2">
        <button
          type="button"
          class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          id="user-menu-button"
          aria-expanded="false"
          data-dropdown-toggle="user-dropdown"
          data-dropdown-placement="bottom"
        >
          <span class="sr-only">Menu</span>
          <img
            class="w-8 h-8 rounded-full"
            src="https://flowbite.com/docs/images/logo.svg"
            alt="user photo"
          />
        </button>
        <!-- Dropdown menu -->
        <div
          class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
          id="user-dropdown"
        >
          <div class="px-4 py-3">
            <span class="block text-sm text-gray-900 dark:text-white"
              >{{ currentUser?.lastname }} {{ currentUser?.firstname }}</span
            >
            <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{
              currentUser?.email
            }}</span>
          </div>
          <ul class="py-2" aria-labelledby="user-menu-button">
            <li>
              <router-link
                :to="{ name: 'profile' }"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >Profile</router-link
              >
            </li>
            <li>
              <router-link
                :to="{ name: 'logout' }"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >Déconnexion</router-link
              >
            </li>
          </ul>
        </div>
      </div>
      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-user"
      >
        <ul
          class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:border-gray-700"
        >
          <li>
            <router-link
              :to="{ name: 'products' }"
              :class="`block py-2 pl-3 pr-4 md:p-0 rounded ${
                $route.name === 'products' ? 'md:text-blue-700 md:dark:text-blue-500' : 'text-white'
              }`"
              aria-current="page"
              >Produit</router-link
            >
          </li>
          <li>
            <router-link
              :to="{ name: 'panier' }"
              :class="`block py-2 pl-3 pr-4 md:p-0 rounded ${
                $route.name === 'panier' ? 'md:text-blue-700 md:dark:text-blue-500' : 'text-white'
              }`"
              >Panier</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'
import '../assets/index.css'
import { getCurrentUser } from '@/services/auth'

const currentUser = ref({})

onMounted(async () => {
  initFlowbite()
  currentUser.value = await getCurrentUser()
})
</script>
