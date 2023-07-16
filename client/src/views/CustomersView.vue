<script setup>

import {onMounted, reactive} from 'vue'
import '../assets/index.css'
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import Table from "@/components/Table.vue";
import moment from "moment";

onMounted(async () => {
  await getCustomers()
})

const defaultValue = {
  currentTab: "Vue d'ensemble",
  tabs: ["Vue d'ensemble"],
}

const data = reactive({
  ...defaultValue,
  customers: {},
})

async function getCustomers () {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  })
  if (response.ok) {
    data.customers = await response.json()
  }
}

</script>


<template>
  <SideBar />

  <div class="sm:ml-64">
    <NavBar />
    <div class="p-4 lg:p-10">

      <h1 class="text-3xl font-bold"><i class="fa-solid fa-users mr-2"></i> Clients</h1>

      <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul class="flex flex-wrap -mb-px">
          <li
              v-for="tab in data.tabs"
              :key="tab"
              class="mr-2"
              @click="data.currentTab = tab"
          >
            <a href="#" :class="`inline-block p-4 rounded-t-lg border-b-2 ${tab === data.currentTab ? 'active text-blue-600 border-blue-600' : 'hover:text-gray-600 hover:border-gray-300 border-transparent'}`">{{ tab }}</a>
          </li>
        </ul>
      </div>

      <div class="relative overflow-x-auto" v-if="data.currentTab === 'Vue d\'ensemble' ">
        <Table>
          <template #thead>
            <tr>
              <th scope="col" class="px-6 py-3">Nom</th>
              <th scope="col" class="px-6 py-3">Email</th>
              <th scope="col" class="px-6 py-3">Moyen de paiement par défaut</th>
              <th scope="col" class="px-6 py-3">Crée le</th>
            </tr>
          </template>
          <template #tbody>
            <tr
                v-for="customer in data.customers"
                :key="customer.id"
                class="bg-white border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <router-link :to="{ name: 'customerDetail', params: { 'id': customer.id } }">
                  {{ customer.firstname }} {{ customer.lastname }}
                  <span :class="`text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-4 ${customer.role === 'merchant' ? 'bg-orange-100 text-orange-800' : customer.role === 'customer' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`">{{ customer.role === 'merchant' ? 'Marchant' : customer.role === 'customer' ? 'Client' : 'Admin' }}</span>
                </router-link>
              </th>
              <td class="px-6 py-4">
                {{ customer.email }}
              </td>
              <td class="px-6 py-4">
                ####
              </td>
              <td class="px-6 py-4">
                {{ moment(customer.created_at).format('LLLL') }}
              </td>
            </tr>
            <tr class="bg-white border-b" v-if="!data.customers.length">
              <th colspan="4" scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                Aucun client
              </th>
            </tr>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>