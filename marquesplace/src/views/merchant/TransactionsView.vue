<script setup>
import { computed, onMounted, reactive } from 'vue'
import NavBar from '@/components/NavBar.vue'
import moment from 'moment'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import Table from '@/components/Table.vue'
import { getTransactions } from '@/services/transactions'
import PaymentStatus from "@/components/Payment/PaymentStatus.vue";

onMounted(async () => {
    data.payments = await getTransactions()
})

const defaultValue = {
    currentTab: 'Tous les paiements',
    tabs: ['Tous les paiements'],
    currentFilterAll: 'Tous',
    filtersAll: {
        'Tous' : 'all',
        'En attente' : 'created',
        'Capturée' : 'captured',
        'Annulé' : 'cancelled',
        'En attente de remboursement' : 'waiting_refund',
        'Remboursée partiellement' : 'partially_refunded',
        'Refusée' : 'refunded'
    },
    pager: {
        currentPage: 1,
        perPage: 20
    }
}

const data = reactive({
    ...defaultValue,
    payments: {}
})

const filteredPaymentsAll = computed(() => {
    const payments = data.payments

    const filterStatus = data.filtersAll[data.currentFilterAll]

    if (filterStatus === 'all') {
        return Object.values(payments)
            .sort(
                (firstItem, secondItem) =>
                    new Date(secondItem.createdAt).getTime() - new Date(firstItem.createdAt).getTime()
            )
            .slice(
                (data.pager.currentPage - 1) * data.pager.perPage,
                data.pager.currentPage * data.pager.perPage
            )
    } else {
        return Object.values(payments)
            .filter((p) => p.status === filterStatus)
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
    <div>
        <NavBar />
        <div class="p-4 lg:p-10">
            <div class="flex items-center">
                <h1 class="text-3xl font-bold mr-3">
                    <i class="fa-solid fa-dollar-sign mr-2"></i> Paiements
                </h1>
            </div>

            <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                <ul class="flex flex-wrap -mb-px">
                    <li v-for="tab in data.tabs" :key="tab" class="mr-2" @click="data.currentTab = tab">
                        <a href="#"
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
                    <button v-for="(filterStatus, filter) in data.filtersAll"
                            :key="filterStatus"
                            @click="data.currentFilterAll = filter"
                            :class="`relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br focus:outline-none transition duration-150 ease-in-out ${
                      filter === data.currentFilterAll
                        ? 'from-green-400 to-blue-600'
                        : 'hover:from-green-400 hover:to-blue-600 from-gray-400 to-gray-400'
                    }`"
                    >
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md">{{ filter }}</span>
                    </button>
                </div>


                <Table>
                    <template #thead>
                        <tr>
                            <th scope="col" class="px-6 py-3">Montant</th>
                            <th scope="col" class="px-6 py-3">Description</th>
                            <th scope="col" class="px-6 py-3">Date</th>
                        </tr>
                    </template>
                    <template #tbody>
                        <tr v-for="payment in filteredPaymentsAll" :key="payment.id" class="bg-white border-b">
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                <FormatEuro :price="payment.amount" :currency="payment.currency" />
                                <span class="ml-4 font-light text-gray-400">{{ payment.currency }}</span>
                                <PaymentStatus :payment="payment" class="ml-4" />
                            </td>
                            <td class="px-6 py-4">
                                Achat par :
                                {{ payment.client_info.name }}
                            </td>
                            <td class="px-6 py-4">
                                {{ moment(payment.createdAt).format('LLLL') }}
                            </td>
                        </tr>
                        <tr class="bg-white border-b" v-if="!filteredPaymentsAll.length">
                            <th
                                colspan="3"
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
        </div>
    </div>
</template>
