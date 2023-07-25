<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import store from "@/stores/store";
import router from "@/router";
import Form from "@/components/form/Form.vue";
import {reactive, ref} from "vue";
import Input from "@/components/form/Input.vue";
import GenericButton from "@/components/GenericButton.vue";
import httpClient from "@/services/httpClient";
import {verifyCredentials} from "@/services/credentials";

const defaultValue = {
  client_token: '',
  client_secret: '',
}
const formData = reactive(
    defaultValue || {
      client_token: '',
      client_secret: '',
    }
)
const requestError = ref('')
const infosMsg = ref('')

const validCredentials = async (_credentials) => {
  try {
    const credentials = await verifyCredentials(_credentials)
    store.commit('setCredentials', credentials)
    router.push(`/merchant`);
  } catch (error) {
    console.error(`error  : ${error}`)
    requestError.value = error
  }
}
</script>

<template>
  <SideBar/>
  <div class="sm:ml-64">
    <NavBar/>
    <h2>
      Dashboard Merchant
    </h2>
    <div class="column align-center ">


      <Form
          :onSubmit="validCredentials"
          :formData="formData"
          :errorMsg="requestError"
          :infosMsg="infosMsg"
      >
        <template #title><h2 class="text-3xl font-extrabold mb-6">Renseigner vos credentials</h2></template>
        <template #inputs>
          <Input
              label="Client Token"
              name="client_token"
              v-model="formData.client_token"
              type="text"
              required
          />
          <Input
              label="Client Secret"
              name="client_secret"
              v-model="formData.client_secret"
              type="text"
              required
          />
        </template>
        <template #submit>
          <div class="column mt-4">
            <GenericButton
                :active=" formData.client_token !== '' &&  formData.client_secret !== '' "
                color="primary"
                text="Créer un compte"
            />

          </div>
        </template>
      </Form>
    </div>

    <h3>
    </h3>
  </div>
</template>
