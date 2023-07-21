<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import {useRoute} from 'vue-router';
import {onMounted, ref} from "vue";
import GoBack from "@/components/GoBack.vue";
import {getUserById} from "@/services/users";

const route = useRoute();


const user = ref(null);

const {userId} = route.params
onMounted(async () => {
  try {
    user.value = await getUserById(userId)
  } catch (error) {
    console.error(error);
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
    Pour show User
    <pre>{{ user }}</pre>
    <br>
    <GoBack/>
  </div>
</template>