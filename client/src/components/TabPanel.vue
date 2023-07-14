<template>
  <div :class="'tabs flex ' + (isVertical ? 'flex-col' : 'flex-row')">
    <div :class="'tab-headers flex ' + (isVertical ? 'flex-row space-x-4' : 'flex-col')">
      <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-header', {'active': activeTab === index}]"
          @click="changeTab(index)"
      >
        {{ tab.title }}
      </div>
    </div>
    <div class="tab-content">

      <slot :name="tabs[activeTab].name"></slot>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

defineProps({
  tabs: {
    type: Array,
    required: true
  },
  isVertical: {
    type: Boolean,
    default: false
  }
});

const activeTab = ref(0);

function changeTab(index) {
  activeTab.value = index;
}
</script>


<style scoped>
.active {
  color: red;
}
</style>
