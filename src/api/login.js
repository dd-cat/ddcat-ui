import request from '@/utils/request'

// 登录方法
export function login(key, password) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { key, password }
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
    url: '/auth/logout',
    method: 'delete'
  })
}
