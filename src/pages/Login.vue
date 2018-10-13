<template>
  <div class="login-box" @keyup.enter="login">
    <h3>{{$t('common.systemName')}}</h3>
    <el-form :model="loginForm" ref="loginForm" :rules="loginFormRules">
      <el-row :gutter="0">
        <el-col :span="16" :offset="4">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" class="username" :placeholder="$t('common.account')">
              <template slot="prepend">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-user"></use>
                </svg>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="16" :offset="4">
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" class="password" :placeholder="$t('common.password')" type="password">
              <template slot="prepend">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-lock"></use>
                </svg>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0" class="remember-me">
        <el-col :span="4" :offset="4">
          <el-checkbox v-model="isRemember">{{$t('common.rememberMe')}}</el-checkbox>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="16" :offset="4">
          <el-form-item>
            <el-button @click="login" class="lg-btn" type="primary">{{$t('common.login')}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span class="version">v:{{version}}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: this.$t('common.pleaseInputAccount'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('common.pleaseInputPassword'),
            trigger: 'blur'
          }
        ]
      },
      isRemember: true,
      version: '0.0.0'
    }
  },
  mounted: function() {
    this.getVersion()
    this.setUserName()
  },
  methods: {
    getVersion() {
      this.$http.get('cgi/system/getVersion').then(res => {
        this.version = res.object || '0.0.0'
      })
    },
    setUserName() {
      if (localStorage.getItem('userName') !== null) {
        this.loginForm.username = localStorage.getItem('userName')
      }
    },
    login() {
      this.$refs['loginForm'].validate(validateResult => {
        if (validateResult) {
          this.$http
            .postForm('auth/api/login', this.loginForm)
            .then(res => {
              if (res.result === 1) {
                sessionStorage.setItem('userName', this.loginForm.username)
                if (this.isRemember) {
                  localStorage.setItem('userName', this.loginForm.username)
                } else {
                  localStorage.removeItem('userName')
                }
                this.$message({
                  message: this.$t('common.loginSuccess'),
                  type: 'success'
                })
                this.$router.push('/server')
              } else {
                this.$message.error(this.$t('common.loginFail'))
              }
            })
            .catch(() => {
              console.error('登录接口出错')
            })
        } else {
          this.$message.error(this.$t('common.loginFormError'))
        }
      })
    }
  }
}
</script>