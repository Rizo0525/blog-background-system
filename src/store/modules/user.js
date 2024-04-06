import { loginApi, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: '',
    name: '',
    avatar: '',
    user: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER: (state,payload)=>{
    state.user = payload
  }
}


const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {

      loginApi(userInfo).then(response => {
        // console.log(response)
        const { data } = response
        // console.log("data:", data)
        if (data) {
          commit('SET_USER',data)
          // console.log(response)
          // commit('SET_TOKEN', data.token)
          // setToken(data.token)
          setTimeout(()=>{
            resolve()
          },1000)
        }else {
          reject(response)
        }
      }).catch(error => {
        reject(error)
      })

    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(localStorage.getItem('adminToken')).then(response => {
        if(typeof response === 'string'){
          //验证失败
          response = JSON.parse(response)
          if(response.code === 401){
            reject(response.msg)
          }else{
            reject(response.msg)
          }
        }else{
          commit('SET_USER',response.data)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('adminToken')
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // localStorage.removeItem('adminToken')
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}