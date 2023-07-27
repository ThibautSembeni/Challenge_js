<script setup>
import {reactive, toRefs, watch} from 'vue';
import TextInput from '@/components/form/TextInput.vue';

const props = defineProps({
    modelValue: Object,
    error: Object
});

const state = reactive({
    address: '',
    city: '',
    postalCode: '',
    country: ''
});

const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, (newVal) => {
    Object.assign(state, newVal);
}, { deep: true });

watch(() => state, (newVal) => {
    emit('update:modelValue', {...newVal});
}, { deep: true });


const { address, city, postalCode, country } = toRefs(state);
</script>

<template>
    <div>
        <h2 class="text-lg font-medium text-gray-900">Informations de facturation</h2>
        <div class="grid gap-4 mt-5">
            <div class="w-full">
                <TextInput
                        type="text"
                        v-model="address"
                        id="billing_address"
                        label="Adresse"
                        placeholder="Entrez l'adresse de facturation"
                        :error="error.address"
                />
            </div>
            <div class="w-full">
                <TextInput
                        type="text"
                        v-model="city"
                        id="billing_city"
                        label="Ville"
                        placeholder="Entrez la ville de facturation"
                        :error="error.city"
                />
            </div>
            <div class="w-full">
                <TextInput
                        type="text"
                        v-model="postalCode"
                        id="billing_postalCode"
                        label="Code postal"
                        placeholder="Entrez le code postal de facturation"
                        :error="error.postalCode"
                />
            </div>
            <div class="w-full">
                <TextInput
                        type="text"
                        v-model="country"
                        id="billing_country"
                        label="Pays"
                        placeholder="Entrez le pays de facturation"
                        :error="error.country"
                />
            </div>
        </div>
    </div>
</template>
