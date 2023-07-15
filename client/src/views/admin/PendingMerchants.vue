<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import httpClient from '@/services/httpClient'
import { ref, onMounted } from 'vue'
import GenericTable from '@/components/GenericTable.vue'
import router from '@/router'
import { getAllUsers } from "@/services/users";
import { approveMerchant, declineMerchant, getPendingMerchants } from "@/services/merchants";

const users = ref([])

const tableColumns = [
	{ key: 'id', label: 'ID' },
	{ key: 'lastname', label: 'Lastname' },
	{ key: 'firstname', label: 'Firstname' },
	{ key: 'email', label: 'Email' },
	{ key: 'role', label: 'Role' }
]

onMounted(async () => {
	try {
		users.value = await getPendingMerchants();
	} catch (error) {
		console.error(error);
	}
});

const showUser = (userId) => {
	router.push(`${userId}`)
}

const approveRequest = async (userId) => {
	try {
		await approveMerchant(userId);
	} catch (error) {
		console.error(error);
	}
}

const declineRequestRequest = async (userId) => {
	try {
		await declineMerchant(userId);
	} catch (error) {
		console.error(error);
	}
}

</script>

<template>
	<SideBar/>
	<div class="sm:ml-64">
		<NavBar/>
		Hello Admin Pending Request to be a merchant
		<GenericTable :items="users" :columns="tableColumns" :show-actions="true">
			<template #actions="{ itemId }">
				<button @click="showUser(itemId)">Show</button>
				<button @click="approveRequest(itemId)">Approve</button>
				<button @click="declineRequestRequest(itemId)">Decline</button>
			</template>
		</GenericTable>
		<RouterLink to="/admin/users">Pour voir les userss</RouterLink>
	</div>
</template>
