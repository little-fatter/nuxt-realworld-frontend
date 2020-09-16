<template>
    <div class="container">
        <div class="settings-page">
            <div class="container page">
                <div class="row">

                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>

                    <ul v-if="errors" class="error-messages">
                        <template v-for="(messages,field) in errors">
                            <li v-for="(message,index) in messages" :key= "index">
                                {{ field }} {{message}}
                            </li>
                        </template>
                    </ul>

                    <form @submit.prevent="onSubmit()">
                    <fieldset>
                        <fieldset class="form-group">
                            <input class="form-control" v-model="user.image" type="text" placeholder="URL of profile picture">
                        </fieldset>
                        <fieldset class="form-group">
                            <input class="form-control form-control-lg" v-model="user.username" type="text" placeholder="Your Name">
                        </fieldset>
                        <fieldset class="form-group">
                            <textarea class="form-control form-control-lg" v-model="user.bio" rows="8" placeholder="Short bio about you"></textarea>
                        </fieldset>
                        <fieldset class="form-group">
                            <input class="form-control form-control-lg" v-model="user.email"  type="text" placeholder="Email">
                        </fieldset>
                        <fieldset class="form-group">
                            <input class="form-control form-control-lg" v-model="user.password" type="password" placeholder="Password">
                        </fieldset>
                        <button class="btn btn-lg btn-primary pull-xs-right">
                            Update Settings
                        </button>
                    </fieldset>
                    </form>
                </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getUser,updateUser} from '@/utils/request/api.js'

export default {
    middleware :'authenticated',
    name:'Settings',
    components:{

    },
    props:{},
    data() {
        return {
            user: {},
            userRequestCount:0,
            errors: {}
        }
    },
    methods:{
        async getUser() {
           try {
               this.userRequestCount ++;
               let { data } = await getUser();
               this.user = data.user;
           } catch (err) {
               if(this.userRequestCount >50) {
                    console.log(err)
                    return
               }
               this.getUser()
           }
        },
        async updateUser (data) {
           try {
                let responseData  = await updateUser(data)
                
                    this.$router.push('/')
           } catch (err) {
                this.errors = err.response.data.errors
           }
        },
        onSubmit () {
            this.updateUser(this.user);
        }
    },
    mounted () {
        this.getUser()
    }
}
</script>
