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

<style>
.not-found {
  padding-top: 200px;
  text-align: center;
}

.bg-btn {
  height: 30px;
  width: 80px;
  background-color: #409eff;
  color: #ffffff;
  font-size: 14px;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 3px;
}
</style>
