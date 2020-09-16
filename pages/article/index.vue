<template>
    <div class="container">
        <div class="article-page">

            <div class="banner">
                <div class="container">

                <h1>{{ articleData.slug }}</h1>

                <div v-if="articleData && articleData.author" class="article-meta">
                    <nuxt-link :to="'/profile/'+articleData.author.username"><img :src="articleData.author.image" /></nuxt-link>
                    <div class="info">
                    <nuxt-link :to="'/profile/'+articleData.author.username" class="author">{{ articleData.author.username }}</nuxt-link>
                    <span class="date">{{ articleData.createdAt }}</span>
                    </div>
                    <button v-if="articleData.author.username != user.username" class="btn btn-sm btn-outline-secondary">
                    <i class="ion-plus-round"></i>
                    &nbsp;
                    Follow {{ articleData.author.username }} <span class="counter">(10)</span>
                    </button>
                    &nbsp;&nbsp;
                    <button @click="deleteArticle(articleSlug)" v-if="articleData.author.username == user.username" class="btn btn-sm btn-outline-danger">
                    <i class="ion-trash-a"></i>
                    &nbsp;
                    delete Article
                    </button>
                    <button v-else class="btn btn-sm btn-outline-primary">
                    <i class="ion-heart"></i>
                    &nbsp;
                    Favorite Post <span class="counter">({{ articleData.favoritesCount }})</span>
                    </button>
                </div>

                </div>
            </div>

            <div class="container page">

                <div class="row article-content">
                <div class="col-md-12">
                    <p>
                        {{ articleData.body}}
                    </p>
                    <h2 id="introducing-ionic">{{ articleData.title }}</h2>
                    <p>{{ articleData.description}}</p>
                </div>
                </div>

                <hr />

                <div class="article-actions">
                <div v-if="articleData && articleData.author" class="article-meta">
                    <nuxt-link :to="'/profile/'+articleData.author.username"><img :src="articleData.author.image" /></nuxt-link>
                    <div class="info">
                    <nuxt-link :to="'/profile/'+articleData.author.username" class="author">{{articleData.author.username}}</nuxt-link>
                    <span class="date">{{ articleData.createdAt }}</span>
                    </div>

                     <button v-if="articleData.author.username != user.username" class="btn btn-sm btn-outline-secondary">
                    <i class="ion-plus-round"></i>
                    &nbsp;
                    Follow {{ articleData.author.username }} <span class="counter">(10)</span>
                    </button>
                    &nbsp;&nbsp;
                    <button @click="deleteArticle(articleSlug)" v-if="articleData.author.username == user.username" class="btn btn-sm btn-outline-danger">
                    <i class="ion-trash-a"></i>
                    &nbsp;
                    delete Article
                    </button>
                    <button v-else class="btn btn-sm btn-outline-primary">
                    <i class="ion-heart"></i>
                    &nbsp;
                    Favorite Post <span class="counter">({{ articleData.favoritesCount }})</span>
                    </button>
                </div>
                </div>

                <div class="row">

                <div class="col-xs-12 col-md-8 offset-md-2">

                    <form class="card comment-form" @submit.prevent="onSubmit()">
                    <div class="card-block">
                        <textarea class="form-control" v-model="commentBody" placeholder="Write a comment..." rows="3"></textarea>
                    </div>
                    <div class="card-footer">
                        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                        <button class="btn btn-sm btn-primary">
                        Post Comment
                        </button>
                    </div>
                    </form>
                    <template v-if="comments && comments.length > 0">
                        <div v-for="comment in comments" :key="comment.id" class="card">
                            <div class="card-block">
                                <p class="card-text">{{ comment.body }}</p>
                            </div>
                            <div class="card-footer">
                                <nuxt-link :to="'/profile/'+comment.author.username" class="comment-author">
                                <img :src="comment.author.image" class="comment-author-img" />
                                </nuxt-link>
                                &nbsp;
                                <nuxt-link :to="'/profile/'+comment.author.username" class="comment-author">{{ comment.author.username }}</nuxt-link>
                                <span class="date-posted">{{ comment.updatedAt }}</span>
                                <button 
                                    style="float:right;"
                                    v-if="comment.author.username == user.username" 
                                    class="btn btn-sm btn-danger"
                                    @click = deleteComments(articleSlug,comment.id)
                                >
                                    delete
                                </button>
                            </div>
                        </div>
                    </template>
                    
                    
                </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import { deleteArticle,getArticle,getUser,getComments,addComments,deleteComments,favoriteArticle,unfavoriteArticle } from '@/utils/request/api.js'
import {mapState} from 'vuex'
export default {
    name:'ArticleIndex',
    components:{

    },
    data() {
        return {
            articleData : {},
            comments :[],
            user:{},
            commentBody:'',
            userRequestCount:0
        }
    },
    computed:{
        articleSlug () {
            return this.$route.params.slum
        },
        ...mapState(['token'])
    },
    methods:{
       async getArticle(slug) {
            let { data } = await getArticle(slug);
            this.articleData = data.article;
        },
        async getComments(slug) {
            let { data } = await getComments(slug);
            this.comments = data.comments;
        },
        async addComments(slug,comment) {
            let { data } = await addComments(slug,comment);
            if(data) {
                getComments(this.articleSlug) 
            }
        },
        async deleteComments(slug,id) {
            let { data } = await deleteComments(slug,id);
            if(data) {
                getComments(this.articleSlug)
            }
        },
        async getUser() {
           try {
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
        async deleteArticle (slug) {
            let data = await deleteArticle(slug);
            data.status == 200 ? this.$router.push('/') : '';
        },
        onSubmit() {
            if(this.commentBody) {
                let comment = {'body':this.commentBody};
                addComments(this.articleSlug,{comment})
            }
        },
    },
    mounted () {
        this.getArticle(this.articleSlug)
        this.getComments(this.articleSlug)
        this.getUser()
    }
}
</script>
