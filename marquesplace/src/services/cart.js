import httpClient from "@/services/httpClient";

export async function addToCartService(product) {
    const response = await httpClient.post("/cart/add", { product })
    return response.data
}

export async function getCartItemsService(userId) {
    const response = await httpClient.get(`/cart/user/${userId}`)
    return response.data
}
export async function removeItemService(cartId, cartItemId) {
    const response = await httpClient.delete(`/cart/remove/${cartId}/${cartItemId}`)
    return response.data
}
export async function createCharge(customerAddress, customerCity, customerPostalCode, customerCountry, currentUser, cart, price) {
    const charge = {
        "billing_info": {
            "address": customerAddress.value,
            "city": customerCity.value,
            "postal_code": customerPostalCode.value,
            "country": customerCountry.value
        },
        "shipping_info": {
            "address": customerAddress.value,
            "city": customerCity.value,
            "postal_code": customerPostalCode.value,
            "country": customerCountry.value
        },
        "client_info": {
            "name": currentUser.lastname + " " + currentUser.firstname,
            "email": currentUser.email,
            "phone_number": currentUser.phone_number
        },
        "cart": {
            "products": cart.value.cart_items.map(cartItem => {
                return {
                    "product_id": cartItem.product.id,
                    "quantity": cartItem.quantity
                }
            })
        },
        "amount": price,
        "currency": "EUR",
    }

    const response = await httpClient.post(`${import.meta.env.VITE_API_URL}/transactions`, charge);

    console.log("response", response.data);
    return response.data;
}