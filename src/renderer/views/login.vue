<template>
  <div id="login_in">
    <div class="login_win">
      <div class="login_main">
        <img class="logo" src="@/assets/logo.png">
        <p class="title">请使用Steamflow帐号密码登录</p>
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules">
          <el-form-item prop="name">
            <el-input v-model.number="ruleForm.name" placeholder="请输入streamflow帐号" />
          </el-form-item>
          <el-form-item prop="pass">
            <el-input v-model="ruleForm.pass" type="password" autocomplete="off" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item class="login_button">
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-checkbox v-model="savePassword">记住密码</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
const { session } = require('electron').remote

export default {
  name: 'Login',
  components: { },
  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      setTimeout(() => {
        if (value.length < 3) {
          callback(new Error('用户名长度大于三位'))
        } else {
          callback()
        }
      }, 500)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        name: ''
      },
      savePassword: false,
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        name: [
          { validator: checkName, trigger: 'blur' }
        ]
      }
    }
  },
  computed: { },
  watch: {
  },
  beforeCreate () { },
  created () { },
  mounted () {
    this.getCookie()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.pass === 'admin' && this.ruleForm.name === 'admin') {
            if (this.savePassword) {
              const obj = {
                name: this.ruleForm.name,
                pass: this.ruleForm.pass
              }
              this.setCookie(obj, 30)
            } else {
              const obj = {
                name: '',
                pass: ''
              }
              this.setCookie(obj, -1)
            }
            this.$router.replace('/index')
          } else {
            alert('Username/password combination is wrong!')
            return false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setCookie (obj = {}, day = 10) {
      const expirationDate = new Date().getTime() + 24 * 60 * 60 * 1000 * day
      Object.keys(obj).forEach(key => {
        session.defaultSession.cookies.set({
          url: 'http://localhost',
          name: key + '_stm',
          value: obj[key],
          expirationDate
        }, (err) => { if (err) console.log(err) })
      })
      session.defaultSession.cookies.flushStore(() => {})
    },
    getCookie () {
      session.defaultSession.cookies.get({ url: 'http://localhost' }, (err, cookies) => {
        if (err) {
          console.log(err)
          return
        }
        if (cookies && cookies.length) {
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i]
            if (cookie.name === 'name_stm') {
              this.ruleForm.name = cookie.value
            } else if (cookie.name === 'pass_stm') {
              this.ruleForm.pass = cookie.value
            }
          }
          if (this.ruleForm.name && this.ruleForm.pass) {
            this.savePassword = true
          } else {
            this.ruleForm.name = ''
            this.ruleForm.pass = ''
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#login_in{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  .login_win{
    display: flex;
    width: 600px;
    height: 600px;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .login_main{
      width: 60%;
      text-align: center;
      .logo{
        width: 228px;
      }
      .title{
        margin:64px auto 26px;
        text-align: center;
        font-size: 20px;
      }
      ::v-deep .el-input__inner{
        height:48px;
        padding:12px 16px;
        font-size:16px;
      }
      .login_button{
        text-align: left;
        margin-top: 64px;
        .el-button{
          width: 100%;
          background-color: #3760EA;
        }
      }
    }
  }
}
</style>
