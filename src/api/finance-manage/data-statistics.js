import request from '@/utils/request'

// 列表
export function getOrderStatisticsList(data) {
  return request({
    url: '/order_statistics/list',
    method: 'get',
    params: data
  })
}
// 统计数据
export function getTotalByDateList(data) {
  return request({
    url: '/order_statistics/totalByDate',
    method: 'get',
    params: data
  })
}
//获取酒店列表
export function getHotelList(data) {
  return request({
    url: '/searchHotel',
    method: 'get',
    params: data
  })
}
//查看订单详情
export function getMemberOrderList(data) {
  return request({
    url: '/order/list',
    method: 'get',
    params: data
  })
}
// 导出数据
export function orderStatisticsExportExcel(data) {
  return request({
    url: '/order_statistics/exportExcel',
    method: 'get',
    params: data
  })
}