<script setup>
import {reactive, ref} from 'vue'
import router from '@/router'
import GenericButton from '@/components/GenericButton.vue'
import Input from '@/components/form/Input.vue'
import Form from '@/components/form/Form.vue'
import {fetchUser, login, getImperonating} from '@/services/auth'
import {createDangerToast} from "@/utils/toasts";

const defaultValue = {
  email: '',
  password: ''
}

const formData = reactive({...defaultValue})
const requestError = ref('')

async function loginUser(_user) {
  if (requestError.value) requestError.value = ''
  try {
    await login(_user)
    const currentUser = await fetchUser()
    if (currentUser?.role === 'merchant' && currentUser?.status === 'created') {
      await router.push({path: '/profile', replace: true})
      return
    }
    await getImperonating()

    switch (currentUser.role) {
      case 'admin':
        router.push({path: '/admin', replace: true})
        break
      case 'merchant':
        router.push({path: '/', replace: true})
        break
      default:
        break
    }
  } catch (error) {
    createDangerToast(error.message)
  }
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
        <Input label="Password" v-model="formData.password" type="password" :required="true"/>
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
      <template #footer>
        <p>
          Vous n'avez pas encore de compte ?
          <router-link
              :to="{ name: 'register' }"
              class="inline-flex items-center text-lg text-blue-600 hover:underline"
          >Créez-vous en un !
          </router-link>
        </p>
        <p>
          <router-link
              :to="{ name: 'forgotPassword' }"
              class="inline-flex items-center text-lg text-blue-600 hover:underline"
          >Demander un nouveau password
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
