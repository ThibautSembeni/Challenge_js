<script setup>
import { computed, onMounted, reactive } from 'vue'
import '../assets/index.css'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import moment from 'moment'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import Table from '@/components/Table.vue'

onMounted(async () => {
  await getTransactions()
})

const defaultValue = {
  currentTab: 'Tous les paiements',
  tabs: ['Tous les paiements', 'Litiges', 'Toutes les transactions'],
  currentFilterAll: 'Tous',
  filtersAll: ['Tous', 'Réussi', 'En attente', 'Échoué']
}

const data = reactive({
  ...defaultValue,
  payments: {}
})

async function getTransactions() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    }
  })
  if (response.ok) {
    data.payments = await response.json()
  }
}

// eslint-disable-next-line vue/return-in-computed-property
const filteredPaymentsAll = computed(() => {
  switch (data.currentFilterAll) {
    case 'Tous':
      return data.payments
    case 'Réussi':
      return data.payments.filter((p) => p.status === 'paid')
    case 'En attente':
      return data.payments.filter((p) => p.status === 'pending')
    case 'Échoué':
      return data.payments.filter((p) => p.status === 'failed')
  }
})
</script>

<template>
  <SideBar />

  <div class="sm:ml-64">
    <NavBar />
    <div class="p-4 lg:p-10">
      <h1 class="text-3xl font-bold"><i class="fa-solid fa-dollar-sign mr-2"></i> Paiements</h1>

      <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul class="flex flex-wrap -mb-px">
          <li v-for="tab in data.tabs" :key="tab" class="mr-2" @click="data.currentTab = tab">
            <a
              href="#"
              :class="`inline-block p-4 rounded-t-lg border-b-2 ${
                tab === data.currentTab
                  ? 'active text-blue-600 border-blue-600'
                  : 'hover:text-gray-600 hover:border-gray-300 border-transparent'
              }`"
              >{{ tab }}</a
            >
          </li>
        </ul>
      </div>

      <div class="relative overflow-x-auto" v-if="data.currentTab === 'Tous les paiements'">
        <div class="flex flex-wrap my-3">
          <button
            v-for="filter in data.filtersAll"
            :key="filter"
            @click="data.currentFilterAll = filter"
            :class="`relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br focus:outline-none transition duration-150 ease-in-out ${
              filter === data.currentFilterAll
                ? 'from-green-400 to-blue-600'
                : 'hover:from-green-400 hover:to-blue-600 from-gray-400 to-gray-400'
            }`"
          >
            <span
              class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md"
            >
              {{ filter }}
            </span>
          </button>
        </div>

        <Table>
          <template #thead>
            <tr>
              <th scope="col" class="px-6 py-3">Montant</th>
              <th scope="col" class="px-6 py-3">Description</th>
              <th scope="col" class="px-6 py-3">Client</th>
              <th scope="col" class="px-6 py-3">Date</th>
            </tr>
          </template>
          <template #tbody>
            <tr v-for="payment in filteredPaymentsAll" :key="payment.id" class="bg-white border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <router-link
                  :to="{ name: 'paymentDetail', params: { reference: payment.reference } }"
                >
                  <FormatEuro :price="payment.amount" :currency="payment.currency" />
                  <span class="ml-4 font-light text-gray-400">{{ payment.currency }}</span>
                  <span
                    :class="`text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-4 ${
                      payment.status === 'pending'
                        ? 'bg-orange-100 text-orange-800'
                        : payment.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`"
                    >{{
                      payment.status === 'pending'
                        ? 'En attente'
                        : payment.status === 'paid'
                        ? 'Réussi'
                        : 'Échec'
                    }}</span
                  >
                </router-link>
              </th>
              <td class="px-6 py-4">
                Achat par :
                {{ payment.client_info.name }}
              </td>
              <td class="px-6 py-4">###</td>
              <td class="px-6 py-4">
                {{ moment(payment.created_at).format('LLLL') }}
              </td>
            </tr>
            <tr class="bg-white border-b" v-if="!filteredPaymentsAll.length">
              <th
                colspan="4"
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center"
              >
                Aucun paiement
              </th>
            </tr>
          </template>
        </Table>
      </div>

      <div class="relative overflow-x-auto" v-if="data.currentTab === 'Toutes les transactions'">
        <Table>
          <template #thead>
            <tr>
              <th scope="col" class="px-6 py-3">Type</th>
              <th scope="col" class="px-6 py-3">Net</th>
              <th scope="col" class="px-6 py-3">Montant</th>
              <th scope="col" class="px-6 py-3">Frais</th>
              <th scope="col" class="px-6 py-3">Description</th>
              <th scope="col" class="px-6 py-3">Disponible le</th>
            </tr>
          </template>
          <template #tbody>
            <tr class="bg-white border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                Paiement
              </th>
              <td class="px-6 py-4">208 975,98 €</td>
              <td class="px-6 py-4">200 000,00 €</td>
              <td class="px-6 py-4">(8 975,98 €) EUR</td>
              <td class="px-6 py-4">Achat par : Romain Lethumier</td>
              <td class="px-6 py-4">4 mai</td>
            </tr>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>
