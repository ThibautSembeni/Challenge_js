<script setup>
import {verifyAccount} from "@/services/auth";
import {useRoute} from "vue-router";
import router from "@/router";
import {onMounted} from "vue";
import FinishDemand from "@/components/profile/FinishDemand.vue";
import NavBar from "@/components/NavBar.vue";
import TabPanel from "@/components/TabPanel.vue";
import {updateDemandMerchantService} from "@/services/merchants";

const token = useRoute()?.params?.token

const tabs = [
  {title: 'Completer votre demande', name: 'finish_demand'},
]
onMounted(async ()=>{
  if (token) {
    try {
      await verifyAccount(token)
    } catch (e) {
      console.error(e)
    }
  }
})
const finishEvent = async (payload) => {
  try {
    await updateDemandMerchantService(token, payload)
    await router.push('/pending-verification')
  } catch (error) {
    console.error(`Error : ${error}`)
  }
}
</script>
<template>
    <NavBar/>
  <div class="pl-8">
    <div class="p-4 lg:p-10">
      <h1 class="text-3xl font-bold">My Account</h1>
      <TabPanel :tabs="tabs" :is-vertical="true">
        <template #finish_demand>
          <FinishDemand @finishEvent="finishEvent"/>
        </template>
      </TabPanel>
    </div>
  </div>
</template>

