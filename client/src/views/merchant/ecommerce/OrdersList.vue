<script setup>
import { computed, onMounted, reactive } from 'vue'
import '../../../assets/index.css'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import moment from 'moment'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import Table from '@/components/Table.vue'
import router from "@/router";
import Dropdown from "@/components/Dropdown.vue";
import {getTransactions} from "@/services/transactions";


onMounted(async () => {
  data.payments = await getTransactions()
  await subscribeToSSETransaction()
})



const defaultValue = {
  currentTab: 'Tous les paiements',
  tabs: 'Tous les paiements',
  currentFilterAll: 'Tous',

  pager: {
    currentPage: 1,
    perPage: 20
  }
}

const data = reactive({
  ...defaultValue,
  payments: {}
})

async function subscribeToSSETransaction() {
  const params = new URLSearchParams()
  params.set('username', 'test')
  if (localStorage.getItem('last-id')) {
    params.set('last-id', localStorage.getItem('last-id'))
  }
  const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/transactions/transaction/subscribe?` + params
  )
  bindEventSource(eventSource)
}

function bindEventSource(eventSource) {
  eventSource.addEventListener('transaction', (event) => {
    const message = JSON.parse(event.data)
    data.payments[Object.entries(data.payments).length] = message
    localStorage.setItem('last-id', event.lastEventId)
  })
}

// eslint-disable-next-line vue/return-in-computed-property
const filteredPaymentsAll = computed(() => {
  const payments = data.payments;
  const currentFilter = data.currentFilterAll;

  if (currentFilter === 'Tous') {
    return Object.values(payments)
        .sort(
            (firstItem, secondItem) =>
                new Date(secondItem.createdAt).getTime() - new Date(firstItem.createdAt).getTime()
        )
        .slice(
            (data.pager.currentPage - 1) * data.pager.perPage,
            data.pager.currentPage * data.pager.perPage
        );
    }
});

</script>

<template>
  <SideBar/>

  <div class="sm:ml-64">
    <NavBar />
    <div class="p-4 lg:p-10">

      <div class="flex items-center">
        <h1 class="text-3xl font-bold mr-3">Historique des commandes</h1>
  </div>

      <!--<div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
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
      </div>-->

     <div class="relative overflow-x-auto" v-if="data.currentTab === 'Tous les paiements'">
        <div class="flex justify-end my-3">
          <!--<button
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
          </button>-->
        </div>

        <Table>
          <template #thead>
            <tr>
              <th scope="col" class="px-6 py-3">Montant</th>
              <th scope="col" class="px-6 py-3">Client</th>
              <th scope="col" class="px-6 py-3">Reférence</th>
              <th scope="col" class="px-6 py-3">Date</th>
              <th scope="col" class="px-6 py-3 text-center">Actions</th>
            </tr>
          </template>
          <template #tbody>
            <tr v-for="payment in filteredPaymentsAll" :key="payment.id" class="bg-white border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <router-link
                    :to="{ name: 'orderdetail', params: { reference: payment.reference } }"
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

                {{ payment.client_info.name }}
              </td>
              <td class="px-6 py-4">{{payment.reference}}</td>
              <td class="px-6 py-4">
                {{ moment(payment.createdAt).format('LLLL') }}
              </td>
              <td class="text-center">
                <Dropdown
                    :actions="[
                    { label: 'Voir', onClick: () => router.push({ name: 'orderdetail', params: { 'reference': payment.reference } }) },
                    { label: 'Modifier', onClick: () => router.push({ name: 'paymentUpdate', params: { 'reference': payment.reference } }), divider: true },
                    { label: 'Supprimer', textColor: 'text-red-600 font-bold', onDelete: () => deletePayment(payment.id) }
                  ]"
                    :dropdownId="payment.id"
                    @deleted="data.payments = getTransactions()"
                />
              </td>
            </tr>
            <tr class="bg-white border-b" v-if="!filteredPaymentsAll.length">
              <th
                  colspan="5"
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center"
              >
                Aucun paiement
              </th>
            </tr>
          </template>
          <template #tfoot>
            <tr>
              <td colspan="3" class="px-6 py-4">
                <span
                >Résultats
                  {{ data.pager.currentPage * data.pager.perPage - data.pager.perPage + 1 }}–{{
                    data.pager.currentPage * data.pager.perPage
                  }}
                  affichés sur {{ data.payments.length }} résultats</span
                >
              </td>
              <td class="px-6 py-4 flex flex-end space-x-2 w-full">
                <button
                    @click="data.pager.currentPage--"
                    :disabled="data.pager.currentPage === 1"
                    :class="`border border-black-700 font-medium rounded-lg text-sm px-2 py-1 text-center ${
                    data.pager.currentPage === 1 ? 'border-gray-200 text-gray-300' : ''
                  }`"
                >
                  précédent
                </button>
                <button
                    @click="data.pager.currentPage++"
                    :disabled="
                    data.pager.currentPage * data.pager.perPage - data.pager.perPage + 1 ===
                      data.payments.length ||
                    data.pager.currentPage * data.pager.perPage - data.pager.perPage + 1 <=
                      data.payments.length
                  "
                    :class="`border border-black-700 font-medium rounded-lg text-sm px-2 py-1 text-center ${
                    data.pager.currentPage * data.pager.perPage - data.pager.perPage + 1 ===
                      data.payments.length ||
                    data.pager.currentPage * data.pager.perPage - data.pager.perPage + 1 <=
                      data.payments.length
                      ? 'border-gray-200 text-gray-300'
                      : ''
                  }`"
                >
                  suivant
                </button>
              </td>
            </tr>
          </template>
        </Table>
      </div>


    </div>
  </div>
</template>
