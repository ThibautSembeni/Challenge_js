<template>
  <span :class="paymentStatusClass" class="text-sm font-medium ml-2 px-2.5 py-0.5 rounded">
    {{ paymentStatusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    payment: {
        type: Object,
        required: true
    }
});

const paymentStatusClass = computed(() => {
    switch (props.payment.status) {
        case 'created':
            return 'bg-gray-100 text-gray-800';
        case 'captured':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        case 'waiting_refund':
        case 'partially_refunded':
            return 'bg-yellow-100 text-yellow-800';
        case 'refunded':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-red-100 text-red-800';
    }
});

const paymentStatusText = computed(() => {
    switch (props.payment.status) {
        case 'created':
            return 'En attente';
        case 'captured':
            return 'Capturée';
        case 'cancelled':
            return 'Annulé';
        case 'waiting_refund':
            return 'En attente de remboursement';
        case 'partially_refunded':
            return 'Remboursée partiellement';
        case 'refunded':
            return 'Refusée';
        default:
            return 'Échouée';
    }
});
</script>
