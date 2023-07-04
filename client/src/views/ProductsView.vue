<script setup>

import {onMounted, reactive, computed} from 'vue'
import '../assets/index.css'
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import Table from "@/components/Table.vue";
import moment from "moment";
import FormatEuro from "@/components/Payment/FormatEuro.vue";

onMounted(async () => {
    await getProducts()
})

const defaultValue = {
    currentTab: "Tous les produits",
    tabs: ["Tous les produits"],
    currentFilterAll: 'Tous',
    filtersAll: ['Tous', 'Disponible'],
}

const data = reactive({
    ...defaultValue,
    products: {},
})

async function getProducts () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        },
    })
    if (response.ok) {
        data.products = await response.json()
    }
}

// eslint-disable-next-line vue/return-in-computed-property
const filteredProductsAll = computed(() => {
    switch (data.currentFilterAll) {
        case 'Tous':
            return data.products
        case 'Disponible':
            return data.products.filter(p => p.stock > 0)
    }
})

</script>


<template>
    <SideBar />

    <div class="sm:ml-64">
        <NavBar />
        <div class="p-4 lg:p-10">

            <h1 class="text-3xl font-bold"><i class="fa-solid fa-boxes-stacked mr-2"></i> Produits</h1>

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

            <div class="relative overflow-x-auto" v-if="data.currentTab === 'Tous les produits' ">
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

                <Table>
                    <template #thead>
                        <tr>
                            <th scope="col" class="px-6 py-3">Nom</th>
                            <th scope="col" class="px-6 py-3">Description</th>
                            <th scope="col" class="px-6 py-3">Prix</th>
                            <th scope="col" class="px-6 py-3">Stock</th>
                            <th scope="col" class="px-6 py-3">Date</th>
                        </tr>
                    </template>
                    <template #tbody>
                        <tr
                            v-for="product in filteredProductsAll"
                            :key="product.id"
                            class="bg-white border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                <router-link :to="{ name: 'productDetail', params: { 'reference': product.reference } }">
                                    {{ product.name }}
                                </router-link>
                            </th>
                            <td class="px-6 py-4">
                                {{ product.description }}
                            </td>
                            <td class="px-6 py-4">
                                <FormatEuro :price="product.price" currency="eur" />
                            </td>
                            <td class="px-6 py-4">
                                {{ product.stock }}
                            </td>
                            <td class="px-6 py-4">
                                {{ moment(product.createdAt).format('DD/MM/YYYY') }}
                            </td>
                        </tr>
                        <tr class="bg-white border-b" v-if="!filteredProductsAll.length">
                            <th colspan="5" scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                Aucun produit
                            </th>
                        </tr>
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>