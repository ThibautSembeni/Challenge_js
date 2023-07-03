<script setup>
import CardInfo from '@/components/CardInfo.vue'
import { reactive } from 'vue'
import GenericButton from '@/components/GenericButton.vue'
import CountriesInput from '@/components/form/CountriesInput.vue'
import IconLogo from '@/components/icons/iconLogo.vue'

import Form from '@/components/form/Form.vue'
import Input from '@/components/form/Input.vue'
const defaultValue = {
  lastname: '',
  firstname: '',
  email: '',
  password: ''
}

const formData = reactive({ ...defaultValue })

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

async function registerUser(_user) {
  console.log('Go register', _user)
}
</script>
<template>
  <section class="auth">
    <template>
      <IconLogo />
    </template>
    <Form :onSubmit="registerUser" :formData="formData">
      <template #title><h2>Créez-vous un compte</h2></template>
      <template #inputs>
        <Input
          label="E-mail"
          :validator="validateEmail"
          v-model="formData.email"
          type="email"
          placeholder="johndoe@user.com"
          :required="true"
        />
        <Input label="Prénom" v-model="formData.firstname" type="text" :required="true" />
        <Input label="Nom" v-model="formData.lastname" type="text" :required="true" />
        <!-- <CountriesInput v-model="formData.country"></CountriesInput> -->
        <Input
          label="Password"
          :validator="validatePassword"
          v-model="formData.password"
          type="password"
          :required="true"
        />
      </template>
      <template #submit>
        <div class="column mt-4">
          <GenericButton
            :active="
              formData.username !== '' &&
              formData.email !== '' &&
              formData.country !== '' &&
              formData.password !== ''
            "
            color="primary"
            text="Créer un compte"
          />
        </div>
      </template>
    </Form>
    <p>Vous avez déjà un compte ? <router-link to="/login">Connectez-vous</router-link></p>
  </section>
</template>

<style scoped>
.auth {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}
@media (max-width: 600px) {
}
</style>
