import httpClient from '@/services/httpClient'

export async function getPendingMerchants() {
	const response = await httpClient.get('/admin/merchants/pending');
	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'approbation du marchand`);
	}
}

export async function approveMerchant(id) {
    const response = await httpClient.get(`/admin/merchants/approve/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'approbation du marchand`);
    }
}

export async function declineMerchant(id) {
    const response = await httpClient.get(`/admin/merchants/decline/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'approbation du marchand`);
    }

}