<template>
  <table class="w-full text-sm text-left text-gray-500 my-3">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
      <slot name="thead"></slot>
    </thead>
    <tbody>
      <slot name="tbody"></slot>
    </tbody>
    <tfoot>
      <slot name="tfoot"></slot>
    </tfoot>
  </table>
</template>
