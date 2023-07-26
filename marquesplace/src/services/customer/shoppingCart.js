import { ref, computed } from 'vue'
import httpClient from '@/services/httpClient'

const cartItems = ref([])

const subtotal = computed(() => {
  return cartItems.value.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0)
})

const shipping = computed(() => {
  return subtotal.value > 0 ? 5 : 0
})

const total = computed(() => {
  return subtotal.value + shipping.value
})

async function getCartByUser(user) {
  try {
    const response = await httpClient.get(`/cart/user/${user}`)
    console.log("res", response)
    cartItems.value = []
    const data = await response.data
    console.log("data",data)
    cartItems.value.push(...data[0].cart_items)
  } catch (error) {
    console.error('Error fetching cart items:', error)
  }
}

async function removeItem(user, cartItem) {
  try {
    const response = await httpClient.delete(
      `/cart/remove/${cartItem.cart_id}/${cartItem.product.reference}`
    )
    if (response.status === 204) {
      await getCartByUser(user)
    } else {
      const data = await response.data
      console.error('Error removing item:', data.error)
    }
  } catch (error) {
    console.error('Error removing item:', error)
  }
}

export { cartItems, subtotal, shipping, total, getCartByUser, removeItem }
