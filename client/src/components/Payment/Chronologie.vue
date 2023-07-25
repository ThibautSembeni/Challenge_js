<template>
    <ol class="relative border-l border-gray-200 mt-4">
        <li v-for="(event, index) in data.timeline" :key="index" class="mb-7 ml-6">
            <span :class="getStatusClass(event.payload.status)">
                <i :class="getStatusIcon(event.payload.status)"></i>
            </span>
            <h3 class="mb-1">
                <span v-if="event.type.includes('Transaction')">
                    {{ getTransactionStatus(event.payload.status) }}
                </span>
                <span v-else>
                    {{ getOperationStatus(event.payload.status) }}
                    <span :class="getTypeClass(event.payload.type)">{{ getOperationsType(event.payload.type) }}</span>
                </span>
            </h3>
            <time class="block mb-2 text-sm font-normal leading-none text-gray-400">
                {{ moment(event.timestamp).format('LLLL') }}
            </time>
        </li>
    </ol>
</template>

<script setup>
import moment from 'moment';

const data = defineProps({
    timeline: {
        type: Array,
        required: true
    }
})

const getStatusIcon = (status) => {
    const statusMap = {
        'created': 'play',
        'captured': 'circle-check',
        'cancelled': 'xmark',
        'waiting_refund': 'hand-holding-dollar',
        'partially_refunded': 'circle-check',
        'refunded': 'hand-holding-dollar',
        'failed': 'xmark',
        'processing': 'hourglass-start',
        'done': 'check'
    };

    const colorMap = {
        'created': 'text-blue-500',
        'captured': 'text-green-500',
        'cancelled': 'text-orange-500',
        'waiting_refund': 'text-red-500',
        'partially_refunded': 'text-green-500',
        'refunded': 'text-green-500',
        'failed': 'text-red-500',
        'processing': 'text-yellow-500',
        'done': 'text-green-500'
    };

    return `fa-solid fa-${statusMap[status]} ${colorMap[status]}`;
};

const getStatusClass = (status) => {
    const statusMap = {
        'created': 'bg-blue-100',
        'captured': 'bg-green-100',
        'cancelled': 'bg-orange-100',
        'waiting_refund': 'bg-red-100',
        'partially_refunded': 'bg-green-100',
        'refunded': 'bg-green-100',
        'failed': 'bg-red-100',
        'processing': 'bg-yellow-100',
        'done': 'bg-green-100'
    };

    return `absolute flex items-center justify-center w-7 h-7 rounded-full -left-3 ${statusMap[status]}`;
};

const getTransactionStatus = (status) => {
    const statusMap = {
        'created': 'Transaction créée',
        'captured': 'Transaction réussie',
        'cancelled': 'Transaction annulée',
        'waiting_refund': 'Transaction en attente de remboursement',
        'partially_refunded': 'Transaction partiellement remboursée',
        'refunded': 'Transaction remboursée',
        'failed': 'Transaction échouée',
        'processing': 'Transaction en cours',
        'done': 'Transaction réussie'
    };

    return statusMap[status];
};

const getOperationStatus = (status) => {
    const statusMap = {
        'created': 'Opération créée',
        'processing': 'Opération en cours',
        'done': 'Opération réussie',
    };

    return statusMap[status];
};

const getOperationsType = (type) => {
    const typeMap = {
        'capture': 'Capture',
        'refund': 'Remboursement',
    };

    return typeMap[type];
};

const getTypeClass = (type) => {
    const typeMap = {
        'capture': 'bg-green-100 text-green-800',
        'refund': 'bg-red-100 text-red-800',
    };

    return `text-sm font-medium ml-2 px-2.5 py-0.5 rounded ${typeMap[type]}`;
};

</script>
