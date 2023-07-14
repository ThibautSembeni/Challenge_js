<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import httpClient from "@/services/httpClient";
import {ref, onMounted} from 'vue';
import GenericTable from "@/components/GenericTable.vue";
import router from "@/router";

const users = ref([]);
const loading = ref(true);

const tableColumns = [
  {key: "id", label: "ID"},
  {key: "lastname", label: "Lastname"},
  {key: "firstname", label: "Firstname"},
  {key: "email", label: "Email"},
  {key: "role", label: "Role"}
];
onMounted(async () => {
  try {
    const userData = await httpClient.get('/users');
    users.value = userData.data
    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
});
const showUser = (userId) =>{
  router.push(`users/${userId}`);
}

const editUser = (userId) =>{
  router.push(`edit/${userId}`);
}
</script>

<template>
  <SideBar/>
  <div class="sm:ml-64">
    <NavBar/>
    Hello Admin
    <GenericTable :items="users" :columns="tableColumns" :show-actions="true">
      <template #actions="{ itemId }">
        <button @click="showUser(itemId)">Afficher</button>
        <button @click="editUser(itemId)">Modifier</button>
      </template>
    </GenericTable>
    <RouterLink to="/admin/users/pending">Pour voir les demandes pour devenir marchand</RouterLink>
  </div>
</template>
