import httpClient from "@/services/httpClient";

export async function addToCartService(product) {
    const response = await httpClient.post("/cart/add", { product })
    console.log("respon", response.data)
    return response.data
}

export async function getCartItemsService(userId) {
    const response = await httpClient.get(`/cart/user/${userId}`)
    console.log("respon", response.data)
    return response.data
}
export async function removeItemService(cartId, cartItemId) {
    console.log("ok")
    const response = await httpClient.delete(`/cart/remove/${cartId}/${cartItemId}`)
    console.log("respon", response)
    // return response.data
}