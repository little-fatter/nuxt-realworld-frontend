<template>
    <div class="container">
        <div class="home-page">

            <div class="banner">
                <div class="container">
                <h1 class="logo-font">conduit</h1>
                <p>A place to share your knowledge.</p>
                </div>
            </div>

            <div class="container page">
                <div class="row">
                    <div class="col-md-9">
                        <div class="feed-toggle">
                            <ul class="nav nav-pills outline-active">
                                <li v-if="user" class="nav-item">
                                <a class="nav-link" @click="choosePannel('feed')" :class="pannelType == 'feed' ? 'active' : ''" href="#">Your Feed</a>
                                </li>
                                <li class="nav-item">
                                <a class="nav-link" @click="choosePannel('global')" :class="pannelType == 'global' ? 'active' : ''" href="#">Global Feed</a>
                                </li>
                                <li v-if="isTags" class="nav-item">
                                <a class="nav-link" :class="pannelType == 'tag' ? 'active' : ''" href="#">{{ tagName }}</a>
                                </li>
                            </ul>
                        </div>
                        <template v-if="articles.articles&&articles.articles.length > 0">
                            <div v-for="(article,index) in articles.articles" :key="'article'+index" class="article-preview">
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
                        

                        <nav>
                            <ul v-if="articles.articles&&articles.articles.length > 0" class="pagination">
                                <li 
                                    v-for="(item,index) in pageNum" 
                                    :key="'pageNum'+index" 
                                    :class="index==currentPage-1 ? 'active' : ''"  
                                    class="page-item ng-scope" 
                                    @click="changePage(index)"
                                >
                                    <a class="page-link ng-binding" href="#">
                                        {{ item }}
                                    </a>
                                </li>
                            </ul>
                        </nav>

                    </div>

                    <div class="col-md-3">
                        <div class="sidebar">
                        <p>Popular Tags</p>

                        <div class="tag-list">
                            <a v-for="(tag,index) in tags"  
                                :key="'tag'+index" 
                                href="#" 
                                class="tag-pill tag-default"
                                @click="chooseTag(tag)"
                            >
                            {{ tag }}
                            </a>
                        </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script>
import {getTags,listArticles,feedArticles,favoriteArticle,unfavoriteArticle} from '@/utils/request/api.js'
import { mapState } from 'vuex'
export default {
    name:'Home',
    components:{

    },
    computed:{
       ...mapState(['user']),
       pageNum () {
           let pageNum = Math.ceil(this.articles.articlesCount / this.pageSize)
           let pageNumList = []
           for(var a = 1;a<=pageNum;a++) {
                pageNumList.push(a)
           }
           return pageNumList
       }
    },
    data() {
        return {
            tags:[],
            articles:{},
            pannelType:this.user ? 'feed' : 'global',
            isTags: false,
            tagName:'',
            pageSize: 10,
            currentPage:1,
        }
    },
    methods:{
       async getTags() {
          const tags = await getTags()
            this.tags = tags.data.tags
        },
        async getArticles (params) {
          let articles = await listArticles(params)
            this.articles = articles.data
        },
        async feedArticles (params) {
            let articles = await feedArticles(params)
            this.articles = articles.data
        },
        chooseTag(tagName) {
            if(!this.isTags) this.currentPage = 1;
            this.isTags = true;
            this.pannelType = 'tag';
            this.tagName = '# '+tagName;
            let params = `?limit=${this.pageSize}&offset=${this.currentPage-1}&tag=${tagName}`;
            this.getArticles(params)
        },
        choosePannel(pannelType) {
            if(pannelType == this.pannelType) return ;
            this.isTags = false;
            this.pannelType = pannelType;
            this.currentPage = 1;
            if(pannelType == 'feed') {
               this.feedArticles(`?limit=${this.pageSize}&offset=${this.currentPage-1}`)
            }
            else if (pannelType == 'global') {
                this.getArticles (`?limit=${this.pageSize}&offset=${this.currentPage-1}`)
            }
        },
        changePage(index) {
            if(index== this.currentPage-1) return ;
            this.currentPage = index + 1;
            this.getArticles (`?limit=${this.pageSize}&offset=${this.currentPage-1}`)
        },
    },
    mounted () {
        this.getTags()
        let params = `?limit=${this.pageSize}&offset=${this.currentPage-1}`;
        if(this.tagName) {
            params += `&tag=${this.tagName}`
        }
        
        this.getArticles (params)
    }
}
</script>
