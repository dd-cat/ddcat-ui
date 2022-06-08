import axios from 'axios'
import { Message, MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams } from '@/utils/ddcat'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?'
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName]
      var part = encodeURIComponent(propName) + '='
      if (value !== null && typeof (value) !== 'undefined') {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            url += subPart + encodeURIComponent(value[key]) + '&'
          }
        } else {
          url += part + encodeURIComponent(value) + '&'
        }
      }
    }
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.msg || errorCode['default']
    if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      if (res.data && res.data.code != 0) {
        Notification.error({
          title: res.data.msg
        })
      }
      return res.data
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('LogOut').then(() => {
              location.href = '/index'
            })
          }).catch(() => {
          })
      }
    }
    return Promise.reject(error.response.data.msg)   // 返回接口返回的错误信息
  }
)

// 通用下载方法
export function download(url, params, filename) {
  return service.post(url, params, {
    transformRequest: [(params) => {
      return tansParams(params)
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob'
  }).then((data) => {
    const content = data
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = filename
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, filename)
    }
  }).catch((r) => {
    console.error(r)
  })
}

export default service
