<script setup>
import { reactive, onMounted } from 'vue'
import NavBar from '../../components/NavBar.vue'
import { getCurrentUser } from '../../services/auth'

const products = reactive([])
const currentUser = getCurrentUser()
const user = currentUser.id
let cartId = null

const decrement = (product) => {
  if (product.quantity > 0) {
    product.quantity--
  }
}

const increment = (product) => {
  product.quantity++
}

async function getCartIdByUser() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/user/${user}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    })
    const data = await response.json()
    if (data.length > 0) {
      cartId = data[0].id
    }
    return cartId
  } catch (error) {
    console.error('Error fetching cart:', error)
  }
}

async function createCart(totalPrice, userId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        total_price: totalPrice,
        user_id: userId
      })
    })
    const data = await response.json()
    return data.id
  } catch (error) {
    console.error('Error creating cart:', error)
  }
}

async function addToCart(product) {
  try {
    if (cartId === null) {
      const existingCartId = await getCartIdByUser()
      if (existingCartId) {
        cartId = existingCartId
      } else {
        const newCart = await createCart(product.price * product.quantity, user)
        cartId = newCart.id
      }
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        cartId: cartId,
        productRef: product.reference,
        quantity: product.quantity
      })
    })
    if (response.status === 200) {
      console.log('Item added to cart')
    } else {
      const data = await response.json()
      console.error('Error adding item to cart:', data.error)
    }
  } catch (error) {
    console.error('Error adding item to cart:', error)
  }
}

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      }
    })
    const data = await response.json()
    data.forEach((product) => {
      product.quantity = 0
      products.push(product)
    })
  } catch (error) {
    console.error('Error fetching products:', error)
  }
})
</script>

<template>
  <main>
    <NavBar />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 mx-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white p-6 shadow-lg rounded-lg transition-transform transform hover:scale-105"
      >
        <h2 class="text-xl font-semibold mb-3">{{ product.name }}</h2>
        <p class="text-gray-600 mb-4">{{ product.description }}</p>
        <div class="flex items-center justify-between mb-4">
          <p class="text-green-600 font-semibold">Prix : {{ product.price }} €</p>
          <p class="text-blue-600 font-semibold">Stock : {{ product.stock }}</p>
        </div>

        <div class="flex items-center mt-4">
          <button
            @click="decrement(product)"
            class="bg-gray-200 text-gray-700 rounded-l-lg px-4 py-2"
          >
            -
          </button>
          <input
            type="number"
            v-model="product.quantity"
            min="0"
            class="w-12 text-center text-gray-700 font-semibold bg-gray-100 border border-gray-200 py-1 pl-2 pr-2"
          />
          <button
            @click="increment(product)"
            class="bg-gray-200 text-gray-700 rounded-r-lg px-4 py-2"
          >
            +
          </button>
        </div>

        <button
          @click="addToCart(product)"
          class="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </main>
</template>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
