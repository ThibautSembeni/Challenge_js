<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import PaymentDetail from '@/components/Payment/PaymentDetail.vue'
import PaymentDetailLine from '@/components/Payment/PaymentDetailLine.vue'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import moment from 'moment'
import { getTransaction } from '@/services/transactions'
import Chronologie from '@/components/Payment/Chronologie.vue'
import PaymentStatus from '@/components/Payment/PaymentStatus.vue'
import RefundModal from '@/components/Payment/RefundModal.vue'
import { createOperation } from '@/services/operations'

const payment = reactive({})
const timeline = reactive([])
const isLoading = ref(true)
const params_reference = useRoute().params.reference

const isRefundModalOpen = ref(false)

function openRefundModal() {
  isRefundModalOpen.value = true
}

async function closeModal(amount) {
  await createOperation(payment.reference, amount)
  isRefundModalOpen.value = false
  await getTransactionByReference()
}

onMounted(async () => {
  await getTransactionByReference()
})
async function getTransactionByReference() {
  const transaction = await getTransaction(params_reference)
  Object.assign(payment, transaction.currentState)
  Object.assign(timeline, transaction.timeline)
  isLoading.value = false
}

const formatEuro = (value, currency) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency }).format(value)
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
            :to="{ name: 'payments' }"
            class="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
            ><i class="fa-solid fa-chevron-left mr-2"></i> Retour</router-link
          >
          <h1 class="uppercase"><i class="fa-solid fa-dollar-sign mr-2"></i> Chargement...</h1>
        </div>
      </div>
    </div>
    <div class="p-4 lg:p-10" v-if="!isLoading">
      <div class="md:flex md:flex-wrap md:justify-between font-light text-sm text-gray-400 mb-6">
        <div class="flex flex-wrap items-center">
          <router-link
            :to="{ name: 'payments' }"
            class="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
            ><i class="fa-solid fa-chevron-left mr-2"></i> Retour</router-link
          >
          <h1 class="uppercase"><i class="fa-solid fa-dollar-sign mr-2"></i> Paiement</h1>
        </div>
        <p>{{ payment.reference }}</p>
      </div>

      <div class="flex flex-wrap justify-between border-b border-gray-200 pb-5">
        <p class="font-bold text-2xl flex flex-wrap items-center">
          <FormatEuro
            v-if="payment.amount && payment.currency"
            :price="payment.amount"
            :currency="payment.currency"
          />
          <span class="font-light text-gray-400 uppercase ml-2">{{ payment.currency }}</span>

          <PaymentStatus :payment="payment" class="ml-4" />
        </p>
        <button
          @click="openRefundModal"
          class="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 focus:outline-none"
        >
          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md">
            <i class="fa-solid fa-rotate-left md:mr-2"></i>
            <span class="hidden md:inline">Rembourser</span>
          </span>
        </button>
        <RefundModal v-if="isRefundModalOpen" @close="closeModal" />
      </div>

      <div class="flex flex-wrap mb-10">
        <table class="font-light text-left">
          <thead>
            <tr class="text-gray-400">
              <th class="font-light border-r px-3 pt-3">Dernière mise à jour</th>
              <th class="font-light border-r px-3 pt-3">Client</th>
              <th class="font-light px-3 pt-3">Évaluation des risques</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-3 border-r">{{ moment(payment.updatedAt).format('LLLL') }}</td>
              <td class="p-3 border-r">{{ payment.client_info.name }}</td>
              <td class="p-3">
                <span
                  class="bg-orange-100 text-orange-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
                  >10</span
                >
                Risque normal
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaymentDetail title="Chronologie">
        <Chronologie :timeline="timeline" />
      </PaymentDetail>

      <PaymentDetail title="Détails du paiement">
        <div class="flex flex-wrap justify-between my-4">
          <div class="w-full md:w-1/2">
            <div class="flex flex-wrap">
              <PaymentDetailLine
                title="Montant"
                :content="formatEuro(payment.amount, payment.currency)"
              />
              <PaymentDetailLine title="Devise" :content="payment.currency" />
              <PaymentDetailLine
                title="Date de paiement"
                :content="moment(payment.createdAt).format('ll')"
              />
              <PaymentDetailLine
                title="Heure de paiement"
                :content="moment(payment.createdAt).format('LT')"
              />
            </div>
          </div>
        </div>
      </PaymentDetail>

      <PaymentDetail title="Référence du paiement">
        <div class="flex flex-wrap justify-between my-4">
          <div class="w-full md:w-1/2">
            <div class="flex flex-wrap">
              <PaymentDetailLine title="ID" :content="payment.reference" />
            </div>
          </div>
        </div>
      </PaymentDetail>

      <PaymentDetail title="Adresse de facturation">
        <div class="flex flex-wrap justify-between my-4">
          <div class="w-full md:w-1/2">
            <div class="flex flex-wrap">
              <PaymentDetailLine title="Rue" :content="payment.billing_info.address" />
              <PaymentDetailLine title="Code postal" :content="payment.billing_info.postal_code" />
              <PaymentDetailLine title="Ville" :content="payment.billing_info.city" />
              <PaymentDetailLine title="Pays" :content="payment.billing_info.country" />
            </div>
          </div>
        </div>
      </PaymentDetail>

      <PaymentDetail title="Adresse de livraison">
        <div class="flex flex-wrap justify-between my-4">
          <div class="w-full md:w-1/2">
            <div class="flex flex-wrap">
              <PaymentDetailLine title="Rue" :content="payment.shipping_info.address" />
              <PaymentDetailLine title="Code postal" :content="payment.shipping_info.postal_code" />
              <PaymentDetailLine title="Ville" :content="payment.shipping_info.city" />
              <PaymentDetailLine title="Pays" :content="payment.shipping_info.country" />
            </div>
          </div>
        </div>
      </PaymentDetail>
    </div>
  </div>
</template>
