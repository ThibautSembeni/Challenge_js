<script setup>
import { onMounted, reactive, ref } from 'vue'
import '../../assets/index.css'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import PaymentDetail from '@/components/Payment/PaymentDetail.vue'
import PaymentDetailLine from '@/components/Payment/PaymentDetailLine.vue'
import FormatEuro from '@/components/Payment/FormatEuro.vue'
import moment from 'moment'
import Table from '@/components/Table.vue'
import { getTransactionByReference } from '@/services/transactions'

onMounted(async () => {
  payment.transactions = await getTransactionByReference,
  isLoading.value = false


})

const payment = reactive({
  transactions: {}
})
const isLoading = ref(true)

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
          ><i class="fa-solid fa-chevron-left mr-2"></i> Retour</router-link>
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
          <span
              :class="`${
              payment.status === 'pending'
                ? 'bg-orange-100 text-orange-800'
                : payment.status === 'paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            } text-sm font-medium ml-2 px-2.5 py-0.5 rounded`"
          >{{
              payment.status === 'pending'
                  ? 'En attente'
                  : payment.status === 'paid'
                      ? 'Réussi'
                      : 'Échec'
            }}</span
          >
        </p>
        <button
            class="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 focus:outline-none"
        >
          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md">
            <i class="fa-solid fa-rotate-left md:mr-2"></i>
            <span class="hidden md:inline">Rembourser</span>
          </span>
        </button>
      </div>

      <div class="flex flex-wrap mb-10">
        <table class="font-light text-left">
          <thead>
          <tr class="text-gray-400">
            <th class="font-light border-r px-3 pt-3">Dernière mise à jour</th>
            <th class="font-light border-r px-3 pt-3">Client</th>
            <th class="font-light border-r px-3 pt-3">Moyen de paiement</th>
            <th class="font-light px-3 pt-3">Évaluation des risques</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="p-3 border-r">{{ moment(payment.updatedAt).format('LLLL') }}</td>
            <td class="p-3 border-r">{{ payment.client_info.name }}</td>
            <td class="p-3 border-r">
                <span v-if="payment.billing_info.card_number">
                  <i class="fa-brands fa-cc-visa mr-2"></i> <i class="fa-solid fa-ellipsis mr-2"></i>
                  {{ payment.billing_info.card_number.slice(-4) }}
                </span>
              <span v-else>
                    Aucune carte
                </span>
            </td>
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
        <ol class="relative border-l border-gray-200 mt-4">
          <li class="mb-7 ml-6">
            <span
                class="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3"
            >
              <i class="fa-solid fa-circle-check text-green-600"></i>
            </span>
            <h3 class="mb-1">Paiement réussi</h3>
            <time class="block mb-2 text-sm font-normal leading-none text-gray-400">{{
                moment(payment.updatedAt).format('LLLL')
              }}</time>
          </li>
          <li class="ml-6">
            <span
                class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3"
            >
              <i class="fa-solid fa-hourglass-start text-blue-800"></i>
            </span>
            <h3 class="mb-1">Paiement démarré</h3>
            <time class="block mb-2 text-sm font-normal leading-none text-gray-400">{{
                moment(payment.createdAt).format('LLLL')
              }}</time>
          </li>
        </ol>
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
              <PaymentDetailLine title="Frais" content="à faire (affichage formatté)" />
              <PaymentDetailLine
                  title="Date de paiement"
                  :content="moment(payment.createdAt).format('ll')"
              />
              <PaymentDetailLine title="Net" content="à faire (affichage formatté)" />
              <PaymentDetailLine
                  title="Heure de paiement"
                  :content="moment(payment.createdAt).format('LT')"
              />
              <PaymentDetailLine
                  title="Statut"
                  :content="
                  payment.status === 'pending'
                    ? 'En attente'
                    : payment.status === 'paid'
                    ? 'Réussi'
                    : 'Échec'
                "
              />
              <PaymentDetailLine
                  title="Type de paiement"
                  :content="payment.shipping_info.payment_type"
              />
            </div>
          </div>
        </div>
      </PaymentDetail>

      <PaymentDetail title="Moyen de paiement">
        <div class="flex flex-wrap justify-between my-4">
          <div class="w-full md:w-1/2">
            <div class="flex flex-wrap">
              <PaymentDetailLine title="ID" :content="payment.reference" />
              <PaymentDetailLine
                  title="Numéro"
                  v-if="payment.billing_info.card_number"
                  :content="'... ' + payment.billing_info.card_number.slice(-4)"
              />
              <PaymentDetailLine title="Empreinte" :content="payment.reference" />
              <PaymentDetailLine
                  title="Date d'expiration"
                  :content="payment.billing_info.expiration_date"
              />
              <PaymentDetailLine title="Type" :content="payment.billing_info.card_type" />
              <PaymentDetailLine title="Émetteur" :content="payment.billing_info.card_bank" />
              <PaymentDetailLine title="Code postal" :content="payment.billing_info.zipcode" />
              <PaymentDetailLine title="Origine" :content="payment.billing_info.country" />
              <PaymentDetailLine
                  title="Vérification CVC"
                  :content="payment.billing_info.cvc ? 'Réussi' : 'En échec'"
              />
              <PaymentDetailLine title="Vérification code postal" content="Réussi" />
            </div>
          </div>
        </div>
      </PaymentDetail>

      <PaymentDetail title="Paiements associés">
        <Table>
          <template #thead>
            <tr>
              <th scope="col" class="px-6 py-3">Risque</th>
              <th scope="col" class="px-6 py-3">Montant</th>
              <th scope="col" class="px-6 py-3">Type de source</th>
              <th scope="col" class="px-6 py-3">Client</th>
              <th scope="col" class="px-6 py-3">Appareil</th>
              <th scope="col" class="px-6 py-3">Adresse IP de l'appareil</th>
              <th scope="col" class="px-6 py-3">Date</th>
            </tr>
          </template>
          <template #tbody>
            <tr class="bg-white border-b">
              <td class="px-6 py-4">
                <span
                    class="bg-orange-100 text-orange-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
                >10</span
                >
              </td>
              <td class="px-6 py-4 font-semibold text-blue-500">
                <FormatEuro
                    v-if="payment.amount && payment.currency"
                    :price="payment.amount"
                    :currency="payment.currency"
                />
                <span
                    :class="`${
                    payment.status === 'pending'
                      ? 'bg-orange-100 text-orange-800'
                      : payment.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  } text-sm font-medium ml-2 px-2.5 py-0.5 rounded`"
                >{{
                    payment.status === 'pending'
                        ? 'En attente'
                        : payment.status === 'paid'
                            ? 'Réussi'
                            : 'Échec'
                  }}</span
                >
              </td>
              <td class="px-6 py-4">
                <span
                    class="bg-orange-100 text-orange-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded"
                    v-if="payment.billing_info.card_number"
                >
                  <i class="fa-regular fa-credit-card mr-2"></i>
                  <i class="fa-solid fa-ellipsis mr-2"></i>
                  {{ payment.billing_info.card_number.slice(-4) }}
                </span>
              </td>
              <td class="px-6 py-4">
                {{ payment.client_info.name }}
              </td>
              <td class="px-6 py-4">
                <i class="fa-solid fa-desktop mr-2"></i>
                {{ payment.billing_info.device }}
              </td>
              <td class="px-6 py-4">
                {{ payment.billing_info.IP }}
              </td>
              <td class="px-6 py-4">
                {{ moment(payment.createdAt).format('LLLL') }}
              </td>
            </tr>
          </template>
        </Table>
      </PaymentDetail>

      <PaymentDetail title="Envoi">
        <div class="flex flex-wrap justify-between my-4">
          <div class="w-full md:w-1/2">
            <div class="flex flex-wrap">
              <PaymentDetailLine title="Bénéficiaire" :content="payment.client_info.name" />
              <PaymentDetailLine title="Adresse" :content="payment.client_info.address" />
            </div>
          </div>
        </div>
      </PaymentDetail>
    </div>
  </div>
</template>
