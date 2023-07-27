<script setup></script>

<template>
  <div class="container mx-auto max-w-7xl">
    <div class="flex justify-center items-center py-12">
      <div class="max-w-4xl w-full">
        <h1 class="text-3xl font-bold mb-8">404 Page Not Found</h1>
        <p>The page you are looking for could not be found.</p>
        <router-link :to="{ name: 'home' }" class="btn btn-primary">
          Retour à la page d'accueil</router-link>
      </div>
    </div>
  </div>
</template>
