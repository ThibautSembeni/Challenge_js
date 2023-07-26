<script setup>
import { onMounted, reactive } from 'vue'
import NavBar from '@/components/NavBar.vue'
import moment from 'moment'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import Table from '@/components/Table.vue'

onMounted(async () => {
    data.orders = await getOrders()
})

const data = reactive({
    orders: {}
})

</script>

<template>
    <div>
        <NavBar />
        <div class="p-4 lg:p-10">
            <div class="flex items-center">
                <h1 class="text-3xl font-bold mr-3">
                    <i class="fa-solid fa-boxes-stacked mr-2"></i> Commandes
                </h1>
            </div>

            <div class="relative overflow-x-auto">
                <Table>
                    <template #thead>
                        <tr>
                            <th scope="col" class="px-6 py-3">Numéro de commande</th>
                            <th scope="col" class="px-6 py-3">Montant</th>
                            <th scope="col" class="px-6 py-3">Date</th>
                        </tr>
                    </template>
                    <template #tbody>
                        <tr v-for="order in data.orders" :key="order.id" class="bg-white border-b">
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {{ order.id }}
                            </td>
                            <td class="px-6 py-4">
                                <FormatEuro :price="order.amount" currency="eur" />
                            </td>
                            <td class="px-6 py-4">
                                {{ moment(order.createdAt).format('LLLL') }}
                            </td>
                        </tr>
                        <tr class="bg-white border-b" v-if="data.orders.length">
                            <th colspan="3"
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center"
                            >
                                Aucune commande
                            </th>
                        </tr>
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>
