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
<script>
import vAside from "./Aside";

export default {
  components: { vAside },
  data () {
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
            validator: this.validateConfirmPassword
          }
        ]
      }
    };
  },
  computed: {
    userName () {
      let userName = sessionStorage.getItem("userName");
      if (userName !== null) {
        return userName;
      } else {
        return "notlogin";
      }
    }
  },
  methods: {
    validateConfirmPassword (rule, value, callback) {
      if (value == this.passwordForm.newPwd) {
        callback();
      } else {
        callback(new Error(this.$t("header.repeatPasswordError")));
      }
    },
    editPassword () {
      this.$refs["passwordForm"] && this.$refs["passwordForm"].resetFields();
      this.passwordFormVisible = true;
    },
    updatePassword () {
      this.$refs["passwordForm"].validate(valid => {
        if (valid) {
          this.$http.postForm("auth/updatePwd", this.passwordForm).then(res => {
            if (res.result === 1) {
              this.$message.success(this.$t("common.operateSuccess"));
              this.$router.push("/");
            } else {
              if (res.msg == -100) {
                this.$message.error(this.$t("header.oldPasswordError"));
              } else {
                this.$message.error(this.$t("common.operateFail"));
              }
            }
          });
        } else {
          this.$message.error(this.$t("common.formError"));
        }
      });
    },
    logout () {
      this.$http.get("auth/api/logout").then(res => {
        sessionStorage.removeItem("userName");
        this.$message.success(this.$t("header.logoutSuccess"));
        this.$router.push("/");
      });
    }
  }
};
</script>