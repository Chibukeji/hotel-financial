import Layout from '@/layout'

const financeRouter = {
  path: '/finance',
  component: Layout,
  redirect: '/finance/data-statistics',
  alwaysShow: true,
  id: 59,
  name: 'finance',
  meta: {
    title: '财务统计',
    icon: 'excel'
  },
  children: [
    {
      path: 'data-statistics',
      component: () => import('@/views/finance-manage/data-statistics'),
      name: 'data-statistics',
      id: 60,
      meta: { title: '数据统计' }
    },
    {
      path: 'hotel-statistics',
      component: () => import('@/views/finance-manage/hotel-statistics'),
      name: 'hotel-statistics',
      id: 61,
      meta: { title: '商家统计' }
    },
    {
      path: 'hotel-withdraw',
      component: () => import('@/views/finance-manage/hotel-withdraw'),
      name: 'hotel-withdraw',
      id: 62,
      meta: { title: '商家提现单' }
    },
    {
      path: 'overdue-withdraw',
      component: () => import('@/views/finance-manage/overdue-withdraw'),
      name: 'overdue-withdraw',
      id: 159,
      meta: { title: '分时过期提现单' }
    },
    // {
    //   path: 'commission-withdraw',
    //   component: () => import('@/views/finance-manage/commission-withdraw'),
    //   name: 'commission-withdraw',
    //   id: 159,
    //   meta: { title: '分佣提现单' }
    // }
  ]
}

export default financeRouter
