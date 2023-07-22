<script setup>
import {onMounted, reactive, ref, watch} from 'vue'
import GenericButton from '@/components/GenericButton.vue'
import Input from '@/components/form/Input.vue'
import Form from '@/components/form/Form.vue'
import {login} from '@/services/auth'
import httpClient from "@/services/httpClient";
import {useRoute} from "vue-router";

const {token} = useRoute().params
const defaultValue = {
  newPassword: '',
  confirmNewPassword: '',
}

const formData = reactive({...defaultValue})
const requestError = ref('')
const infosMsg = ref('')
const disabledInput = ref(false)

watch(formData, (value) => {
  if (value.newPassword !== '' && value.confirmNewPassword !== '' && value.confirmNewPassword !== value.newPassword) {
    requestError.value = 'Les password must be identique'
  } else if (value.confirmNewPassword === value.newPassword) {
    requestError.value = ''
  }
})

onMounted(async () => {
  const response = await httpClient.get(`/reset-password/${token}`)
  if (response.status !== 200) {
    requestError.value = 'Error, refaite votre demande'
    disabledInput.value = true
  }
})

const validatePassword = (value) => {
  const isValid = value.length >= 8
  const message = isValid ? '' : 'Le mot de passe doit avoir au moins 8 caractères.'
  return {isValid, message}
}

async function submitForm(payload) {
  const response = await httpClient.post(`/reset-password/${token}`, payload)
  if (response.status === 200){
    infosMsg.value = 'Votre password a été modifié'
  }
  console.log("pay", response)
}
</script>
<template>
  <div id="container-login-form" class="flex justify-center content-center items-center">
    <Form :formData="formData" :onSubmit="submitForm" :errorMsg="requestError" :infosMsg="infosMsg"
    >
      <template #title><h2 class="text-3xl font-extrabold mb-6">Reset your password</h2></template>
      <template #inputs>
        <Input
            label="Password"
            v-model="formData.newPassword"
            type="password"
            :required="true"
            :disabled="disabledInput"
            :validator="validatePassword"
        />
        <Input
            label="Confirm password"
            v-model="formData.confirmNewPassword"
            type="password"
            :required="true"
            :disabled="disabledInput"
            :validator="validatePassword"

        />
      </template>
      <template #submit>
        <div class="column mt-4">
          <GenericButton
              :active="formData.newPassword === formData.confirmNewPassword && formData.newPassword !== ''"
              color="primary"
              text="Modifier votre password"
          />
        </div>
      </template>
      <template #footer>
        <p class="text-center">
          Vous avez un compte ?
          <router-link
              :to="{ name: 'login' }"
              class="inline-flex items-center text-lg text-blue-600 hover:underline"
          > Connectez vous
          </router-link>
        </p>
      </template>
    </Form>
  </div>
</template>

<style scoped>
#container-login-form {
  height: 100vh;
}
</style>