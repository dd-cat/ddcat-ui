import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ddcat'

// 查询用户列表
export function listUser(data) {
  return request({
    url: '/user/page',
    method: 'post',
    data: data
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增修改用户
export function addOrUpdateUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/user/profile/avatar',
    method: 'post',
    data: data
  })
}
