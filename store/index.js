const cookieparser = process.server ? require('cookieparser') : undefined

import Vuex from "vuex";

const store = new Vuex.Store({
    state : () => {
        return {
            // 当前登录的用户信息
            user: null,
            token:''
        }
    },
  getters: {
    getToken(state) {
      return state.token;
    },
  },

  mutations: {
    setToken(state, token) {
      state.token = token;
    },

    removeToken(state) {
      state.token = "";
    },
    setUser (state,user) {
        state.user = user
    }
  },

  actions: {
    nuxtServerInit ({commit},{req}) {
        let user = null
        if(req.headers.cookie) {
            const parsed = cookieparser.parse(req.headers.cookie)
            try {
                user = JSON.parse(parsed.user)
            } catch (err)
            {

            }
        }
        commit('setUser',user)
        if(user) commit('setToken',user.token)
    }
  }
});


// 需要返回一个函数
export default () => {
  return store;
};


// export const state = () => {
//     return {
//         // 当前登录的用户信息
//         user: null
//     }
// }

// export const mutations = {
//     setUser (state,user) {
//         state.user = user
//     }
// }

// export const actions = {
    
// }
