import request from '@/utils/request'

// 列表
export function getWithdrawList(data) {
  return request({
    url: '/score_withdraw/list',
    method: 'get',
    params: data
  })
}
// 结算单明细
export function getWithdrawDetailList(data) {
  return request({
    url: '/divtime_expire/list',
    method: 'get',
    params: data
  })
}
// 结算单详情
export function getWithdrawDetail(data) {
  return request({
    url: '/divtime_expire/detail',
    method: 'get',
    params: data
  })
}
//审核
export function getMerchCheck(data) {
  return request({
    url: '/score_withdraw/audit',
    method: 'post',
    data
  })
}
//打款
export function getMerchPayment(data) {
  return request({
    url: '/score_withdraw/payment',
    method: 'post',
    data
  })
}
// 导出数据
export function orderWithdrawListExcel(data) {
  return request({
    url: '/score_withdraw/exportExcel',
    method: 'get',
    params: data
  })
}
