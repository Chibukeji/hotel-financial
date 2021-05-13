import request from '@/utils/request'

// 列表
export function getWithdrawList(data) {
  return request({
    url: '/merch_withdraw/list',
    method: 'get',
    params: data
  })
}
// 详情
export function getWithdrawDetailList(data) {
  return request({
    url: '/merch_statistics/list',
    method: 'get',
    params: data
  })
}
//商家列表
export function getMerchList(data) {
  return request({
    url: '/searchMerch',
    method: 'get',
    params: data
  })
}
//审核
export function getMerchCheck(data) {
  return request({
    url: '/merch_withdraw/audit',
    method: 'post',
    data
  })
}
//打款
export function getMerchPayment(data) {
  return request({
    url: '/merch_withdraw/payment',
    method: 'post',
    data
  })
}
// 导出数据
export function orderWithdrawListExcel(data) {
  return request({
    url: '/merch_withdraw/exportExcel',
    method: 'get',
    params: data
  })
}
