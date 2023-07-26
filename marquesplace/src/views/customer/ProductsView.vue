<script setup>
import {ref, onMounted, reactive} from 'vue'
import NavBar from '@/components/NavBar.vue'
import {getCurrentUser} from '@/services/auth'
// import httpClient from '@/services/httpClient'
import {getProducts} from "@/services/products";
import {addToCartService} from "@/services/cart";

const products = ref([])
const currentUser = getCurrentUser()
const user = currentUser.id
let cartId = null
const quantity = reactive({})

onMounted(async () => {
  try {
    const listOfProducts = await getProducts()
    listOfProducts.map((product) => {
      product.quantity = 0
    })
    products.value = listOfProducts

  } catch (e) {
    console.error(e)
  }
})


const decrement = (product) => {
  if (product.quantity > 0) {
    product.quantity--
  }
}

const increment = (product) => {
  product.quantity++
}

async function addToCart(product) {

  console.log("product", product)
  const result = await addToCartService(product)
  console.log("res", result)
}


// async function getCartIdByUser() {
//   try {
//     const response = await httpClient.get(`/cart/user/${user}`)
//     if (response.data.length > 0) {
//       cartId = response.data[0].id
//       return cartId
//     }
//
//     return null
//   } catch (error) {
//     console.error('Error fetching cart:', error)
//   }
// }
//
// async function createCart(totalPrice, userId) {
//   try {
//     const response = await httpClient.post('/cart', {
//       total_price: totalPrice,
//       user_id: userId
//     })
//     return response.data
//   } catch (error) {
//     console.error('Error creating cart:', error)
//   }
// }

// async function addToCart(product) {
//   try {
//     const existingCartId = await getCartIdByUser()
//     if (existingCartId) {
//       cartId = existingCartId
//     } else {
//       const newCart = await createCart(product.price * product.quantity, user)
//       cartId = newCart.id
//     }
//
//     const response = await httpClient.post('/cart/add', {
//       cartId: cartId,
//       productRef: product.reference,
//       productId: product.id,
//       quantity: product.quantity
//     })
//     console.log(product.reference)
//     if (response.status === 200) {
//       await getProducts()
//       console.log('Item added to cart')
//     } else {
//       const data = await response.data
//       console.error('Error adding item to cart:', data.error)
//     }
//   } catch (error) {
//     console.error('Error adding item to cart:', error)
//   }
// }

// async function getProducts() {
//   console.log("omù",import.meta.env)
//   const response = await httpClient.get(`http://localhost:3000/products`)
//   products.value = []
//   response.data.forEach((product) => {
//     product.quantity = 0
//     products.value.push(product)
//   })
// }

// onMounted(async () => {
//   try {
//     await getProducts()
//   } catch (error) {
//     console.error('Error fetching products:', error)
//   }
// })
</script>

<template>
  <main>
    <NavBar/>
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
