<template>
    <div class="w-full">
        <label for="cart" class="block text-sm font-medium text-gray-700">Produit</label>
        <textarea
                id="cart"
                name="cart"
                rows="3"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                v-model="cartText"
                @change="parseCart"
                placeholder="Produit 1 : 500 ; Produit 2 : 1000"
        ></textarea>
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

defineProps({
    type: Array,
    default: () => []
});

const emit = defineEmits(['update:modelValue']);

const cartText = ref('');

const parseCart = () => {
    const products = cartText.value.split(';').map(product => {
        const [name, price] = product.split(':').map(item => item.trim());
        return { name, price: parseFloat(price) };
    });
    emit('update:modelValue', products);
};

watchEffect(() => {
    parseCart();
});
</script>
