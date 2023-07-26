<script setup>
import store from '@/stores/store'
import router from '@/router'
import { onMounted } from 'vue'

const logout = () => {
  store.commit('setUser', null)
  store.commit('setLoggedIn', false)

  router.push({ name: 'login' })
}

onMounted(() => {
  logout()
})
</script>
