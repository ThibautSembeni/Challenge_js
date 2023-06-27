<template>
  <div id="container">
    <div class="row" id="register-view">
      <div id="register-info" class="">
        <div class="ml-4">
          <h2>Lorem</h2>
        </div>
        <div class="mt-4">
          <CardInfo
            subtitle="Lorem ipsum dolor sit amet"
            text="Ad beatae cum eius eos excepturi facilis fuga incidunt laborum magnam non officia placeat quaerat, quia quis ratione"
          />
          <CardInfo
            subtitle="Lorem ipsum dolor sit amet"
            text="Ad beatae cum eius eos excepturi facilis fuga incidunt laborum magnam non officia placeat quaerat, quia quis ratione"
          />
          <CardInfo
            subtitle="Lorem ipsum dolor sit amet"
            text="Ad beatae cum eius eos excepturi facilis fuga incidunt laborum magnam non officia placeat quaerat, quia quis ratione"
          />
        </div>
      </div>
      <div id="register-form">
        <AuthForm :onSubmit="registerUser" :formData="formData">
          <template #title><h2>Connectez-vous à votre compte</h2></template>
          <template #inputs>
            <GenericInput
              label="E-mail"
              :validator="validateEmail"
              v-model="formData.email"
              type="email"
            />
            <GenericInput label="Nom complet" v-model="formData.username" type="text" />
            <CountriesInput v-model="formData.country"></CountriesInput>
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
        </AuthForm>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row > div {
  width: 50%;
  box-sizing: border-box;
}

#container {
  height: calc(100vh - 10%);
  padding-top: 3%;
  width: fit-content;
  border-left: 1px solid rgb(227, 232, 238);
  border-right: 1px solid rgb(227, 232, 238);
  margin-left: auto;
  margin-right: auto;
}

#register-info {
  margin-top: 5%;
  margin-right: 5%;
}

@media (max-width: 600px) {
  #register-info {
    display: none;
  }

  #register-form {
    width: 100%;
  }
}
</style>
<script setup>
import CardInfo from '@/components/CardInfo.vue'
import AuthForm from '@/components/AuthForm.vue'
import { reactive } from 'vue'
import GenericButton from '@/components/GenericButton.vue'
import GenericInput from '@/components/GenericInput.vue'
import CountriesInput from '@/components/CountriesInput.vue'

const defaultValue = {
  username: '',
  email: '',
  country: '',
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
