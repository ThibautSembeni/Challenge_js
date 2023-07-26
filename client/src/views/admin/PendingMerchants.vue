<script setup>
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import {ref, onMounted, computed} from 'vue'
import {approveMerchant, declineMerchant, getPendingMerchants} from "@/services/merchants";
import Table from "@/components/Table.vue";
import Dropdown from "@/components/Dropdown.vue";
import Highlight from "@/components/form/Highlight.vue";

const users = ref([])

onMounted(async () => {
  try {
    users.value = await getPendingMerchants();
  } catch (error) {
    console.error(error);
  }
});

const searchQuery = ref('')

const filteredItems = computed(() => {
    if (!searchQuery.value) return users.value

    return users.value.filter(
        (user) =>
            (user.lastname
                ? user.lastname.toLowerCase().includes(searchQuery.value.toLowerCase())
                : false) ||
            (user.firstname
                ? user.firstname.toLowerCase().includes(searchQuery.value.toLowerCase())
                : false) ||
            (user.email ? user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) : false) ||
            (user.id
                ? user.id.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
                : false) ||
            (user.company ? user.company.toLowerCase().includes(searchQuery.value.toLowerCase()) : false)
    )
})

const approveRequest = async (userId) => {
    try {
        await approveMerchant(userId);
        users.value = await getPendingMerchants(); // refresh data
    } catch (error) {
        console.error(error);
    }
}

const declineRequest = async (userId) => {
    try {
        await declineMerchant(userId);
        users.value = await getPendingMerchants(); // refresh data
    } catch (error) {
        console.error(error);
    }
}


</script>

<template>
    <SideBar />
    <div class="sm:ml-64">
        <NavBar />
        <div class="p-4 lg:p-10">
            <div class="flex items-center">
                <h1 class="text-3xl font-bold mr-3">
                    <i class="fa-solid fa-user mr-2"></i> Demandes marchants
                </h1>
            </div>

            <div class="relative overflow-x-auto">
                <Table>
                    <template #thead>
                        <tr>
                            <th scope="col" class="px-6 py-3">ID</th>
                            <th scope="col" class="px-6 py-3">Nom</th>
                            <th scope="col" class="px-6 py-3">Email</th>
                            <th scope="col" class="px-6 py-3">Entreprise</th>
                            <th scope="col" class="px-6 py-3 text-center">Action</th>
                        </tr>
                    </template>
                    <template #tbody>
                        <tr class="bg-white border-b">
                            <td colspan="5" class="px-6 py-4">
                                <div class="flex flex-col">
                                    <div class="flex flex-row mb-1 sm:mb-0">
                                        <div class="relative">
                                            <input
                                                type="text"
                                                placeholder="Rechercher"
                                                class="w-full px-2 py-1 text-gray-800 bg-white border border-gray-200 rounded shadow-sm appearance-none sm:w-64 focus:outline-none"
                                                v-model="searchQuery"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr v-for="user in filteredItems" :key="user.id" class="bg-white border-b">
                            <td class="px-6 py-4">
                                <Highlight :text="user.id" :search="searchQuery" />
                            </td>
                            <td class="px-6 py-4 font-bold">
                                <span class="uppercase">
                                  <Highlight :text="user.firstname" :search="searchQuery" class="mr-1" />

                                  <Highlight :text="user.lastname" :search="searchQuery" />
                                </span>
                                <span v-if="user.role === 'merchant'" class="text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-4 bg-orange-200 text-orange-500">Marchant</span>
                            </td>
                            <td class="px-6 py-4">
                                <Highlight :text="user.email" :search="searchQuery" />
                            </td>
                            <td class="px-6 py-4">
                                <Highlight :text="user.company" :search="searchQuery" />
                            </td>
                            <td class="py-4 text-center">
                                <Dropdown
                                    :actions="[
                                      {
                                        label: 'Accepter',
                                        onClick: () => { approveRequest(user.id) }
                                      },
                                      {
                                        label: 'Refuser',
                                        onClick: () => { declineRequest(user.id) }
                                      }
                                    ]"
                                    :dropdownId="user.id"
                                />
                            </td>
                        </tr>

                        <tr class="bg-white border-b" v-if="!filteredItems.length">
                            <th colspan="5"
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center"
                            >
                                Aucune demande
                            </th>
                        </tr>
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>