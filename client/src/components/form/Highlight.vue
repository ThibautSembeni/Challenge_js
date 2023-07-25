<template>
    <span v-html="highlightedText"></span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    text: {
        type: [String, Number],
        default: ''
    },
    search: {
        type: String,
        default: ''
    }
})

const highlightedText = computed(() => {
    if (!props.search.trim()) return props.text

    const text = props.text ? (typeof props.text === 'string' ? props.text : String(props.text)) : ''
    return text.replace(new RegExp(`(${props.search})`, 'gi'), '<mark>$1</mark>')
})
</script>

<style scoped>
mark {
    background-color: yellow;
}
</style>
