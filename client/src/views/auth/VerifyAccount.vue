<script setup>
import {verifyAccount} from "@/services/auth";
import {useRoute} from "vue-router";
import router from "@/router";
import {onMounted} from "vue";

const token = useRoute()?.params?.token
onMounted(async ()=>{
  if (token) {
    try {
      const response = await verifyAccount(token)
      if (response.status === 200) {
        await router.push('/auth/login')
      }
    } catch (e) {
      console.error(e)
    }
  }
})
</script>
