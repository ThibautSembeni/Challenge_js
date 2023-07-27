<script setup>
import {reactive, toRefs, watch} from 'vue'
import TextInput from '@/components/form/TextInput.vue'

const props = defineProps({
    modelValue: Object,
    error: Object
})

const state = reactive({
    name: '',
    email: '',
    phoneNumber: ''
})

const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, (newVal) => {
    Object.assign(state, newVal);
}, { deep: true });

watch(() => state, (newVal) => {
    emit('update:modelValue', {...newVal});
}, { deep: true });

const {name, email, phoneNumber} = toRefs(state)
</script>

<template>
    <div>
        <h2 class="text-lg font-medium text-gray-900">Informations du client</h2>
        <div class="grid gap-4 mt-5">
            <div class="w-full">
                <TextInput
                    type="text"
                    v-model="name"
                    id="client_name"
                    label="Nom"
                    placeholder="Entrez le nom du client"
                    :error="error.name"
                />
            </div>
            <div class="w-full">
                <TextInput
                    type="email"
                    v-model="email"
                    id="client_email"
                    label="Email"
                    placeholder="Entrez l'email du client"
                    :error="error.email"
                />
            </div>
            <div class="w-full">
                <TextInput
                    type="tel"
                    v-model="phoneNumber"
                    id="client_phoneNumber"
                    label="Numéro de téléphone"
                    placeholder="Entrez le numéro de téléphone du client"
                    :error="error.phoneNumber"
                />
            </div>
        </div>
    </div>
</template>
