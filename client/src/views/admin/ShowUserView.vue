<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import { useRoute } from 'vue-router';
import {onMounted, ref} from "vue";
import httpClient from "@/services/httpClient";
import router from "../../router";
import GoBack from "@/components/GoBack.vue";
const route = useRoute();


const user = ref([]);
const loading = ref(true);

const {userId} = route.params
onMounted(async () => {
  try {
    const userData = await httpClient.get(`/users/${userId}`);
    user.value = userData.data
    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
});
</script>

<template>
  <SideBar/>
  <div className="sm:ml-64">
    <NavBar/>
    Hello Admin
    <br>
    <br>
    Show User View
    <br>
    <br>
    Pour show User <pre>{{user}}</pre>
    <br>
    <GoBack />
  </div>
</template>
