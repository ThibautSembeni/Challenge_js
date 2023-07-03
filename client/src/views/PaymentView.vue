<template>
    <SideBar />

    <div class="sm:ml-64">
        <NavBar />
        <div class="p-4 lg:p-10">

            <h1 class="text-3xl font-bold">Paiements</h1>

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

            <div class="relative overflow-x-auto" v-if="data.currentTab === 'Tous les paiements' ">
                <div class="flex flex-wrap my-3">
                    <button
                        v-for="filter in data.filtersAll"
                        :key="filter"
                        @click="data.currentFilterAll = filter"
                        :class="`relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br focus:outline-none transition duration-150 ease-in-out ${filter === data.currentFilterAll ? 'from-green-400 to-blue-600' : 'hover:from-green-400 hover:to-blue-600 from-gray-400 to-gray-400'}`">
                      <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md">
                          {{ filter }}
                      </span>
                    </button>
                </div>

                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th scope="col" class="px-6 py-3">Montant</th>
                            <th scope="col" class="px-6 py-3">Description</th>
                            <th scope="col" class="px-6 py-3">Client</th>
                            <th scope="col" class="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="payment in filteredPaymentsAll"
                            :key="payment.id"
                            class="bg-white border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                <router-link :to="{ name: 'paymentDetail', params: { 'uuid': 'a_remplace' } }">
                                    {{ payment.amount }}
                                    <span class="ml-4 font-light text-gray-400">{{ payment.currency }}</span>
                                    <span :class="`text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-4 ${payment.status === 'Réussi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' } `">{{ payment.status }}</span>
                                </router-link>
                            </th>
                            <td class="px-6 py-4">
                                {{ payment.description }}
                            </td>
                            <td class="px-6 py-4">
                                ###
                            </td>
                            <td class="px-6 py-4">
                                {{ payment.date }}
                            </td>
                        </tr>
                        <tr class="bg-white border-b" v-if="!filteredPaymentsAll">
                            <th colspan="4" scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                Aucun paiement
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="relative overflow-x-auto" v-if="data.currentTab === 'Toutes les transactions' ">
                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                        <th scope="col" class="px-6 py-3">Type</th>
                        <th scope="col" class="px-6 py-3">Net</th>
                        <th scope="col" class="px-6 py-3">Montant</th>
                        <th scope="col" class="px-6 py-3">Frais</th>
                        <th scope="col" class="px-6 py-3">Description</th>
                        <th scope="col" class="px-6 py-3">Disponible le</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="bg-white border-b">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Paiement
                        </th>
                        <td class="px-6 py-4">
                            208 975,98 €
                        </td>
                        <td class="px-6 py-4">
                            200 000,00 €
                        </td>
                        <td class="px-6 py-4">
                            (8 975,98 €) EUR
                        </td>
                        <td class="px-6 py-4">
                            Achat par : Romain Lethumier
                        </td>
                        <td class="px-6 py-4">
                            4 mai
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>

<script setup>

import {computed, onMounted, reactive} from 'vue'
import '../assets/index.css'
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import PaymentDetailView from "@/views/PaymentDetailView.vue";

onMounted(async () => {
    await getTransactions()
})
async function getTransactions () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        },
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
    }
}

const defaultValue = {
    currentTab: 'Tous les paiements',
    tabs: ['Tous les paiements', 'Litiges', 'Toutes les transactions'],
    currentFilterAll: 'Tous',
    filtersAll: ['Tous', 'Réussi', 'En attente', 'Échoué', 'Remboursé'],

    // payments...... depuis API
    // transactions...... depuis API
}

const data = reactive({ ...defaultValue })

const filteredPaymentsAll = computed(() => {
    switch (data.currentFilterAll) {
        case 'Tous':
            // return this.payments;
            return [
                {
                    'amount': '208 975,98 €',
                    'currency': 'EUR',
                    'status': 'Réussi',
                    'date': '27 avril. à 08:46',
                    'description': 'Achat par : Romain Lethumier'
                },
                {
                    'amount': '208,98 €',
                    'currency': 'EUR',
                    'status': 'Échec',
                    'date': '29 avril. à 08:46',
                    'description': 'Achat par : Tibo '
                }
            ]

        case 'Réussi':
            // return this.payments.filter(p => p.status === 'Réussi');
            return [
                {
                    'amount': '208 975,98 €',
                    'currency': 'EUR',
                    'status': 'Réussi',
                    'date': '27 avril. à 08:46',
                    'description': 'Achat par : Romain Lethumier'
                }
            ];
        case 'Remboursé':
            return
        case 'En attente':
            return
        case 'Échoué':
            //return this.payments.filter(p => p.status === 'Échec');
            return [
                {
                    'amount': '208,98 €',
                    'currency': 'EUR',
                    'status': 'Échec',
                    'date': '29 avril. à 08:46',
                    'description': 'Achat par : Tibo '
                }
            ]
    }
})

</script>
