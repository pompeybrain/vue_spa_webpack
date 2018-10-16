<template>
  <div>
    <el-menu :default-active="onRoute" unique-opened @select="changeRoute">
      <el-menu-item index="server">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-server"></use>
        </svg>
        {{$t('serverManage.name')}}
      </el-menu-item>
      <el-menu-item index="raid">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-raid"></use>
        </svg>
        {{$t('raidManage.name')}}
      </el-menu-item>
      <el-menu-item index="group">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-group"></use>
        </svg>
        服务器分组
      </el-menu-item>
      <el-menu-item index="update">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-package-up"></use>
        </svg>
        {{$t('romManage.name')}}
      </el-menu-item>

      <el-menu-item index="firmware">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-firmware"></use>
        </svg>
        {{$t('firmwareManage.name')}}
      </el-menu-item>
      <el-menu-item index="log">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-log"></use>
        </svg>
        {{$t('logManage.name')}}
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      accessUrl: '',
      subMenuUrl: ''
    }
  },
  computed: {
    onRoute(): string {
      return this.$route.path.split('/')[1]
    }
  },
  methods: {
    changeRoute(index: string) {
      if (index !== this.onRoute) {
        this.$router.push('/' + index)
      } else {
        window.location.reload()
      }
    }
  }
})
</script>
<style scoped>
.el-menu {
  height: 100%;
  background-color: transparent;
}

.el-menu-item {
  color: #000000;
}
.el-menu-item .icon {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 14px;
}
</style>
