import request from '@/utils/request'

// 查询角色列表
export function listRole() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

// 查询角色列表分页
export function pageRole(data) {
  return request({
    url: '/role/page',
    method: 'post',
    data: data
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/role/' + roleId,
    method: 'delete'
  })
}
