<script setup>

import { reactive, computed, toRefs } from 'vue';
import '../assets/index.css';
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import TextInput from "@/components/form/TextInput.vue";

const formData = reactive({
    name: '',
    flashMessage: null,
    transaction: null,
});

const errors = reactive({
    name: null,
});

const validateField = (field, errorCondition, errorMessage) => {
    errors[field] = errorCondition ? null : errorMessage;
}

const isFormValid = computed(() => {
    validateField('name', formData.name.length >= 2, 'Le nom doit contenir au moins 2 caractères');

    return !Object.values(errors).some(error => error !== null);
});

const resetForm = () => {
    formData.name = '';
}

const submitForm = async () => {
    if (!isFormValid.value) return;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });

    if (response.ok) {
        const result = await response.json();

        if (result && result.reference) {
            formData.flashMessage = `La transaction ${result.name} a été créée avec succès. Cliquez ici pour le voir.`;
            formData.transaction = result;
        }

        resetForm();
    } else {
        console.error('Erreur lors de l\'envoi du formulaire');
    }
}

const { name, flashMessage, transaction } = toRefs(formData);

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
                <h1 class="text-3xl font-bold mr-3"><i class="fa-solid fa-boxes-stacked mr-2"></i> Création d'une transaction</h1>
            </div>

            <section>
                <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 mb-6 shadow-md" v-if="transaction">
                        <div class="flex">
                            <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                            <div>
                                <p class="font-bold">Transaction correctement ajoutée !</p>
                                <router-link :to="{name: 'paymentDetail', params: { 'reference': transaction.reference }}" class="text-sm">{{ flashMessage }}</router-link>
                            </div>
                        </div>
                    </div>
                    <p class="mb-4 text-xl font-bold text-gray-900">Ajouter une transaction</p>
                    <form @submit.prevent="submitForm">
                        <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div class="sm:col-span-2">
                                <TextInput type="text" v-model="formData.name" id="name" label="Nom de produit" placeholder="Chaussette" :error="errors.name" />
                            </div>
                        </div>
                        <button type="submit" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800">
                            Ajouter
                        </button>
                    </form>
                </div>
            </section>
        </div>
    </div>
</template>