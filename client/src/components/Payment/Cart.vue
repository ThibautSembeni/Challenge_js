<template>
    <div class="w-full">
        <label for="cart" class="block text-sm font-medium text-gray-700">Produit</label>
        <textarea
            id="cart"
            name="cart"
            rows="3"
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
            v-model="state.cartText"
            @change="parseCart"
            placeholder="Produit 1 : 500 ; Produit 2 : 1000"
        ></textarea>
    </div>
</template>

<script setup>
import {watch, reactive} from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {}
    }
});

const emit = defineEmits(['update:modelValue']);

let state = reactive({
    cartText: '',
    products: []
});

const parseCart = () => {
    state.products = state.cartText.split(';').map(product => {
        const [name, price] = product.split(':').map(item => item.trim());
        return { name, price: parseFloat(price) };
    });
    emit('update:modelValue', state.products);
};

watch(() => props.modelValue, (newVal) => {
    Object.assign(state, newVal);
    if (Array.isArray(newVal)) {
        state.cartText = newVal.map(product => `${product.name} : ${product.price}`).join(' ; ');
    }
}, { deep: true });

watch(() => state, (newVal) => {
    emit('update:modelValue', {...newVal});
}, { deep: true });
</script>
