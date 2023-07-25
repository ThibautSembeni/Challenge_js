<script setup>
import {defineEmits, reactive, toRefs, watch} from 'vue';
import TextInput from '@/components/form/TextInput.vue';

const props = defineProps({
    modelValue: Object,
    error: Object
});

const emit = defineEmits(['update:modelValue'])

const state = reactive({
    address: '',
    city: '',
    postalCode: '',
    country: ''
});

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
        <h2 class="text-lg font-medium text-gray-900">Informations de livraison</h2>
        <div class="grid gap-4 mt-5">
            <div class="w-full">
                <TextInput
                        type="text"
                        v-model="address"
                        id="shipping_address"
                        label="Adresse"
                        placeholder="Entrez l'adresse de livraison"
                        :error="error.address"
                />
            </div>
            <div class="w-full">
                <TextInput
                        type="text"
                        v-model="city"
                        id="shipping_city"
                        label="Ville"
                        placeholder="Entrez la ville de livraison"
                        :error="error.city"
                />
            </div>
            <div class="w-full">
                <TextInput
                        type="text"
                        v-model="postalCode"
                        id="shipping_postalCode"
                        label="Code postal"
                        placeholder="Entrez le code postal de livraison"
                        :error="error.postalCode"
                />
            </div>
            <div class="w-full">
                <TextInput
                        type="text"
                        v-model="country"
                        id="shipping_country"
                        label="Pays"
                        placeholder="Entrez le pays de livraison"
                        :error="error.country"
                />
            </div>
        </div>
    </div>
</template>
