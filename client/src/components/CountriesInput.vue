<script setup>
import IconArrowUpDown from '@/components/icons/IconArrowUpDown.vue'
import { computed, onMounted, ref } from 'vue'

const countries = ref([])
const searchCountry = ref('')
const showList = ref(false)
const selectedCountry = ref({})
const filteredCountries = computed(() => {
  return countries.value.filter((country) =>
    country.name.common.toLowerCase().includes(searchCountry.value.toLowerCase())
  )
})
const emit = defineEmits(['update:modelValue'])

onMounted(async () => {
  try {
    const response = await fetch('https://restcountries.com/v3/all')
    const data = await response.json()
    countries.value = data
  } catch (error) {
    console.log("Une erreur s'est produite :", error)
  }
})
const selectCountry = (country) => {
  emit('update:modelValue', country.name.common)
  selectedCountry.value = country
  showList.value = false
}
const toggleList = () => {
  showList.value = !showList.value
}
</script>

<template>
  <div class="form-group mt-4 column">
    <label for="country">Pays</label>
    <div @click="toggleList" class="row space-between mt-1" id="default-country">
      <div class="">
        <span>
          <img :src="selectedCountry.flags[0]" alt="" class="flag" v-if="selectedCountry.flags" />
        </span>
        <span class="text-body">
          {{ selectedCountry.name?.common }}
        </span>
      </div>
      <div>
        <IconArrowUpDown />
      </div>
    </div>
    <div id="list-countries" v-show="showList" class="column">
      <input type="text" v-model="searchCountry" placeholder="Search countries" />
      <ul>
        <div id="list-options-country">
          <li
            role="option"
            class="country row"
            v-for="country in filteredCountries"
            :key="country.name.common"
            :value="country.name.common"
            @click="selectCountry(country)"
          >
            <span>
              <img :src="country.flags[0]" alt="" class="flag" />
            </span>
            <span class="country-name text-body">
              {{ country.name.common }}
            </span>
          </li>
        </div>
      </ul>
    </div>
    <!--    <p v-if="errors.country">{{ errors.country.join('\n') }}</p>-->
  </div>
</template>

<style scoped>
.flag {
  width: 20px;
  height: 12px;
  border-radius: 2px;
}

li {
  list-style: none;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

.country-name {
  max-width: 180px;
}

#default-country {
  border: unset;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(60, 66, 87, 0.16),
    0 2px 5px rgba(60, 66, 87, 0.08);
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
}

input {
  max-width: 100%;
  border: unset;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(60, 66, 87, 0.16),
    0 2px 5px rgba(60, 66, 87, 0.08);
  border-radius: 5px;
  padding: 10px;
}

ul {
  border-width: 0 0 1px;
  outline: none;
  border-radius: 5px;
  padding: 0;
  margin: 0;
  transition: all 0.5s ease-in-out;
}

#list-options-country {
  margin-top: 5px;
  max-height: 190px;
  overflow-y: auto;
  box-sizing: border-box;
}

.country {
  padding: 10px 0;
}

.country:hover {
  background: rgb(247, 250, 252);
}

#list-countries {
  max-width: 100%;
  padding-top: 3px;
  box-sizing: border-box;
  transition: all 0.5s ease-in-out;
}
</style>
