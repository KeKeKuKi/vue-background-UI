import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

// create an axios instance
export const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: false
})
let gateway = 'http://localhost:8600'


export const blogService = axios.create({
  baseURL: gateway + '/blog-server',
  withCredentials: false
})


export const authService = axios.create({
  baseURL: gateway + '/auth-server',
  withCredentials: false
})

// 权限接口服务拦截添加Token
let authServers = [request, authService, blogService]
authServers.forEach(i => {
  i.interceptors.request.use(
    config => {
      if (store.getters.token) {
        config.headers['token'] = getToken()
      }
      return config
    },
    error => {
      console.log(error, "统一请求拦截")
      return Promise.reject(error)
    }
  )
})

// 拦截捕获异常
let responseServers = [request, authService, blogService]
responseServers.forEach(i => {
  i.interceptors.response.use(
    response => {
      console.log(response, "统一response拦截")
      // return response
      // const res = response.data
      if (response.data.codeSuccess) {
        return response
      }else {
        Message({
          message: response.data.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(response))
      }
    },
    error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  )
})
