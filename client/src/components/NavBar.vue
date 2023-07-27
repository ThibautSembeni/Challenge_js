<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-800">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="#" class="flex items-center">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-8 mr-3" alt="Strape Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >Strape</span
        >
      </a>

      <div class="flex items-center md:order-2">
        <div v-if="impersonatedMerchant">
          <button class="block px-4 py-2 text-sm text-white" @click="switchToAdminProfile">
            Revenir au compte admin
            <i class="fa-solid fa-right-from-bracket ml-2"></i>
          </button>
        </div>
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
        <div
          class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
          id="user-dropdown"
        >
          <div class="px-4 py-3">
            <span class="block text-sm text-gray-900 dark:text-white capitalize">{{currentUser?.lastname}} {{currentUser?.firstname}}</span>
            <span class="block text-sm text-gray-500 truncate dark:text-gray-400"
              >{{currentUser?.email}}</span
            >
          </div>
          <ul class="py-2" aria-labelledby="user-menu-button">
            <li>
              <router-link
                :to="{ name: 'profile' }"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >Mon compte</router-link
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
        <button
          data-collapse-toggle="navbar-user"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-user"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'
import { stopImpersonatingUser } from '@/services/users'
import { getCurrentUser, isImperonating } from '@/services/auth'

const currentUser = getCurrentUser()
const role = ref('')

const impersonatedMerchant = ref(false)

const switchToAdminProfile = async () => {
  try {
    await stopImpersonatingUser()
    currentUser.value = await getCurrentUser()
    impersonatedMerchant.value = false
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
    initFlowbite()
    currentUser.value = await getCurrentUser()
    if (currentUser?.role === 'admin') {
      impersonatedMerchant.value = await isImperonating()
    }
})
</script>
