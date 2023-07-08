<script setup>
import { reactive, ref } from 'vue'
import router from '@/router'
import GenericButton from '@/components/GenericButton.vue'
import Input from '@/components/form/Input.vue'
import Form from '@/components/form/Form.vue'

const defaultValue = {
  email: '',
  password: ''
}
const formData = reactive({ ...defaultValue })
const requestError = ref('')

async function loginUser(_user) {
  if (requestError.value) requestError.value = ''
  console.log('hello my user', _user)
  const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(_user)
  })
  if (response.status === 422) {
    return Promise.reject(await response.json())
  } else if (response.status === 401) {
    requestError.value = `Le mot de passe ou l'adresse email ne sont pas corrects`
  } else if (response.ok) {
    const data = await response.json()
    localStorage.setItem('access_token', data.token)
    router.push({ path: '/', replace: true })
  }
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)
  const message = isValid ? '' : 'Veuillez entrer une adresse email valide.'
  return { isValid, message }
}
</script>
<template>
  <div id="container-login-form" class="flex justify-center content-center items-center">
    <Form :formData="formData" :onSubmit="loginUser" :errorMsg="requestError">
      <template #title
        ><h2 class="text-3xl font-extrabold mb-6">Connectez-vous à votre compte</h2></template
      >
      <template #inputs>
        <Input
          label="E-mail"
          :validator="validateEmail"
          v-model="formData.email"
          type="email"
          :required="true"
        />
        <Input label="Password" v-model="formData.password" type="password" :required="true" />
      </template>
      <template #submit>
        <div class="column mt-4">
          <GenericButton
            :active="formData.password !== '' && formData.email !== ''"
            color="primary"
            text="Se connecter"
          />
        </div>
      </template>
      <template #footer
        ><p>
          Vous n'avez pas encore de compte ?
          <router-link
            :to="{ name: 'register' }"
            class="inline-flex items-center text-lg text-blue-600 hover:underline"
            >Créez-vous en un !</router-link
          >
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
