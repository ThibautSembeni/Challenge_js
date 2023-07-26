<template>
  <div>
    <label>{{label}}</label>
    <div class="flex flex-row input">
      <input class="w-full" :value="textToCopy" disabled />
      <button @click="copyText">
        <i class="far fa-copy"></i>
      </button>
    </div>
    <div v-if="showMessage">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['label','textToCopy']);
const showMessage = ref(false);
const message = ref('');

const copyText = () => {
  const inputElement = document.createElement('input');
  inputElement.value = props.textToCopy;
  document.body.appendChild(inputElement);
  inputElement.select();
  document.execCommand('copy');
  document.body.removeChild(inputElement);

  showMessage.value = true;
  message.value = 'Texte copié dans le presse-papiers!';
  setTimeout(() => {
    showMessage.value = false;
  }, 2000);
};
</script>

<style scoped>

.input{
  box-sizing: border-box;
  border: unset;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(60, 66, 87, 0.16),
  0 2px 5px rgba(60, 66, 87, 0.08);
  border-radius: 5px;
  padding: 10px;
}
label {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}
</style>
