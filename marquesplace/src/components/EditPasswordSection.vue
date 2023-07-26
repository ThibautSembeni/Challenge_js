<script setup>
import { reactive, ref, watch } from "vue";
import Input from "@/components/form/Input.vue";

const isDisabled = ref(true)
const editMode = ref(false)
const arePasswordsValid = ref(false)
const emit = defineEmits(['passwordEvent'])

const defaultPasswordValues = {
	currentPassword: '',
	newPassword: '',
	confirmNewPassword: ''
}

const passwordValues = reactive({ ...defaultPasswordValues })

const handleCancelClick = () => {
	isDisabled.value = !isDisabled.value
	editMode.value = !editMode.value
};

const validatePassword = (value) => {
	const isValid = value.length >= 8
	const message = isValid ? '' : 'Le mot de passe doit avoir au moins 8 caractères.'
	return { isValid, message }
}

const editPassword = () => {
	isDisabled.value = !isDisabled.value
	editMode.value = !editMode.value
}

const changePassword = () => {
	const { currentPassword, newPassword } = passwordValues
	emit('passwordEvent', { currentPassword, newPassword })
	isDisabled.value = !isDisabled.value
	editMode.value = !editMode.value
	Object.assign(passwordValues, defaultPasswordValues)
}

watch(passwordValues, () => {
	arePasswordsValid.value = validatePassword(passwordValues.currentPassword).isValid === true &&
		validatePassword(passwordValues.newPassword).isValid === true &&
		validatePassword(passwordValues.confirmNewPassword).isValid === true &&
		passwordValues.newPassword === passwordValues.confirmNewPassword;
})
</script>

<template>
	<div class="flex items-center">
		<h2 class="text-2xl font-bold my-4">Modifier le mot de passe </h2>
		<button
			class="ml-4 px-3 py-2 text-xs font-medium inline-flex text-white bg-blue-700 rounded-lg hover:bg-blue-800"
			@click="editPassword"
			v-if="editMode === false"
		>
			Modifier le mot de passe
		</button>
		<button
			class="ml-4 px-3 py-2 text-xs font-medium inline-flex rounded-lg hover:bg-green-800"
			:class="{'text-white bg-green-700': arePasswordsValid,'text-gray-400 bg-gray-300 cursor-not-allowed': !arePasswordsValid }"
			@click="changePassword"
			v-if="editMode"
			:disabled="!arePasswordsValid"
		>
			Changer le mot de passe
		</button>
		<button
			class="ml-4 px-3 py-2 text-xs font-medium inline-flex items-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
			@click="handleCancelClick"
			v-if="editMode"
		>
			<svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
			Cancel
		</button>


	</div>
	<div class="flex flex-row mb-4">
		<div class="w-1/2 pr-2">
			<Input
				label="Ancien mot de passe"
				type="password"
				:disabled="isDisabled"
				:validator="validatePassword"
				v-model="passwordValues.currentPassword"
			/>
		</div>
	</div>
	<div class="flex flex-row mb-4">
		<div class="flex-1 mr-2">
			<Input
				label="Nouveau mot de passe"
				:value="passwordValues.newPassword"
				:disabled="isDisabled"
				v-model="passwordValues.newPassword"
				:validator="validatePassword"
				type="password"
			/>
		</div>
		<div class="flex-1 ml-2">
			<Input
				label="Confirmer le nouveau mot de passe"
				:value="passwordValues.confirmNewPassword"
				:disabled="isDisabled"
				v-model="passwordValues.confirmNewPassword"
				:validator="validatePassword"
				type="password"
			/>
		</div>
	</div>
</template>

<style scoped>

</style>