<template>
    <div class="container">
        <div class="editor-page">
            <div class="container page">
                <div class="row">

                <div class="col-md-10 offset-md-1 col-xs-12">
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
                            <input type="text" v-model="article.title" class="form-control form-control-lg" placeholder="Article Title">
                        </fieldset>
                        <fieldset class="form-group">
                            <input type="text" v-model="article.description" class="form-control" placeholder="What's this article about?">
                        </fieldset>
                        <fieldset class="form-group">
                            <textarea class="form-control" v-model="article.body" rows="8" placeholder="Write your article (in markdown)"></textarea>
                        </fieldset>
                        <fieldset class="form-group">
                            <input type="text" class="form-control" v-model="article.tagList[0]" placeholder="Enter tags"><div class="tag-list"></div>
                        </fieldset>
                        <button class="btn btn-lg btn-primary pull-xs-right">
                            Publish Article
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
import {getUser,createArticle} from '@/utils/request/api.js'

export default {
    middleware :'authenticated',
    name:'Editor',
    components:{

    },
    props:{},
    data() {
        return {
            userRequestCount:0,   
            errors: {} ,
            article : {tagList:[]}
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
        async createArticle (data) {
           try {
                let responseData  = await createArticle(data)
                  responseData.status == 200 ?  this.$router.push('/') : ''
           } catch (err) {
                this.errors = err.response.data.errors
           }
        },
        onSubmit () {
            this.createArticle(this.article);
        }
    },
    mounted () {
        this.getUser()
    }
}
</script>
