<script setup>

import NavBar from "@/components/NavBar.vue";
</script>

<template>
    <main>
        <NavBar/>

        <div class="h-[100vh] w-[100vw]">
            <div id="successModal" tabindex="-1" aria-hidden="true" class="overflow-y-auto overflow-x-hidden justify-center items-center w-full md:inset-0 h-modal md:h-full flex items-center justify-center">
                <div class="p-4 w-full max-w-md h-full md:h-auto">
                    <div class="p-4 text-center bg-white rounded-lg shadow sm:p-5">
                        <div class="w-12 h-12 rounded-full bg-green-100 p-2 flex items-center justify-center mx-auto mb-3.5">
                            <svg aria-hidden="true" class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only">Succès</span>
                        </div>
                        <p class="mb-4 text-lg font-semibold text-gray-900">Votre paiement a bien été accepté ! </p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>