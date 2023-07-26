<script setup>
import NavBar from '@/components/NavBar.vue'
import TabPanel from '@/components/TabPanel.vue'
import { changePassword, getCurrentUser } from '@/services/auth'
import { reactive, ref } from 'vue'
import Input from '@/components/form/Input.vue'
import EditPasswordSection from '@/components/EditPasswordSection.vue'
import { updateUser } from '@/services/users'

const tabs = [
  { title: 'Détails', name: 'details' },
  { title: 'Mot de passe', name: 'security' },
]

const currentUser = getCurrentUser()

const isDisabled = ref(true)
const editMode = ref(false)
const userDetails = reactive({
  lastname: '',
  firstname: '',
  email: '',
  phone_number: null
})

if (currentUser) {
  Object.assign(userDetails, {
    lastname: currentUser.lastname,
    firstname: currentUser.firstname,
    email: currentUser.email,
    phone_number: currentUser.phone_number
  })
}

const editProfile = () => {
  isDisabled.value = !isDisabled.value
  editMode.value = !editMode.value
}

const validEdit = async () => {
  isDisabled.value = !isDisabled.value
  editMode.value = !editMode.value

  if (!userDetails.phone_number || userDetails.phone_number.length === 0) {
    delete userDetails.phone_number
  }
  try {
    await updateUser(currentUser.id, userDetails)
  } catch (e) {
    console.error(e)
  }
}

const sendRequest = async (payload) => {
  try {
    await changePassword(payload)
  } catch (error) {
    console.error(`Error lors de changement de votre mot de passe : ${error}`)
  }
}
</script>
<template>
  <div>
    <NavBar />
    <div class="p-4 lg:p-10">
      <h1 class="text-3xl font-bold">Mon compte</h1>
      <TabPanel :tabs="tabs" :is-vertical="true">
        <template #details>
          <template v-if="currentUser !== null">
            <div>
              <div class="flex items-center">
                <h2 class="text-2xl font-bold my-4">Informations personnelles</h2>
                <button
                  class="ml-4 px-3 py-2 text-xs font-medium inline-flex text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                  @click="editProfile"
                  v-if="editMode === false"
                >
                  Modifier mon profil
                </button>
                <button
                  class="ml-4 px-3 py-2 text-xs font-medium inline-flex text-white bg-green-700 rounded-lg hover:bg-green-800"
                  @click="validEdit"
                  v-if="editMode"
                >
                  Valider
                </button>
              </div>
              <div class="flex flex-row mb-4">
                <div class="flex-1 mr-2">
                  <Input
                    label="Nom"
                    :value="userDetails.lastname"
                    :disabled="isDisabled"
                    v-model="userDetails.lastname"
                  />
                </div>
                <div class="flex-1 ml-2">
                  <Input
                    label="Prénom"
                    :value="userDetails.firstname"
                    :disabled="isDisabled"
                    v-model="userDetails.firstname"
                  />
                </div>
              </div>
              <div class="flex flex-row mb-4">
                <div class="w-1/2 pr-2">
                  <Input
                    type="number"
                    label="Numéro de téléphone"
                    :value="userDetails.phone_number"
                    :disabled="isDisabled"
                    v-model="userDetails.phone_number"
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 class="text-2xl font-bold my-4">Adresse email</h2>
              <div class="flex flex-row mb-4">
                <div class="w-1/2 pr-2">
                  <Input
                    label="Email"
                    :value="userDetails.email"
                    :disabled="isDisabled"
                    v-model="userDetails.email"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-else>Chargement ...</template>
        </template>

        <template #security>
          <EditPasswordSection @passwordEvent="sendRequest" />
        </template>
      </TabPanel>
    </div>
  </div>
</template>

<style scoped></style>
