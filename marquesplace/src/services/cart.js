import httpClient from "@/services/httpClient";

export async function addToCartService(product) {
    console.log("ok")
    const response = await httpClient.post("/cart/add", { product })
    console.log("response", response.data)
    return response.data
}

export async function getCartItemsService(userId) {
    const response = await httpClient.get(`/cart/user/${userId}`)
    console.log("response", response.data)
    return response.data
}
export async function removeItemService(cartId, cartItemId) {
    console.log("ok")
    const response = await httpClient.delete(`/cart/remove/${cartId}/${cartItemId}`)
    console.log("response", response)
    // return response.data
}