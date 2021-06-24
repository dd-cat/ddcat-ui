import request from '@/utils/request'

export function hello(key, password) {
  return request({
    url: '/login/hello',
    method: 'get'
  })
}

// 登录方法
export function login(key, password) {
  return request({
    url: '/login/auth',
    method: 'post',
    data: { key, password }
  })
}

// 刷新方法
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/login/logout',
    method: 'delete'
  })
}
