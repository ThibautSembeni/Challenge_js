<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getCurrentUser } from '../../services/auth'
import NavBar from '../../components/NavBar.vue'

const cartItems = reactive([])
const customerFacturationAddress = ref('')
const customerDeliveryAddress = ref('')

const currentUser = getCurrentUser()
const user = currentUser.id

const total = computed(() => {
  return cartItems.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0)
})

const removeItem = async (cartItem) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/cart/remove/${cartItem.cart_id}/${
        cartItem.product.reference
      }`,
      {
        method: 'DELETE'
      }
    )
    if (response.status === 204) {
      cartItems.filter((item) => item.id !== cartItem.id)
    } else {
      const data = await response.json()
      console.error('Error removing item:', data.error)
    }
  } catch (error) {
    console.error('Error removing item:', error)
  }
}

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/user/${user}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    })
    const data = await response.json()
    cartItems.push(...data[0].cart_items)
  } catch (error) {
    console.error('Error fetching cart items:', error)
  }
})
</script>

<template>
  <NavBar />
  <main class="container mx-auto p-12">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-semibold">Mon Panier</h2>
      <span class="text-base text-gray-600">Les articles seront réservés pendant 30 minutes</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full table-auto border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2">Produit</th>
            <th class="px-4 py-2">Prix</th>
            <th class="px-4 py-2">Quantité</th>
            <th class="px-4 py-2">Suppression</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cartItem in cartItems" :key="cartItem.id" class="bg-white">
            <td class="border px-4 py-2 flex items-center">
              <div>
                {{ cartItem.product.name }}<br />
                <span class="text-gray-600 text-sm">{{ cartItem.product.description }}</span>
              </div>
            </td>
            <td class="border px-4 py-2">{{ cartItem.price }}€</td>
            <td class="border px-4 py-2">{{ cartItem.quantity }}</td>
            <td class="border px-4 py-2">
              <button
                @click="removeItem(cartItem)"
                class="bg-red-500 text-white px-4 py-2 rounded flex items-center"
              >
                Supprimer
                <i class="ml-2 fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-8">
      <h2 class="text-3xl font-semibold mb-4">Informations Client</h2>
      <form class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label class="text-lg font-semibold text-gray-800 mb-2">Adresse de facturation:</label>
          <input
            class="border rounded py-2 px-4 focus:outline-none focus:border-blue-500"
            type="text"
            v-model="customerFacturationAddress"
            required
            placeholder="Entrez votre nom complet"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-lg font-semibold text-gray-800 mb-2">Adresse de livraison:</label>
          <input
            class="border rounded py-2 px-4 focus:outline-none focus:border-blue-500"
            type="text"
            v-model="customerDeliveryAddress"
            required
            placeholder="Entrez votre adresse"
          />
        </div>

        <button
          class="col-span-2 sm:col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Valider la commande
        </button>
      </form>
    </div>

    <div class="mt-8">
      <h2 class="text-3xl font-semibold">Montant total de la commande: {{ total }}€</h2>
    </div>
  </main>
</template>
