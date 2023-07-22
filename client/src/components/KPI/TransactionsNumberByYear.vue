<script setup>
import { onMounted, defineProps, reactive, ref, watch } from 'vue'
import httpClient from '@/services/httpClient'
import ChartGraph from '@/components/charts/ChartGraph.vue'
import { generateValue } from '../../utils/dashboardKpis'

const props = defineProps({
  width: {
    type: [String, Number],
    default: '400'
  },
  height: {
    type: [String, Number],
    default: '200'
  },
  statsData: {
    type: Object
  }
})

const dateInput = ref(new Date().getFullYear())

const defaultValue = {
  type: 'bar',
  data: {
    labels: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ],
    datasets: [
      {
        label: 'Nombre de transactions par mois',
        data: props.statsData.numberByYear,
        borderColor: 'rgba(98, 90, 250, 1)',
        backgroundColor: 'rgba(98, 90, 250, 0.7)'
      }
    ]
  },
  options: {}
}

const config = reactive({ ...defaultValue })

const loading = ref(true)

onMounted(async () => {
  await getStats()
})

watch(
  () => props.statsData.numberByYear,
  async (newValue) => {
    config.data.datasets[0].data = newValue
  }
)

async function getStats() {
  const params = new URLSearchParams()

  params.set('year', dateInput.value)

  const response = await httpClient.get(`/transactions/stats/numberbyyear?${params}`)
  if (response.status === 200) {
    config.data.datasets[0].data = generateValue(response.data)
    loading.value = false
  } else {
    throw new Error(
      `Error: ${response.status} - Une erreur s'est produite lors de la récupération des données.`
    )
  }
}

function onSelectDate(date) {
  dateInput.value = date
  getStats()
}
</script>

<template>
  <article>
    <div class="flex items-center space-x-2">
      <label for="date" class="block text-sm font-medium text-gray-700"
        >Filtrer sur l'année :</label
      >
      <VueDatePicker
        class="max-w-xs"
        v-model="dateInput"
        year-picker
        @update:model-value="onSelectDate"
      />
    </div>
    <ChartGraph :config="config" :loading="false" :width="width" :height="height" />
  </article>
</template>
