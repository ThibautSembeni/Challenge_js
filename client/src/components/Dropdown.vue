<template>
    <div class="relative">
        <button
            :id="dropdownId"
            @click="toggleDropdown"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            type="button">
            <i class="fa-solid fa-ellipsis"></i>
        </button>

        <div :id="dropdownId + 'Menu'"
             :class="{'hidden': !isOpen, 'z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-1': true, 'absolute': true}"
        >
            <ul class="py-2 text-sm" :aria-labelledby="dropdownId">
                <li v-for="action in actions" :key="action.label">
                    <button
                        :class="`block w-full text-left px-4 py-2 hover:bg-gray-100 ${action.textColor || textColor}`"
                        @click="action.onClick">
                        {{ action.label }}
                    </button>
                    <hr v-if="action.divider" class="my-2"/>
                </li>
            </ul>
        </div>

        <Modal :open="showModal" @update:open="showModal = $event">
            <p class="text-base leading-relaxed text-gray-500">
                Suppression. Êtes-vous sûr de vouloir continuer ?
            </p>
            <template #footer>
                <button @click="executeDelete" type="button" class="text-white bg-red-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Supprimer</button>
                <button @click="closeModal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:outline-none rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">Annuler</button>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from "@/components/ConfirmationDeleteModal.vue";

const data = defineProps({
    actions: {
        type: Array,
        required: true,
    },
    dropdownId: {
        type: Number,
        required: true,
    },
    textColor: {
        type: String,
        default: 'text-gray-700'
    }
});

const isOpen = ref(false);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const showModal = ref(false);

let deleteFunction = ref(null);

const openModal = (onDelete) => {
    deleteFunction.value = onDelete;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const executeDelete = () => {
    if (deleteFunction.value) {
        deleteFunction.value();
        showModal.value = false;
    }
};

const deleteAction = data.actions.find(action => action.label === 'Supprimer');
if (deleteAction) {
    deleteAction.onClick = () => openModal(deleteAction.onDelete);
}
</script>
