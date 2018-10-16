<template>
  <div class="index">
    <div class="header">
      <div class="logo">
        <i class="fa fa-university" aria-hidden="true"></i>
        {{$t('common.systemName')}}
      </div>
      <div class="oper">
        <div @click="editPassword">
          <span>{{$t('header.modifyPassword')}}</span>
        </div>
        <div class=" logout" @click="logout">
          <span>{{$t('common.quit')}}</span>
        </div>
      </div>
      <div class="info">
        <span>{{$t('header.welcome')}}</span>
        <span>{{userName}}</span>
      </div>
      <el-dialog :visible.sync="passwordFormVisible" :title="$t('header.modifyPassword')" width="400px" center append-to-body>
        <el-form label-width="140px" :model="passwordForm" size="small" ref="passwordForm" :rules="passwordFormRules">
          <el-form-item :label="$t('header.oldPassword')" prop="oldPwd">
            <el-input v-model.trim="passwordForm.oldPwd"></el-input>
          </el-form-item>
          <el-form-item :label="$t('header.newPassword')" prop="newPwd">
            <el-input v-model.trim="passwordForm.newPwd"></el-input>
          </el-form-item>
          <el-form-item :label="$t('header.repeatPassword')" prop="confirmPassword">
            <el-input v-model.trim="passwordForm.confirmPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="passwordFormVisible = false">{{$t('common.cancel')}}</el-button>
            <el-button @click="updatePassword" type="primary">{{$t('common.ok')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <v-aside class="aside"></v-aside>
    <div class="container" ref="container">
      <transition>
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import vAside from "./Aside.vue";
export default Vue.extend({
  components: { vAside },
  data() {
    return {
      passwordFormVisible: false,
      passwordForm: {
        oldPwd: "",
        newPwd: "",
        confirmPassword: ""
      },
      passwordFormRules: {
        oldPwd: [
          { required: true, message: this.$t("header.inputOldPassword") }
        ],
        newPwd: [
          { required: true, message: this.$t("header.inputNewPassword") }
        ],
        confirmPassword: [
          {
            required: true,
            validator: (rule: object, value: string, callback: () => any) => { }
          }
        ]
      }
    };
  },
  computed: {
    userName() {
      let userName = sessionStorage.getItem("userName");
      if (userName !== null) {
        return userName;
      } else {
        return "notlogin";
      }
    }
  },
  created() {
    this.passwordFormRules.confirmPassword[0].validator = this.validateConfirmPassword
  },
  methods: {
    validateConfirmPassword(rule: object, value: string, callback: (error?: object) => any) {
      if (value == this.passwordForm.newPwd) {
        callback();
      } else {
        callback(new Error('' + this.$t("header.repeatPasswordError")));
      }
    },
    editPassword() {
      let form: any = this.$refs["passwordForm"]
      form && form.resetFields();
      this.passwordFormVisible = true;
    },
    updatePassword() {
      let form: any = this.$refs["passwordForm"]
      form.validate((valid: boolean) => {
        if (valid) {
          this.$http.postForm("auth/updatePwd", this.passwordForm).then((res: Res) => {
            if (res.result === 1) {
              this.$message.success('' + this.$t("common.operateSuccess"));
              this.$router.push("/");
            } else {
              if (res.msg == -100) {
                this.$message.error('' + this.$t("header.oldPasswordError"));
              } else {
                this.$message.error('' + this.$t("common.operateFail"));
              }
            }
          });
        } else {
          this.$message.error('' + this.$t("common.formError"));
        }
      });
    },
    logout() {
      this.$http.get("auth/api/logout").then((res: Res) => {
        sessionStorage.removeItem("userName");
        this.$message.success('' + this.$t("header.logoutSuccess"));
        this.$router.push("/");
      });
    }
  }
})
</script>
<style scoped>
.header {
  background-color: #267194;
  position: fixed;
  top: 0;
  height: 50px;
  width: 100%;
  z-index: 200;
  color: #ffffff;
  align-items: center;
}

.aside {
  display: block;
  width: 200px;
  overflow: auto;
  position: fixed;
  top: 50px;
  left: 0;
  bottom: 0;
}

.logo {
  float: left;
  color: #dddddd;
  font-size: 24px;
  line-height: 50px;
  text-decoration: none;
  margin-left: 20px;
}

.info,
.oper {
  float: right;
  line-height: 50px;
  margin-right: 50px;
}

.oper {
  cursor: pointer;
  display: flex;
}

.logout {
  margin-left: 20px;
}
</style>
