<template>
    <div v-if="open" id="staticModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="relative bg-white rounded-lg shadow w-full max-w-md mx-auto">
            <div class="flex items-start justify-between p-4 border-b">
                <h3 class="text-xl font-semibold text-gray-900">Confirmation de suppression</h3>
                <button @click="closeModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 ml-auto inline-flex justify-center items-center">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
            <div class="p-6 space-y-6">
                <slot></slot>
            </div>
            <div class="flex items-center p-6 space-x-2 border-t">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>

defineProps({
    open: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:open']);
const closeModal = () => emit('update:open', false);
</script>
