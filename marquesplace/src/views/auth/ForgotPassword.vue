<script setup>
import {reactive, ref} from 'vue'
import router from '@/router'
import GenericButton from '@/components/GenericButton.vue'
import Input from '@/components/form/Input.vue'
import Form from '@/components/form/Form.vue'
import {fetchUser, forgotPassword, login} from '@/services/auth'

const defaultValue = {
  email: ''
}

const formData = reactive({...defaultValue})
const requestError = ref('')
const infosMsg = ref('')

async function submitForm(payload) {
  if (requestError.value) requestError.value = ''
    await forgotPassword(payload)
    infosMsg.value = 'Vous allez recevoir votre mail de renitialisation '
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)
  const message = isValid ? '' : 'Veuillez entrer une adresse email valide.'
  return {isValid, message}
}
</script>
<template>
  <div id="container-login-form" class="flex justify-center content-center items-center">
    <Form :formData="formData" :onSubmit="submitForm" :errorMsg="requestError"         :infosMsg="infosMsg"
    >
      <template #title><h2 class="text-3xl font-extrabold mb-6">Demander votre password</h2></template>
      <template #inputs>
        <Input
            label="E-mail"
            :validator="validateEmail"
            v-model="formData.email"
            type="email"
            :required="true"
        />
      </template>
      <template #submit>
        <div class="column mt-4">
          <GenericButton
              :active="formData.email !== ''"
              color="primary"
              text="Demander votre password"
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