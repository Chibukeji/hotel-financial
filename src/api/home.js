import request from '@/utils/request'

// 操作日志
export function getLogList(data) {
    return request({
      url: '/log/list',
      method: 'get',
      params:data
    })
  }