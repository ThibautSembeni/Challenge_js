<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import '../../assets/index.css'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import moment from 'moment'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import Table from '@/components/Table.vue'
import store from '@/stores/store'

const user = store.state.user
import router from '@/router'
import Dropdown from '@/components/Dropdown.vue'
import { getSSEToken } from '../../services/auth'
import { deleteTransaction, getTransactions } from '@/services/transactions'

onMounted(async () => {
  data.payments = await getTransactions()
  await subscribeToSSETransaction()
})

onUnmounted(async () => {
  if (eventSource.value) {
    eventSource.value.close()
  }
})

const defaultValue = {
  currentTab: 'Tous les paiements',
  tabs: ['Tous les paiements', 'Litiges', 'Toutes les transactions'],
  currentFilterAll: 'Tous',
  filtersAll: ['Tous', 'Réussi', 'En attente', 'Échoué'],
  pager: {
    currentPage: 1,
    perPage: 20
  }
}

const data = reactive({
  ...defaultValue,
  payments: {}
})

const eventSource = ref(null)

async function subscribeToSSETransaction() {
  const token = await getSSEToken()
  const params = new URLSearchParams()
  params.set('username', user.id)
  params.set('token', token)
  if (localStorage.getItem('last-id')) {
    params.set('last-id', localStorage.getItem('last-id'))
  }
  eventSource.value = new EventSource(
    `${import.meta.env.VITE_API_URL}/transactions/transaction/subscribe?` + params
  )
  bindEventSource(eventSource.value)
}

function bindEventSource(eventSource) {
  eventSource.addEventListener('transaction', (event) => {
    const message = JSON.parse(event.data)
    data.payments[Object.entries(data.payments).length] = message
    localStorage.setItem('last-id', event.lastEventId)
  })
}
const deletePayment = async (paymentId) => {
  await deleteTransaction(paymentId)
  data.payments = await getTransactions()
}

// eslint-disable-next-line vue/return-in-computed-property
const filteredPaymentsAll = computed(() => {
  const payments = data.payments

  switch (data.currentFilterAll) {
    case 'Tous':
      return Object.values(payments)
        .sort(
          (firstItem, secondItem) =>
            new Date(secondItem.createdAt).getTime() - new Date(firstItem.createdAt).getTime()
        )
        .slice(
          (data.pager.currentPage - 1) * data.pager.perPage,
          data.pager.currentPage * data.pager.perPage
        )
    case 'Réussi':
      return payments
        .filter((p) => p.status === 'paid')
        .sort(
          (firstItem, secondItem) =>
            new Date(secondItem.createdAt).getTime() - new Date(firstItem.createdAt).getTime()
        )
        .slice(
          (data.pager.currentPage - 1) * data.pager.perPage,
          data.pager.currentPage * data.pager.perPage
        )
    case 'En attente':
      return payments
        .filter((p) => p.status === 'pending')
        .sort(
          (firstItem, secondItem) =>
            new Date(secondItem.createdAt).getTime() - new Date(firstItem.createdAt).getTime()
        )
        .slice(
          (data.pager.currentPage - 1) * data.pager.perPage,
          data.pager.currentPage * data.pager.perPage
        )
    case 'Échoué':
      return payments
        .filter((p) => p.status === 'failed')
        .sort(
          (firstItem, secondItem) =>
            new Date(secondItem.createdAt).getTime() - new Date(firstItem.createdAt).getTime()
        )
        .slice(
          (data.pager.currentPage - 1) * data.pager.perPage,
          data.pager.currentPage * data.pager.perPage
        )
  }
})
</script>

<template>
  <SideBar />

  <div class="sm:ml-64">
    <NavBar />
    <div class="p-4 lg:p-10">
      <div class="flex items-center">
        <h1 class="text-3xl font-bold mr-3">
          <i class="fa-solid fa-dollar-sign mr-2"></i> Paiements
        </h1>

        <router-link
          :to="{ name: 'transactionAdd' }"
          class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >Ajouter une transaction</router-link
        >
      </div>

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
        <div class="flex justify-end my-3">
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
              <th scope="col" class="px-6 py-3 text-center">Actions</th>
            </tr>
          </template>
          <template #tbody>
            <tr v-for="payment in filteredPaymentsAll" :key="payment.id" class="bg-white border-b">
              <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <router-link
                  :to="{ name: 'paymentDetail', params: { reference: payment.reference } }"
                >
                  <FormatEuro :price="payment.amount" :currency="payment.currency" />
                  <span class="ml-4 font-light text-gray-400">{{ payment.currency }}</span>
                    <span :class="`${
                            payment.status === 'created'
                              ? 'bg-gray-100 text-gray-800'
                              : payment.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'canceled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                          } text-sm font-medium ml-2 px-2.5 py-0.5 rounded`"
                    >{{
                      payment.status === 'created'
                          ? 'En création'
                          : payment.status === 'paid'
                              ? 'Réussi'
                              : payment.status === 'canceled'
                                  ? 'Annulé'
                                  : 'Remboursé'
                      }}</span>
                </router-link>
              </td>
              <td class="px-6 py-4">
                Achat par :
                {{ payment.client_info.name }}
              </td>
              <td class="px-6 py-4">###</td>
              <td class="px-6 py-4">
                {{ moment(payment.createdAt).format('LLLL') }}
              </td>
              <td class="text-center">
                <Dropdown
                  :actions="[
                    {
                      label: 'Voir',
                      onClick: () =>
                        router.push({
                          name: 'paymentDetail',
                          params: { reference: payment.reference }
                        })
                    },
                    {
                      label: 'Modifier',
                      onClick: () =>
                        router.push({
                          name: 'paymentUpdate',
                          params: { reference: payment.reference }
                        }),
                      divider: true
                    },
                    {
                      label: 'Supprimer',
                      textColor: 'text-red-600 font-bold',
                      onDelete: () => deletePayment(payment.id)
                    }
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
        </Table>
        <div class="w-full px-6 py-4 flex justify-between items-center">
          <span class="w-max"
            >Résultats {{ data.pager.currentPage * data.pager.perPage - data.pager.perPage + 1 }}–{{
              data.pager.currentPage * data.pager.perPage
            }}
            affichés sur {{ data.payments.length }} résultats</span
          >
          <div class="px-6 py-4 flex space-x-2 w-max">
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
                  data.payments.length || filteredPaymentsAll.length < data.pager.perPage
              "
              :class="`border border-black-700 font-medium rounded-lg text-sm px-2 py-1 text-center ${
                data.pager.currentPage * data.pager.perPage - data.pager.perPage + 1 ===
                  data.payments.length || filteredPaymentsAll.length < data.pager.perPage
                  ? 'border-gray-200 text-gray-300'
                  : ''
              }`"
            >
              suivant
            </button>
          </div>
        </div>
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
