<template>
    <ol class="relative border-l border-gray-200 mt-4">
        <li v-for="(event, index) in data.timeline" :key="index" class="mb-7 ml-6">
            <span :class="getStatusClass(event)">
                <i :class="getStatusIcon(event)"></i>
            </span>
            <h3 class="mb-1">
                <span v-if="event.type === 'Transaction'">
                    {{ getTransactionStatus(event.status) }}
                </span>
                <span v-else>
                    {{ getOperationStatus(event.status) }}
                    <span :class="getTypeClass(event.type_operation)">{{ getOperationsType(event.type_operation) }}</span>
                </span>
            </h3>
            <time class="block mb-2 text-sm font-normal leading-none text-gray-400">
                {{ moment(event.createdAt).format('LLLL') }}
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

const getStatusIcon = (event) => {
    const statusMap = {
        'created': 'play',
        'paid': 'circle-check',
        'canceled': 'xmark',
        'refund': 'hand-holding-dollar',
        'processing': 'hourglass-start',
        'done': 'check'
    };

    const colorMap = {
        'created': 'text-blue-600',
        'paid': 'text-green-600',
        'canceled': 'text-orange-600',
        'refund': 'text-red-600',
        'processing': 'text-yellow-600',
        'done': 'text-green-600'
    };

    return `fa-solid fa-${statusMap[event.status]} ${colorMap[event.status]}`;
};

const getStatusClass = (event) => {
    const statusMap = {
        'created': 'bg-blue-200',
        'paid': 'bg-green-200',
        'canceled': 'bg-orange-200',
        'refund': 'bg-red-200',
        'processing': 'bg-yellow-200',
        'done': 'bg-green-200'
    };

    return `absolute flex items-center justify-center w-7 h-7 rounded-full -left-3 ${statusMap[event.status]}`;
};

const getTransactionStatus = (status) => {
    const statusMap = {
        'created': 'Paiement créé',
        'paid': 'Paiement réussi',
        'canceled': 'Paiement annulé',
        'refund': 'Paiement remboursé',
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
