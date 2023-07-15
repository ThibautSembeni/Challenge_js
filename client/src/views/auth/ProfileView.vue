<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import TabPanel from '@/components/TabPanel.vue'
import {getCurrentUser} from '@/services/auth'
import {onMounted, reactive, ref} from 'vue'
import Input from '@/components/form/Input.vue'
import EditPasswordSection from "@/components/EditPasswordSection.vue";
import {updateUser} from "@/services/users";
import httpClient from "@/services/httpClient";

const tabs = [
  {title: 'My details', name: 'details'},
  {title: 'Security', name: 'security'},
  {title: 'My orders', name: 'orders'}
]

const currentUser = ref(null)
const isDisabled = ref(true)
const editMode = ref(false)
const userDetails = reactive({
  lastname: "",
  firstname: "",
  email: "",
  phone_number: null
});


onMounted(async () => {
  currentUser.value = await getCurrentUser()
  if (currentUser) {
    Object.assign(userDetails, {
      lastname: currentUser.value.lastname,
      firstname: currentUser.value.firstname,
      email: currentUser.value.email,
      phone_number: currentUser.value.phone_number
    });
  }
})

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
    const response = await updateUser(currentUser.value.id, userDetails)
    if (response) {
      currentUser.value = response
    }
  } catch (e) {
    console.error(e)
  }
}

const changePassword = async (payload) => {
  const response = await httpClient.post('/change-password', payload)
}

</script>
<template>
  <SideBar/>
  <div class="sm:ml-64">
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
                >
                  Valider
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

        <template #orders> orders</template>

        <template #security>
          <div>
            <EditPasswordSection @passwordEvent="changePassword"/>
          </div>
        </template>
      </TabPanel>
    </div>
  </div>
</template>

<style scoped></style>
