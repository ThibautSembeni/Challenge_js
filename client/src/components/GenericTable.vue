<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
});

const getItemValue = (item, key) => item[key];
const searchQuery = ref('');

const filteredItems = computed(() => {
  if (searchQuery.value === '') {
    return props.items;
  }

  return props.items.filter(item => {
    return item && props.columns.some(column => {
      const value = getItemValue(item, column.key);
      return (value || '').toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  });
});
</script>

<template>
  <div>
    <input type="text" v-model="searchQuery" placeholder="Rechercher"/>
    <table class="w-full text-sm text-left text-gray-500 my-3">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
      <tr>
        <th v-for="column in columns" :key="column.key">
          {{ column.label }}
        </th>
        <th v-if="showActions">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filteredItems" :key="item.id">
        <td v-for="column in columns" :key="column.key">
          {{ getItemValue(item, column.key) }}
        </td>
        <slot name="actions" :itemId="item.id"></slot>
      </tr>
      </tbody>
    </table>
  </div>
</template>
