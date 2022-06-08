import request from '@/utils/request'

// 查询字典类型列表
export function listType() {
  return request({
    url: '/dict/list',
    method: 'get'
  })
}

// 查询字典类型列表分页
export function pageType(data) {
  return request({
    url: '/dict/page',
    method: 'post',
    data: data
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/dict/' + dictId,
    method: 'get'
  })
}

// 新增or修改字典类型
export function addType(data) {
  return request({
    url: '/dict',
    method: 'post',
    data: data
  })
}

// 删除字典类型
export function delType(dictId) {
  return request({
    url: '/dict/' + dictId,
    method: 'delete'
  })
}

// 清理参数缓存
export function clearCache() {
  return request({
    url: '/dict/type/clearCache',
    method: 'delete'
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/dict/type/optionselect',
    method: 'get'
  })
}
