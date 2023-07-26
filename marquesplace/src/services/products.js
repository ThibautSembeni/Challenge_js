import httpClient from '@/services/httpClient'

export async function getProducts() {
    const response = await httpClient.get(`http://localhost:3000/products`)
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération des produits`);
    }
}

export async function getProduct(id) {
    const response = await httpClient.get(`/products/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la récupération du produit`);
    }
}

export async function createProduct(product) {
    const response = await httpClient.post('/products', product, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 201) {
        return response.data;
    } else {
        console.log(response);
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la création du produit`);
    }
}

export async function updateProduct(product) {
    const response = await httpClient.put(`/products/${product.id}`, product, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la mise à jour du produit`);
    }
}

export async function deleteProduct(id) {
    const response = await httpClient.delete(`/products/${id}`);
    if (response.status === 204) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de la suppression du produit`);
    }
}

