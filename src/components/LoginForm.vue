<template>
  <div class="container mt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-6">
        <div class="card px-5 py-5" id="form1">
          <div class="form-data" v-if="!submitted">
            <div class="text-center mb-4">
              <h4>Вход</h4>
            </div>
            <div class="forms-inputs mb-4">
              <span>Имя пользователя</span>
              <input autocomplete="off" type="text"
                     v-model="username"
                     v-bind:class="{'form-control':true, 'is-invalid' : validateUsername && !isValidUsername(username)}"
                     v-on:input="validateUsername = true"
              >
              <div class="invalid-feedback">Имя пользователя должно быть больше 3 символов!</div>
            </div>
            <div class="forms-inputs mb-4">
              <span>Пароль</span>
              <input autocomplete="off" type="password"
                     v-model="password"
                     v-bind:class="{'form-control':true, 'is-invalid' : validatePassword && !isValidPassword(password)}"
                     v-on:input="validatePassword = true"
              >
              <div class="invalid-feedback">Пароль должен быть больше 7 символов!</div>
            </div>
            <div v-if="!loginActive" class="forms-inputs mb-4">
              <span>Подтверждение пароля</span>
              <input autocomplete="off" type="password"
                     v-model="confirmPassword"
                     v-bind:class="{'form-control':true, 'is-invalid' : validateConfirmPassword && !isValidConfirmPassword(confirmPassword)}"
                     v-on:input="validateConfirmPassword = true"
              >
              <div class="invalid-feedback">{{ getConfirmPasswordErrorText() }}</div>
            </div>
            <div class="mb-3">
              <button v-on:click.stop.prevent="submit()" class="btn btn-dark w-100">{{ getLoginOrRegisterButtonText() }}</button>
            </div>
            <p>{{ getSignInOrSignUpText() }}
              <a href="#" @click="loginOrRegisterOpenClick()">{{ getSignInOrSignUpRefText() }}</a>
            </p>
          </div>
          <div class="success-data" v-else>
            <div class="text-center d-flex flex-column">
              <i class='bx bxs-badge-check'></i>
              <span class="text-center fs-1">You have been logged in <br> Successfully</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data: function () {
    return {
      loginActive: true,
      submitted: false,
      username: "",
      validateUsername: false,
      password: "",
      validatePassword: false,
      confirmPassword: "",
      validateConfirmPassword: false,
    }
  },
  methods: {
    getConfirmPasswordErrorText : function () {
      if (this.confirmPassword.length === 0) {
        return "Поле не может быть пустым"
      } else {
        return "Введённое значение не совпадает с полем 'Пароль'"
      }
    },
    loginOrRegisterOpenClick: function () {
      this.loginActive = !this.loginActive
      this.clearFormData()
    },
    getLoginOrRegisterButtonText: function () {
      if (this.loginActive) {
        return "Вход"
      } else {
        return "Регистрация"
      }
    },
    getSignInOrSignUpRefText: function () {
      if (this.loginActive) {
        return "Регистрация здесь"
      } else {
        return "Вход здесь"
      }
    },
    getSignInOrSignUpText: function () {
      if (this.loginActive) {
        return "Нет аккаунта?"
      } else {
        return "Есть аккаунт?"
      }
    },
    clearFormData: function () {
      this.username = ""
      this.password = ""
      this.confirmPassword = ""
      this.validateUsername = false
      this.validatePassword = false
      this.validateConfirmPassword = false
    },
    isValidPassword: function(password) {
      return password.length >= 8
    },
    isValidConfirmPassword: function(confirmPassword) {
      return confirmPassword.length > 0 && this.password === confirmPassword
    },
    isValidUsername : function(username) {
      return !/\s/.test(username) && username.length >= 4
    },
    isValidLoginData: function () {
      this.validateUsername = true
      this.validatePassword = true
      return this.isValidUsername(this.username) && this.isValidPassword(this.password)
    },
    isValidRegisterData: function () {
      this.validateUsername = true
      this.validatePassword = true
      this.validateConfirmPassword = true
      return this.isValidUsername(this.username) &&
          this.isValidPassword(this.password) &&
          this.isValidConfirmPassword(this.confirmPassword)
    },
    submit : function() {
      if (this.loginActive) {
        if (this.isValidLoginData()) {
          this.submitted=true
        }
      } else {
        if (this.isValidRegisterData()) {
          this.submitted=true
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  background: #000
}

.card {
  border: none;
  height: 320px
}

.forms-inputs {
  position: relative
}

.forms-inputs span {
  position: absolute;
  top: -18px;
  left: 10px;
  background-color: #fff;
  padding: 5px 10px;
  font-size: 15px
}

.forms-inputs input {
  height: 50px;
  border: 2px solid #eee
}

.forms-inputs input:focus {
  box-shadow: none;
  outline: none;
  border: 2px solid #000
}

.btn {
  height: 50px
}

.success-data {
  display: flex;
  flex-direction: column
}

.bxs-badge-check {
  font-size: 90px
}
</style>
