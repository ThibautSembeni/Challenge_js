<template>
  <div :class="'tabs flex ' + (isVertical ? 'flex-col' : 'flex-row')">
    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
      <ul
        :class="
          'tab-headers flex ' + (isVertical ? 'flex-row justify-around space-x-4' : 'flex-col')
        "
      >
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            'inline-block p-4 rounded-t-lg border-b-2',
            activeTab === index
              ? 'active text-blue-600 border-blue-600'
              : 'hover:text-gray-600 hover:border-gray-300 border-transparent'
          ]"
          @click="changeTab(index)"
        >
          {{ tab.title }}
        </li>
      </ul>
    </div>

    <div class="tab-content">
      <slot :name="tabs[activeTab].name"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  tabs: {
    type: Array,
    required: true
  },
  isVertical: {
    type: Boolean,
    default: false
  }
})

const activeTab = ref(0)

function changeTab(index) {
  activeTab.value = index
}
</script>

<style scoped></style>
