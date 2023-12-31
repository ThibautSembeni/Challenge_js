<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import TabPanel from '@/components/TabPanel.vue'
import {changePassword, fetchUser, getCurrentUser} from '@/services/auth'
import {reactive, ref} from 'vue'
import Input from '@/components/form/Input.vue'
import EditPasswordSection from '@/components/EditPasswordSection.vue'
import {updateUser} from '@/services/users'
import {getCurrentCredentials, regenerateCredentials} from '@/services/credentials'
import CopyToClipboard from '@/components/CopyToClipboard.vue'
import store from '@/stores/store'
import {createDangerToast} from "@/utils/toasts";
import router from "@/router";

const currentUser = getCurrentUser()

const tabs = [
  {title: 'My details', name: 'details'},
  {title: 'Security', name: 'security'}
]

const currentCredentials = ref(getCurrentCredentials())

const isDisabled = ref(true)
const editMode = ref(false)
const regenerateMode = ref(false)
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

const cancelEdit = () => {
  isDisabled.value = !isDisabled.value
  editMode.value = !editMode.value
}

const validatePhone = (value) => {
  const isValid = !isNaN(Number(value)) && value.length === 10
  const message = isValid ? '' : 'Le numéro de téléphone doit contenir 10 chiffres'
  return {isValid, message}
}


const validEdit = async () => {


  if (!userDetails.phone_number || userDetails.phone_number.length === 0) {
    delete userDetails.phone_number
  }
  try {
    await updateUser(currentUser.id, userDetails)
    await fetchUser()
    router.go(0)
  } catch (e) {
    createDangerToast(e.message)
    console.error(e)
  }
}


const sendRequest = async (payload) => {
  try {
    await changePassword(payload)
  } catch (error) {
    createDangerToast(`Error lors de changement de votre mot de passe : ${error}`)
    console.error(`Error lors de changement de votre mot de passe : ${error}`)
  }
}

const confirmRegenerate = async () => {
  const newCredentials = await regenerateCredentials()
  store.commit('setCredentials', null)
  currentCredentials.value = newCredentials
  regenerateMode.value = false
}
</script>
<template>
  <SideBar v-if="currentUser.role !== 'customer'"/>
  <div :class="{ 'sm:ml-64': currentUser.role !== 'customer' }">
    <NavBar/>
    <div class="p-4 lg:p-10">
      <h1 class="text-3xl font-bold">My Account</h1>
      <TabPanel :tabs="tabs" :is-vertical="true">

        <template #details>
          <template v-if="currentUser !== null">
            <div>
              <div class="flex items-center">
                <h2 class="text-2xl font-bold my-4">Personnel Information</h2>
                <button
                    class="ml-4 px-3 py-2 text-xs font-medium inline-flex text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                    @click="editProfile"
                    v-if="editMode === false"
                >
                  Modifier mon Profile
                </button>
                <button
                    class="ml-4 px-3 py-2 text-xs font-medium inline-flex text-white bg-green-700 rounded-lg hover:bg-green-800"
                    @click="validEdit"
                    v-if="editMode"
                    :class="userDetails?.phone_number?.length === 0 ? 'cursor-not-allowed' : ''"
                    :disabled="userDetails?.phone_number?.length === 0 "
                >
                  Valider
                </button>

                <button
                    class="ml-4 px-3 py-2 text-xs font-medium inline-flex items-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                    @click="cancelEdit"
                    v-if="editMode"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
              </div>
              <div class="flex flex-row mb-4">
                <div class="flex-1 mr-2">
                  <Input
                      label="Lastname"
                      :value="userDetails.lastname"
                      :disabled="isDisabled"
                      v-model="userDetails.lastname"
                  />
                </div>
                <div class="flex-1 ml-2">
                  <Input
                      label="Firstname"
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
                      label="Phone Number"
                      :value="userDetails.phone_number"
                      :disabled="isDisabled"
                      v-model="userDetails.phone_number"
                      :validator="validatePhone"
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 class="text-2xl font-bold my-4">E-mail Address</h2>
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
            <div v-if="currentUser.role === 'merchant'">
              <h2 class="text-2xl font-bold my-4">Information Merchant</h2>
              <div class="flex flex-row mb-4">
                <div class="flex-1 mr-2">
                  <Input label="Kbis" :value="currentUser.kbis" :disabled="true"/>
                </div>
                <div class="flex-1 ml-2">
                  <Input label="Company" :value="currentUser.company" :disabled="true"/>
                </div>
              </div>
            </div>
          </template>
          <template v-else> is Loading ...</template>
        </template>

        <template #security>
          <EditPasswordSection @passwordEvent="sendRequest"/>

          <div v-if="currentUser.role === 'merchant'">
            <div class="flex items-center">
              <h2 class="text-2xl font-bold my-4">Credentials Merchant</h2>
              <button
                  class="ml-4 px-3 py-2 text-xs font-medium inline-flex text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                  v-if="regenerateMode === false"
                  @click="() => (regenerateMode = true)"
              >
                Regenerer votre credentials
              </button>
              <button
                  class="ml-4 px-3 py-2 text-xs font-medium inline-flex items-center rounded-lg bg-green-500 hover:bg-green-800 text-white"
                  v-if="regenerateMode === true"
                  @click="confirmRegenerate"
              >
                <i class="far fa-check-circle mr-2"></i>

                Confirmer
              </button>

              <button
                  class="ml-4 px-3 py-2 text-xs font-medium inline-flex items-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                  @click="() => (regenerateMode = false)"
                  v-if="regenerateMode === true"
              >
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
            <div class="flex flex-row mb-4">
              <div class="flex-1 mr-2">
                <CopyToClipboard label="Client Token" :text-to-copy="currentCredentials?.client_token"/>
              </div>
              <div class="flex-1 ml-2">
                <CopyToClipboard label="Client Secret" :text-to-copy="currentCredentials?.client_secret"/>
              </div>
            </div>
          </div>
        </template>
      </TabPanel>
    </div>
  </div>
</template>

<style scoped></style>
