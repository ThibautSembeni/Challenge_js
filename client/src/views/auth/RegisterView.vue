<script setup>
import {reactive, ref, watch} from 'vue'
import GenericButton from '@/components/GenericButton.vue'
import IconLogo from '@/components/icons/iconLogo.vue'

import Form from '@/components/form/Form.vue'
import Input from '@/components/form/Input.vue'
import {registerUser} from "@/services/auth";

const defaultValue = {
  lastname: '',
  firstname: '',
  email: '',
  password: ''
}

const formData = reactive(
    defaultValue || {
      lastname: '',
      firstname: '',
      email: '',
      password: ''
    }
)

const requestError = ref('')
const infosMsg = ref('')

watch(defaultValue, (newInitialValues) => {
  Object.assign(formData, newInitialValues)
})

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)
  const message = isValid ? '' : 'Veuillez entrer une adresse email valide.'
  return {isValid, message}
}

const validatePassword = (value) => {
  const isValid = value.length >= 8
  const message = isValid ? '' : 'Le mot de passe doit avoir au moins 8 caractères.'
  return {isValid, message}
}

async function submitForm(_user) {
  if (requestError.value) requestError.value = ''
  console.log('Go register', _user)
  try {
    const response = await registerUser(_user)
    infosMsg.value = 'Un email de confirmation vous a été envoyé'
  } catch (error) {
    console.log(error)
    requestError.value = error.message
  }
}
</script>
<template>
  <section id="container-register-form" class="flex justify-center content-center items-center">
    <template>
      <IconLogo/>
    </template>
    <Form
        :onSubmit="submitForm"
        :formData="formData"
        :errorMsg="requestError"
        :infosMsg="infosMsg"
    >
      <template #title><h2 class="text-3xl font-extrabold mb-6">Créez-vous un compte</h2></template>
      <template #inputs>
        <Input
            label="E-mail"
            name="email"
            :validator="validateEmail"
            v-model="formData.email"
            type="email"
            placeholder="johndoe@user.com"
            :required="true"
        />
        <Input
            label="Prénom"
            name="firstname"
            v-model="formData.firstname"
            type="text"
            :required="true"
        />
        <Input
            label="Nom"
            name="lastname"
            v-model="formData.lastname"
            type="text"
            :required="true"
        />
        <!-- <CountriesInput v-model="formData.country"></CountriesInput> -->
        <Input
            label="Password"
            name="password"
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
      <template #footer>
        <p class="flex justify-center items-center">
          Vous avez déjà un compte ?
          <router-link
              :to="{ name: 'login' }"
              class="inline-flex items-center text-lg text-blue-600 hover:underline"
          >Connectez-vous
          </router-link
          >
        </p>
      </template>
    </Form>
  </section>
</template>

<style scoped>
#container-register-form {
  height: 100vh;
}
</style>
