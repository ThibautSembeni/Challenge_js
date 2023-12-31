<script setup>
import { reactive, computed, toRefs } from 'vue'
import { createTransaction } from '@/services/transactions'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import TextInput from '@/components/form/TextInput.vue'
import SelectInput from '@/components/form/SelectInput.vue'
import ClientInfo from "@/components/Payment/ClientInfo.vue"
import BillingInfo from "@/components/Payment/BillingInfo.vue"
import ShippingInfo from "@/components/Payment/ShippingInfo.vue"
import Cart from "@/components/Payment/Cart.vue"

const formData = reactive({
    client_info: {},
    billing_info: {},
    shipping_info: {},
    cart: {},
    amount: '',
    currency: '',
    status: 'created',
})

const returnData = reactive({
    flashMessage: null,
    transaction: null
})

const errors = reactive({
    client_info: {
        name: null,
        email: null,
        phoneNumber: null
    },
    billing_info: {
        address: null,
        city: null,
        country: null,
        postalCode: null
    },
    shipping_info: {
        address: null,
        city: null,
        country: null,
        postalCode: null
    },
    amount: null,
    currency: null
})

const { client_info, billing_info, shipping_info, currency, cart, status, amount } = toRefs(formData)
const { flashMessage, transaction } = toRefs(returnData)

const validateField = (objectKey, fieldKey, errorCondition, errorMessage) => {
    if (objectKey) errors[objectKey][fieldKey] = (errorCondition || formData[objectKey][fieldKey] === "") ? errorMessage : null
    else errors[fieldKey] = (errorCondition || formData[fieldKey] === "") ? errorMessage : null
}

const isFormValid = computed(() => {
    validateField('client_info', 'name', formData.client_info.name == null, 'Le nom du client est obligatoire')
    validateField('client_info', 'email', formData.client_info.email == null, 'L email du client est obligatoire')
    validateField('client_info', 'phoneNumber', formData.client_info.phoneNumber == null, 'Le numéro de téléphone du client est obligatoire')

    validateField('billing_info', 'address', formData.billing_info.address == null, 'L adresse de facturation est obligatoire')
    validateField('billing_info', 'city', formData.billing_info.city == null, 'La ville de facturation est obligatoire')
    validateField('billing_info', 'country', formData.billing_info.country == null, 'Le pays de facturation est obligatoire')
    validateField('billing_info', 'postalCode', formData.billing_info.postalCode == null, 'Le code postal de facturation est obligatoire')

    validateField('shipping_info', 'address', formData.shipping_info.address == null, 'L adresse de livraison est obligatoire')
    validateField('shipping_info', 'city', formData.shipping_info.city == null, 'La ville de livraison est obligatoire')
    validateField('shipping_info', 'country', formData.shipping_info.country == null, 'Le pays de livraison est obligatoire')
    validateField('shipping_info', 'postalCode', formData.shipping_info.postalCode == null, 'Le code postal de livraison est obligatoire')

    validateField('', 'currency', (formData.currency == null || formData.currency.length < 2), 'La devise est obligatoire')

    for (let key in errors) {
        if (typeof errors[key] === 'string' && errors[key] !== null) return false
        else if (typeof errors[key] === 'object')
            for (let subKey in errors[key])
                if (errors[key][subKey] !== null) return false
    }

    return true
})

const resetForm = () => {
    formData.client_info = {}
    formData.billing_info = {}
    formData.shipping_info = {}
    formData.cart = {}
    formData.amount = ''
    formData.currency = ''
    formData.status = 'created'
}

const copyShippingToBilling = () => {
    formData.billing_info = { ...formData.shipping_info }
}

const submitForm = async () => {
    if (!isFormValid.value) return

    const result = await createTransaction(formData)

    if (result && result.reference) {
        returnData.flashMessage = `La transaction ${result.reference} a été créée avec succès. Cliquez ici pour la voir.`
        returnData.transaction = result

        resetForm()

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}
</script>

<template>
    <SideBar />

    <div class="sm:ml-64">
        <NavBar />
        <div class="p-4 lg:p-10">
            <div class="md:flex md:flex-wrap md:justify-between font-light text-sm text-gray-400 mb-6">
                <div class="flex flex-wrap items-center">
                    <router-link
                        :to="{ name: 'payments' }"
                        class="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
                    ><i class="fa-solid fa-chevron-left mr-2"></i> Retour</router-link>
                    <h1 class="uppercase"><i class="fa-solid fa-boxes-stacked mr-2"></i> Transaction</h1>
                </div>
            </div>

            <div class="flex items-center">
                <h1 class="text-3xl font-bold mr-3">
                    <i class="fa-solid fa-boxes-stacked mr-2"></i> Création d'une transaction
                </h1>
            </div>

            <section>
                <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 mb-6 shadow-md"
                         v-if="transaction"
                    >
                        <div class="flex">
                            <div class="py-1">
                                <svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="font-bold">Transaction correctement ajoutée !</p>
                                <router-link
                                    :to="{ name: 'paymentDetail', params: { reference: transaction.reference } }"
                                    class="text-sm"
                                >{{ flashMessage }}</router-link
                                >
                            </div>
                        </div>
                    </div>
                    <p class="mb-4 text-xl font-bold text-gray-900">Ajouter une transaction</p>
                    <form @submit.prevent="submitForm">
                        <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div class="w-full">
                                <TextInput
                                    type="number"
                                    v-model="amount"
                                    id="amount"
                                    label="Montant"
                                    placeholder="1000"
                                    :error="errors.amount"
                                />
                            </div>
                            <div class="w-full">
                                <TextInput
                                    type="text"
                                    v-model="currency"
                                    id="currency"
                                    label="Devise"
                                    placeholder="EUR"
                                    :error="errors.currency"
                                />
                            </div>
                            <div class="sm:col-span-2">
                                <SelectInput
                                    :options="[
                                        { value: 'created', label: 'En attente' },
                                        { value: 'captured', label: 'Capturée' },
                                        { value: 'cancelled', label: 'Annulé' },
                                        { value: 'waiting_refund', label: 'En attente de remboursement' },
                                        { value: 'partially_refunded', label: 'Remboursée partiellement' },
                                        { value: 'refunded', label: 'Remboursée' },
                                        { value: 'failed', label: 'Échouée' }
                                      ]"
                                    v-model="status"
                                    id="status"
                                    label="Statut"
                                />
                            </div>

                            <div class="sm:col-span-2">
                                <ClientInfo v-model="client_info" :error="errors.client_info" />
                            </div>
                            <div class="w-full">
                                <ShippingInfo v-model="shipping_info" :error="errors.shipping_info" />
                            </div>
                            <div class="w-full">
                                <BillingInfo v-model="billing_info" :error="errors.billing_info" />
                            </div>

                            <div class="sm:col-span-2 text-center">
                                <button type="button"
                                        class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        @click="copyShippingToBilling">
                                    Copier les informations de livraison vers la facturation
                                </button>
                            </div>

                            <div class="sm:col-span-2">
                                <Cart v-model="cart" />
                            </div>
                        </div>
                        <div class="pt-5">
                            <div class="flex justify-end">
                                <button
                                    type="submit"
                                    class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Ajouter la transaction
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    </div>
</template>
