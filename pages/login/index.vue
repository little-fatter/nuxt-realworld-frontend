<template>
    <div class="container">
        <div class="auth-page">
            <div class="container page">
                <div class="row">

                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">{{ islogin ?  'Sign in' : ' Sign up'}}</h1>
                    <p class="text-xs-center">
                    <nuxt-link v-if ="!islogin" to="/login">Have an account?</nuxt-link>
                    <nuxt-link v-else to="/register">need an account?</nuxt-link>
                    </p>

                    <ul v-if="errors" class="error-messages">
                    <template v-for="(messages,field) in errors">
                        <li v-for="(message,index) in messages" :key= "index">
                            {{ field }} {{message}}
                        </li>
                    </template>
                    </ul>

                    <form @submit.prevent="onSubmit()">
                    <fieldset v-if ="!islogin" class="form-group">
                        <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name" required>
                    </fieldset>
                    <fieldset class="form-group">
                        <input v-model="user.email"  class="form-control form-control-lg" type="email" placeholder="Email" required>
                    </fieldset>
                    <fieldset class="form-group">
                        <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password" required>
                    </fieldset>
                    <button class="btn btn-lg btn-primary pull-xs-right">
                       {{ islogin ?  'Sign in' : ' Sign up'}}
                    </button>
                    </form>
                </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {login,register} from '@/utils/request/api.js'

// 仅在客户端加载
const  Cookie = process.client ? require('js-cookie') : undefined
export default {
    middleware:'notAuthenticated',
    name:'Login',
    components:{

    },
    props:{},
    data() {
        return {
            user:{
                email:'',
                password:'',
                username:''
            },
            errors:{}
        }
    },
    computed:{
        islogin () {
            return this.$route.name === 'login'
        }
    },
    methods:{
       async onSubmit () {
           try {
                    const {data} = this.islogin ?
                    await login({
                            user:this.user
                        })
                    : await register({
                            user:this.user
                        })
          
                // 保存用户登录状态
                this.$store.commit('setUser',data.user)
                Cookie.set('user',data.user)

                this.$router.push('/')
           } catch (error) {
               this.errors = error.response.data.errors
           }
          
        }
    },
    mounted () {}
}
</script>
