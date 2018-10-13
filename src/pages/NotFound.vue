<template>
  <div class="not-found">
    <h1>404</h1>
    <br>
    <h2>
      Not Found
    </h2>
    <br>
    <button @click="backLogin" class="bg-btn">Login</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    backLogin() {
      this.$router.push('/')
    }
  }
})
</script>
