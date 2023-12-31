<script setup>
import { reactive, computed, toRefs, onMounted } from 'vue'
import '../../assets/index.css'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import TextInput from '@/components/form/TextInput.vue'
import SelectInput from '@/components/form/SelectInput.vue'
import { updateProduct } from '@/services/products'
import { getProduct } from '@/services/products'
import { useRoute } from 'vue-router'

onMounted(async () => {
  await productSetup()
})
const formData = reactive({
  name: '',
  stock: '',
  price: '',
  description: '',
  status: 'active',
  flashMessage: null,
  product: null
})

const errors = reactive({
  name: null,
  stock: null,
  price: null,
  description: null
})

async function productSetup() {
  const response = await getProduct(useRoute().params.reference)

  Object.assign(formData, response)
}

const validateField = (field, errorCondition, errorMessage) => {
  errors[field] = errorCondition ? null : errorMessage
}

const isFormValid = computed(() => {
  validateField('name', formData.name.length >= 2, 'Le nom doit contenir au moins 2 caractères')
  validateField(
    'stock',
    !isNaN(formData.stock) && formData.stock !== '',
    'Le stock doit être un nombre'
  )
  validateField(
    'price',
    !isNaN(formData.price) && formData.price !== '',
    'Le prix doit être un nombre'
  )
  validateField(
    'description',
    formData.description.length >= 2,
    'La description doit contenir au moins 2 caractères'
  )
  validateField(
    'description',
    formData.description.length <= 5000,
    'La description doit contenir moins de 5000 caractères'
  )

  return !Object.values(errors).some((error) => error !== null)
})

const resetForm = () => {
  formData.name = ''
  formData.stock = ''
  formData.price = ''
  formData.description = ''
  formData.status = 'active'
}

const submitForm = async () => {
  if (!isFormValid.value) return

  const result = await updateProduct(formData)

  console.log(result)

  if (result && result.reference) {
    formData.flashMessage = `Le produit ${result.name} a été modifié avec succès. Cliquez ici pour le voir.`
    formData.product = result
  }

  resetForm()
  console.log(formData.flashMessage)
}

const { name, stock, price, description, flashMessage, product } = toRefs(formData)
</script>

<template>
  <SideBar />

  <div class="sm:ml-64">
    <NavBar />
    <div class="p-4 lg:p-10">
      <div class="md:flex md:flex-wrap md:justify-between font-light text-sm text-gray-400 mb-6">
        <div class="flex flex-wrap items-center">
          <router-link
            :to="{ name: 'products' }"
            class="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded-full mr-2"
            ><i class="fa-solid fa-chevron-left mr-2"></i> Retour</router-link
          >
          <h1 class="uppercase"><i class="fa-solid fa-boxes-stacked mr-2"></i> Produit</h1>
        </div>
      </div>

      <div class="flex items-center">
        <h1 class="text-3xl font-bold mr-3">
          <i class="fa-solid fa-boxes-stacked mr-2"></i> Modifier un produit
        </h1>
      </div>

      <section>
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <div
            class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 mb-6 shadow-md"
            v-if="product"
          >
            <div class="flex">
              <div class="py-1">
                <svg
                  class="fill-current h-6 w-6 text-teal-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-bold">Produit correctement modifié !</p>
                <router-link
                  :to="{ name: 'productDetail', params: { reference: product.reference } }"
                  class="text-sm"
                  >{{ flashMessage }}</router-link
                >
              </div>
            </div>
          </div>
          <p class="mb-4 text-xl font-bold text-gray-900">Modifier un produit</p>
          <form @submit.prevent="submitForm">
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div class="sm:col-span-2">
                <TextInput
                  type="text"
                  v-model="formData.name"
                  id="name"
                  label="Nom de produit"
                  placeholder="Chaussette"
                  :error="errors.name"
                />
              </div>
              <div class="w-full">
                <TextInput
                  type="number"
                  v-model="formData.stock"
                  id="stock"
                  label="Stock"
                  placeholder="24"
                  :error="errors.stock"
                />
              </div>
              <div class="w-full">
                <TextInput
                  type="number"
                  v-model="formData.price"
                  id="price"
                  label="Prix"
                  placeholder="2345$"
                  :error="errors.price"
                />
              </div>
              <div class="sm:col-span-2">
                <TextInput
                  type="textarea"
                  v-model="formData.description"
                  id="description"
                  label="Description"
                  placeholder="Chaussette de l'archiduchesse"
                  :error="errors.description"
                />
              </div>
              <div class="sm:col-span-2">
                <SelectInput
                  :options="[
                    { value: 'active', label: 'Actif' },
                    { value: 'archived', label: 'Inactif' }
                  ]"
                  v-model="formData.status"
                />
              </div>
            </div>
            <button
              type="submit"
              class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
            >
              Ajouter
            </button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>
