import request from '@/utils/request'

// 列表
export function getMerchStatisticsList(data) {
  return request({
    url: '/merch_statistics/list',
    method: 'get',
    params: data
  })
}
// 统计数据
export function getTotalStatisticsList(data) {
  return request({
    url: '/merch_statistics/totalStatistics',
    method: 'get',
    params: data
  })
}
// 查看详情
export function getMerchStatisticsDetailList(data) {
  return request({
    url: '/merch_commission/list',
    method: 'get',
    params: data
  })
}
// 导出数据
export function orderStatisticsExportExcel(data) {
  return request({
    url: '/merch_statistics/exportExcel',
    method: 'get',
    params: data
  })
}
