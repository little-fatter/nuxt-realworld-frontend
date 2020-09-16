<template>
    <div class="container">
        <div class="profile-page">

            <div class="user-info">
                <div class="container">
                <div class="row">

                    <div class="col-xs-12 col-md-10 offset-md-1">
                    <img :src="profile.image" class="user-img" />
                    <h4>{{ profile.username }}</h4>
                    <p v-if="profile.bio">
                        {{ profile.bio }}
                    </p>
                    <button v-if="profile.username != user.username" class="btn btn-sm btn-outline-secondary action-btn">
                        <i class="ion-plus-round"></i>
                        &nbsp;
                        Follow {{ profile.username }}
                    </button>
                    </div>

                </div>
                </div>
            </div>

            <div class="container">
                <div class="row">

                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="articles-toggle">
                    <ul class="nav nav-pills outline-active">
                        <li class="nav-item">
                        <a class="nav-link" :class="{ 'active': flag == 'myArticles'}" @click="changePannel('myArticles')" href="#">My Articles</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" :class="{ 'active': flag == 'favoriteArticles'}" href="#" @click="changePannel('favoriteArticles')">Favorited Articles</a>
                        </li>
                    </ul>
                </div>

                <div v-show="flag == 'favoriteArticles'">
                    <template v-if="favoriteArticles.articles&&favoriteArticles.articles.length > 0">
                        <div v-for="(article,index) in favoriteArticles.articles" :key="'article'+index" class="article-preview">
                            <div class="article-meta">
                                <nuxt-link :to="'/profile/'+article.author.username"><img :src="article.author.image" /></nuxt-link>
                                <div class="info">
                                <nuxt-link :to="'/profile/'+article.author.username" class="author">{{ article.author.username }}</nuxt-link>
                                <span class="date">{{ article.createdAt }}</span>
                                </div>
                                <button 
                                    class="btn btn-sm pull-xs-right" 
                                    :class="article.favorited ? 'btn-primary' : 'btn-outline-primary'"
                                >
                                <i class="ion-heart"></i> {{ article.favoritesCount }}
                                </button>
                            </div>
                            <nuxt-link :to="'/article/'+article.slug" class="preview-link">
                                <h1>{{ article.title }}</h1>
                                <p>{{ article.description }}</p>
                                <span>Read more...</span>
                            </nuxt-link>
                        </div>
                    </template>
                    <template v-else>
                        <div class="article-preview" >
                            No articles are here... yet.
                        </div>
                    </template>
                </div>
                <div v-show="flag == 'myArticles'">
                    <template v-if="myArticles.articles&&myArticles.articles.length > 0">
                        <div v-for="(article,index) in myArticles.articles" :key="'article'+index" class="article-preview">
                            <div class="article-meta">
                                <nuxt-link :to="'/profile/'+article.author.username"><img :src="article.author.image" /></nuxt-link>
                                <div class="info">
                                <nuxt-link :to="'/profile/'+article.author.username" class="author">{{ article.author.username }}</nuxt-link>
                                <span class="date">{{ article.createdAt }}</span>
                                </div>
                                <button 
                                    class="btn btn-sm pull-xs-right" 
                                    :class="article.favorited ? 'btn-primary' : 'btn-outline-primary'"
                                >
                                <i class="ion-heart"></i> {{ article.favoritesCount }}
                                </button>
                            </div>
                            <nuxt-link :to="'/article/'+article.slug" class="preview-link">
                                <h1>{{ article.title }}</h1>
                                <p>{{ article.description }}</p>
                                <span>Read more...</span>
                            </nuxt-link>
                        </div>
                    </template>

                    <template v-else>
                        <div class="article-preview" >
                            No articles are here... yet.
                        </div>
                    </template>
                </div>

                </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script>
import {getProfile,listArticles,getUser} from '@/utils/request/api.js'
export default {
    middleware :'authenticated',
    name:'Profile',
    components:{

    },
    props:{},
    data() {
        return {
            favoriteArticles : {},
            myArticles : {},
            currentUser : this.$route.params.username,
            pageSize: 10,
            currentPage:1,
            profile: {},
            user:'',
            flag: 'myArticles',
            userRequestCount:0
        }
    },
    methods:{
        async getFavoriteArticles (params) {
            let { data } = await listArticles(params)
            this.favoriteArticles = data
        },
        async getMyArticles (params) {
            let { data } = await listArticles(params)
            this.myArticles = data
        },
        async getProfile () {
            let { data } = await getProfile(this.currentUser)
            this.profile = data.profile;
        },
        async getUser() {
           try {
               let { data } = await getUser();
               this.user = data.user;
            this.getMyArticles( `?limit=${this.pageSize}&offset=${this.currentPage-1}&author=${this.user.username}`)
           } catch (err) {
               if(this.userRequestCount >50) {
                    console.log(err)
                    return
               }
               this.getUser()
           }
        },
        changePannel(flag) {
            if(flag === this.flag) return ;
            this.flag = flag;
        }
    },
    mounted () {
        this.getFavoriteArticles( `?limit=${this.pageSize}&offset=${this.currentPage-1}&favorited=${this.currentUser}`)
        this.getProfile()
        this.getUser()
    }
}
</script>
