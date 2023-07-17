<script setup>
import { onMounted, reactive, computed } from 'vue'
import '../../assets/index.css'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import Table from '@/components/Table.vue'
import moment from 'moment'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import { getProducts } from '@/services/products'
import ActionsButton from '../../components/table/ActionsButton.vue'
onMounted(async () => {
  data.products = await getProducts()
})

const defaultValue = {
  currentTab: 'Tous les produits',
  tabs: ['Tous les produits'],
  currentFilterAll: 'Tout',
  filtersAll: ['Tout', 'Disponibles', 'Archivés'],
  pager: {
    currentPage: 1,
    perPage: 20
  }
}

const data = reactive({
  ...defaultValue,
  products: {}
})

// eslint-disable-next-line vue/return-in-computed-property
const filteredProductsAll = computed(() => {
  switch (data.currentFilterAll) {
    case 'Tout':
      return Object.values(data.products)
        .sort(
          (firstItem, secondItem) =>
            new Date(secondItem.createdAt).getTime() - new Date(firstItem.createdAt).getTime()
        )
        .slice(
          (data.pager.currentPage - 1) * data.pager.perPage,
          data.pager.currentPage * data.pager.perPage
        )
    case 'Disponibles':
      return Object.values(data.products)
        .filter((p) => p.stock > 0 && p.status === 'active')
        .sort(
          (firstItem, secondItem) =>
            new Date(secondItem.createdAt).getTime() - new Date(firstItem.createdAt).getTime()
        )
        .slice(
          (data.pager.currentPage - 1) * data.pager.perPage,
          data.pager.currentPage * data.pager.perPage
        )
    case 'Archivés':
      return Object.values(data.products)
        .filter((p) => p.status === 'archived')
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
          <i class="fa-solid fa-boxes-stacked mr-2"></i> Produits
        </h1>

        <router-link
          :to="{ name: 'productAdd' }"
          class="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >Ajouter un produit</router-link
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

      <div class="relative overflow-x-auto" v-if="data.currentTab === 'Tous les produits'">
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
              <th scope="col" class="px-6 py-3">Nom</th>
              <th scope="col" class="px-6 py-3">Stock</th>
              <th scope="col" class="px-6 py-3">Date de création</th>
              <th scope="col" class="px-6 py-3">date de mise à jour</th>
              <th></th>
            </tr>
          </template>
          <template #tbody>
            <tr v-for="product in filteredProductsAll" :key="product.id" class="bg-white border-b">
              <th
                scope="row"
                colspan="5"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex flex-col"
              >
                <router-link
                  :to="{ name: 'productDetail', params: { reference: product.reference } }"
                >
                  {{ product.name }}
                  <span
                    v-if="product.status === 'archived'"
                    class="text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-4 bg-gray-200 text-gray-500"
                    >Archivé</span
                  >
                </router-link>
                <FormatEuro
                  :price="product.price"
                  currency="eur"
                  class="text-gray-400 font-normal"
                />
              </th>
              <td class="px-6 py-4">
                {{ product.stock }}
              </td>
              <td class="px-6 py-4">
                {{ moment(product.createdAt).format('DD/MM/YYYY') }}
              </td>
              <td class="px-6 py-4">
                {{ moment(product.updatedAt).format('DD/MM/YYYY') }}
              </td>
              <td class="py-4">
                <!-- <ActionsButton /> -->
                <router-link
                  :to="{ name: 'productUpdate', params: { reference: product.reference } }"
                >
                  edit
                </router-link>
              </td>
            </tr>
            <tr class="bg-white border-b" v-if="!filteredProductsAll.length">
              <th
                colspan="5"
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center"
              >
                Aucun produit
              </th>
            </tr>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>
