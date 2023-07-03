<template>
    <span>{{ formatEuro(price, currency) }}</span>
</template>

<script setup>
defineProps({
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
})

const formatEuro = (value, currency) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency }).format(value)
}
</script>