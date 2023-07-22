<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import '../assets/index.css'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import PaymentDetail from '@/components/Payment/PaymentDetail.vue'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import moment from 'moment'
import Table from '@/components/Table.vue'
import { getUserById } from '@/services/users'
import { getTransactionsOfUserById } from '@/services/transactions'
onMounted(async () => {
  await Promise.all([getCustomer(), getPaymentsForThisUser()])
  isLoading.value = false
})

const data = reactive({
  customer: {},
  payments: {}
})

const isLoading = ref(true)

async function getCustomer() {
  const user = await getUserById(useRoute().params.id)
  Object.assign(data.customer, user)
}

async function getPaymentsForThisUser() {
  const transactions = await getTransactionsOfUserById(useRoute().params.id)
  Object.assign(data.payments, transactions)
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
            :to="{ name: 'customers' }"
            class="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
            ><i class="fa-solid fa-chevron-left mr-2"></i> Retour</router-link
          >
          <h1 class="uppercase"><i class="fa-solid fa-user mr-2"></i> Chargement...</h1>
        </div>
      </div>
    </div>
    <div class="p-4 lg:p-10" v-if="!isLoading">
      <div class="md:flex md:flex-wrap md:justify-between font-light text-sm text-gray-400 mb-6">
        <div class="flex flex-wrap items-center">
          <router-link
            :to="{ name: 'customers' }"
            class="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
            ><i class="fa-solid fa-chevron-left mr-2"></i> Retour</router-link
          >
          <h1 class="uppercase"><i class="fa-solid fa-user mr-2"></i> Client</h1>
        </div>
        <p>{{ data.customer.id }}</p>
      </div>

      <div class="flex flex-wrap justify-between border-b border-gray-200 pb-5">
        <p class="font-bold text-2xl flex flex-wrap items-center">
          <i class="fa-solid fa-user mr-2"></i>
          {{ data.customer.firstname }} {{ data.customer.lastname }}
          <span
            :class="`${
              data.customer.role === 'merchant'
                ? 'bg-orange-100 text-orange-800'
                : data.customer.role === 'customer'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            } text-sm font-medium ml-2 px-2.5 py-0.5 rounded`"
            >{{
              data.customer.role === 'merchant'
                ? 'Marchant'
                : data.customer.role === 'customer'
                ? 'Client'
                : 'Admin'
            }}</span
          >
        </p>
      </div>

      <div class="flex flex-wrap mb-10">
        <table class="font-light text-left">
          <thead>
            <tr class="text-gray-400">
              <th class="font-light border-r px-3 pt-3">Dernière mise à jour</th>
              <th class="font-light border-r px-3 pt-3">Devise</th>
              <th class="font-light border-r px-3 pt-3">Moyen de paiement préféré</th>
              <th class="font-light px-3 pt-3">Nombre de paiements</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-3 border-r">{{ moment(data.customer.updated_at).format('LLLL') }}</td>
              <td class="p-3 border-r uppercase">{{ data.customer.payout_currency }}</td>
              <td class="p-3 border-r">
                <i class="fa-brands fa-cc-visa mr-2"></i>
                <i class="fa-solid fa-ellipsis mr-2"></i> 4444
              </td>
              <td class="p-3">
                <span
                  class="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
                  >{{ Object.keys(data.payments).length }}</span
                >
                Paiements réalisés
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaymentDetail title="Paiements de l'utilisateur">
        <Table>
          <template #thead>
            <tr>
              <th scope="col" class="px-6 py-3">Montant</th>
              <th scope="col" class="px-6 py-3">Référence</th>
              <th scope="col" class="px-6 py-3">Date</th>
            </tr>
          </template>
          <template #tbody>
            <tr v-for="payment in data.payments" :key="payment.id" class="bg-white border-b">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <router-link
                  :to="{ name: 'paymentDetail', params: { reference: payment.reference } }"
                >
                  <FormatEuro :currency="payment.currency" :price="payment.amount" />
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
              <td class="px-6 py-4 font-light text-gray-400">
                {{ payment.reference }}
              </td>
              <td class="px-6 py-4">
                {{ moment(payment.created_at).format('LLLL') }}
              </td>
            </tr>
          </template>
        </Table>
      </PaymentDetail>
    </div>
  </div>
</template>
