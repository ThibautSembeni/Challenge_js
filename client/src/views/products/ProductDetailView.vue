<script setup>
import { onMounted, reactive, ref } from 'vue'
import '../../assets/index.css'
import { useRoute } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import PaymentDetail from '@/components/Payment/PaymentDetail.vue'
import PaymentDetailLine from '@/components/Payment/PaymentDetailLine.vue'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import moment from 'moment'
import { getProduct } from '@/services/products'

onMounted(async () => {
  await productSetup()
})

const product = reactive({})
const isLoading = ref(true)

async function productSetup() {
  const response = await getProduct(useRoute().params.reference)

  Object.assign(product, response)
  isLoading.value = false
}
</script>

<template>
  <SideBar />

  <div class="sm:ml-64">
    <NavBar />
    <div class="p-4 lg:p-10" v-if="isLoading">
      <div class="md:flex md:flex-wrap md:justify-between font-light text-sm text-gray-400 mb-6">
        <div class="flex flex-wrap items-center">
          <router-link
            :to="{ name: 'products' }"
            class="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
            ><i class="fa-solid fa-chevron-left mr-2"></i> Retour</router-link
          >
          <h1 class="uppercase"><i class="fa-solid fa-boxes-stacked mr-2"></i> Chargement...</h1>
        </div>
      </div>
    </div>
    <div class="p-4 lg:p-10" v-if="!isLoading">
      <div class="md:flex md:flex-wrap md:justify-between font-light text-sm text-gray-400 mb-6">
        <div class="flex flex-wrap items-center">
          <router-link
            :to="{ name: 'products' }"
            class="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
            ><i class="fa-solid fa-chevron-left mr-2"></i> Retour</router-link
          >
          <h1 class="uppercase"><i class="fa-solid fa-boxes-stacked mr-2"></i> Produit</h1>
        </div>
        <p>{{ product.reference }}</p>
      </div>

      <div class="flex flex-wrap justify-between border-b border-gray-200 pb-5">
        <p class="font-bold text-2xl flex flex-wrap items-center">
          {{ product.name }}
          <span
            v-if="product.status === 'archived'"
            class="text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-4 bg-gray-200 text-gray-500"
            >Archivé</span
          >
        </p>
      </div>

      <div class="flex flex-wrap mb-10">
        <table class="font-light text-left">
          <thead>
            <tr class="text-gray-400">
              <th class="font-light border-r px-3 pt-3">Dernière mise à jour</th>
              <th class="font-light border-r px-3 pt-3">Prix</th>
              <th class="font-light border-r px-3 pt-3">Revenu du produit</th>
              <th class="font-light border-r px-3 pt-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-3 border-r">{{ moment(product.created_at).format('LLLL') }}</td>
              <td class="p-3 border-r">
                <FormatEuro currency="eur" :price="product.price" />
              </td>
              <td class="p-3 border-r">à faire</td>
              <td class="p-3 border-r">{{ product.stock }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaymentDetail title="Détails">
        <div class="flex flex-wrap justify-between my-4">
          <div class="w-full md:w-1/2">
            <div class="flex flex-wrap">
              <PaymentDetailLine title="Nom" :content="product.name" />
              <PaymentDetailLine title="Description" :content="product.description" />
              <PaymentDetailLine title="Référence du produit" :content="product.reference" />
            </div>
          </div>
        </div>
      </PaymentDetail>
    </div>
  </div>
</template>
