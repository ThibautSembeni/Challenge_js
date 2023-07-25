<script setup>
import { ref } from 'vue'

const openModal = ref(false)
</script>
<template>
  <slot name="activator" :openModal="() => (openModal = true)"
    ><button @click="openModal = true">Open Modal</button></slot
  >
  <div v-show="openModal" class="modal">
    <div class="backdrop" @click.self="openModal = false"></div>
    <div class="modal-box">
      <div class="modal-title"><slot name="title">Modal title</slot></div>
      <div class="modal-content"><slot>Modal content</slot></div>
      <div class="modal-actions">
        <slot name="actions" :closeModal="() => (openModal = false)"
          ><button @click="openModal = false">Close</button></slot
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  color: yellow;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-box {
  position: absolute;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: pink;

  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.modal-title {
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}
.modal-content {
  padding: 1rem;
}
.modal-actions {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style>
