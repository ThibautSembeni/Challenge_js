<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900">
            {{ label }}
        </label>
        <input v-if="type !== 'textarea'"
               :type="type"
               :value="modelValue"
               @input="$emit('update:modelValue', $event.target.value)"
               :id="id"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
               :placeholder="placeholder"
               :required="required">

        <textarea v-if="type === 'textarea'"
                  :value="modelValue"
                  @input="$emit('update:modelValue', $event.target.value)"
                  :id="id"
                  rows="8"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  :placeholder="placeholder"></textarea>

        <p class="text-red-500 text-xs mt-2" v-if="error">{{ error }}</p>
    </div>
</template>

<script setup>

defineProps({
    modelValue: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        required: false
    },
    required: {
        type: Boolean,
        required: false,
        default: false
    },
    error: {
        type: String,
        required: false
    }
})
</script>
