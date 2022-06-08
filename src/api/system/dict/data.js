import request from '@/utils/request'

// 查询字典数据列表
export function listData(data) {
  return request({
    url: '/dict/item/page',
    method: 'post',
    data: data
  })
}

// 查询字典数据详细
export function getData(ids) {
  return request({
    url: '/dict/item/' + ids,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/dict/item/type/' + dictType,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/dict/item',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/dict/item',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(ids) {
  return request({
    url: '/dict/item/' + ids,
    method: 'delete'
  })
}
