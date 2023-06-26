<template>
  <div id="container-login">
    <AuthForm :formData="formData" :onSubmit="loginUser">
      <template #title><h2>Connectez-vous à votre compte</h2></template>
      <template #inputs>
        <GenericInput
          label="E-mail"
          :validator="validateEmail"
          v-model="formData.email"
          type="email"
        />
        <GenericInput
          label="Password"
          :validator="validatePassword"
          v-model="formData.password"
          type="password"
        />
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
    </AuthForm>
  </div>
</template>

<style scoped>
#container-login {
  width: 35%;
  margin: auto;
  padding-top: 10%;
}

@media (max-width: 1024px) {
  #container-login {
    width: 80%;
    padding-top: 10%;
  }
}
</style>
<script setup>
import AuthForm from '@/components/AuthForm.vue'
import { reactive } from 'vue'
import GenericInput from '@/components/GenericInput.vue'
import GenericButton from '@/components/GenericButton.vue'

const defaultValue = {
  email: '',
  password: ''
}
const formData = reactive({ ...defaultValue })

async function loginUser(_user) {
  console.log('hello my user', _user)
  /*  const response = await fetch(`http://localhost:3000/login`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(_user)
    })
    if (response.status === 422) {
      return Promise.reject(await response.json())
    } else if (response.ok) {
      const data = await response.json()
      const token = data.token
      user.value = jwtDecode(token)
      localStorage.setItem('token', token)
      return Promise.resolve(data)
    }
    throw new Error('Fetch failed')*/
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)
  const message = isValid ? '' : 'Veuillez entrer une adresse email valide.'
  return { isValid, message }
}
const validatePassword = (value) => {
  const isValid = value.length >= 8
  const message = isValid ? '' : 'Le mot de passe doit avoir au moins 8 caractères.'
  return { isValid, message }
}
</script>
