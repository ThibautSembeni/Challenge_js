<script setup>
import {ref, onMounted} from 'vue'
import {getCurrentUser} from '@/services/auth'
import NavBar from '@/components/NavBar.vue'
import {getCartItemsService, removeItemService} from "@/services/cart";

const customerAddress = ref('')
const customerCity = ref('')
const customerPostalCode = ref('')
const customerCountry = ref('')

const currentUser = getCurrentUser()
const userId = currentUser.id

const cart = ref({})

onMounted(async () => {
  try {
    cart.value = await getCartItemsService(userId)
  } catch (error) {
    console.error('Error fetching cart items:', error)
  }
})


const removeItem = async (cartItem) => {
  console.log("it", cartItem, cart.value)
  const cartId = cart.value.id;
  const cartItemId = cartItem.id;
  await removeItemService(cartId, cartItemId)
}
</script>

<template>
  <NavBar/>
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
        <tr v-for="cartItem in cart.cart_items" :key="cartItem.id" class="bg-white">
          <td class="border px-4 py-2 flex items-center">
            <div>
              {{ cartItem.product.name }}<br/>
              <span class="text-gray-600 text-sm">{{ cartItem.product.description }} </span>
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
        <div class="mb-4">
          <label class="block text-lg font-semibold text-gray-800 mb-2">Adresse:</label>
          <div class="relative">
            <input
                class="w-full border rounded py-3 px-4 pl-12 focus:outline-none focus:border-blue-500"
                type="text"
                v-model="customerAddress"
                required
                placeholder="Entrez votre adresse de facturation et de livraison"
            />
            <i
                class="absolute left-4 top-1/2 transform -translate-y-1/2 fas fa-map-marker-alt text-gray-400"
            ></i>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-lg font-semibold text-gray-800 mb-2">Ville:</label>
          <div class="relative">
            <input
                class="w-full border rounded py-3 px-4 pl-12 focus:outline-none focus:border-blue-500"
                type="text"
                v-model="customerCity"
                required
                placeholder="Entrez votre ville"
            />
            <i
                class="absolute left-4 top-1/2 transform -translate-y-1/2 fas fa-city text-gray-400"
            ></i>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-lg font-semibold text-gray-800 mb-2">Code postal:</label>
          <div class="relative">
            <input
                class="w-full border rounded py-3 px-4 pl-12 focus:outline-none focus:border-blue-500"
                type="text"
                v-model="customerPostalCode"
                required
                placeholder="Entrez votre code postal"
            />
            <i
                class="absolute left-4 top-1/2 transform -translate-y-1/2 fas fa-envelope text-gray-400"
            ></i>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-lg font-semibold text-gray-800 mb-2">Pays:</label>
          <div class="relative">
            <input
                class="w-full border rounded py-3 px-4 pl-12 focus:outline-none focus:border-blue-500"
                type="text"
                v-model="customerCountry"
                required
                placeholder="Entrez votre pays"
            />
            <i
                class="absolute left-4 top-1/2 transform -translate-y-1/2 fas fa-globe text-gray-400"
            ></i>
          </div>
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
      <h2 class="text-3xl font-semibold">Montant de la commande</h2>
      <p class="text-xl mt-2">Sous-total: {{ cart.total_price }}€</p>
      <p class="text-xl">Frais de port: {{ cart.total_price }}€</p>
      <p class="text-2xl font-semibold mt-4">Total: {{ cart.total_price }}€</p>
    </div>
  </main>
</template>