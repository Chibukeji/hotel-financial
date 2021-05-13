<template>
  <div>
    <div class="filter-container">
      <span class="filter-item">
        <span class="select-title">时间范围：</span>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 280px"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
        />
      </span>
      <span class="filter-item">
        <span class="select-title">酒店：</span>
        <el-select  v-model="listQuery.hotel_id" filterable clearable  remote placeholder="请输入酒店关键字搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" >
          <el-option v-for="item in hotelList" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </span>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '118')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('1')">全部导出</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '119')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
    </div>
    <div style="height:155px;margin-bottom:30px;">
      <el-row class="card-wrap">
        <el-col class="card-box">
          <el-card shadow="never" class="bank-card">
            <div class="bank-header">
              <span>今日订单</span>
              <!-- <p>￥{{ all_total.common_amount }}</p> -->
            </div>
            <div class="bank">
              <span>
                普通订单
                <p>￥{{ today_total.common_amount }}</p>
              </span>
            </div>
            <div class="bank">
              <span>
                分时订单
                <p>￥{{ today_total.time_share_amount }}</p>
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col class="card-box">
          <el-card shadow="never" class="bank-card">
            <div class="bank-header">
              <span>昨日订单</span>
              <!-- <p>￥{{ totalYesterdayDataOrder.total }}</p> -->
            </div>
            <div class="bank">
              <span>
                普通订单
                <p>￥{{ yesterday_total.common_amount }}</p>
              </span>
            </div>
            <div class="bank">
              <span>
                分时订单
                <p>￥{{ yesterday_total.time_share_amount }}</p>
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col class="card-box">
          <el-card shadow="never" class="bank-card">
            <div class="bank-header">
              <span>本月订单</span>
              <!-- <p>￥{{ totalMonthDataOrder.total }}</p> -->
            </div>
            <div class="bank">
              <span>
                普通订单
                <p>￥{{ month_total.common_amount }}</p>
              </span>
            </div>
            <div class="bank">
              <span>
                分时订单
                <p>￥{{ month_total.time_share_amount }}</p>
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col class="card-box">
          <el-card shadow="never" class="bank-card">
            <div class="bank-header">
              <span>本年订单</span>
              <!-- <p>￥{{ totalYearDataOrder.total }}</p> -->
            </div>
            <div class="bank">
              <span>
                普通订单
                <p>￥{{ year_total.common_amount }}</p>
              </span>
            </div>
            <div class="bank">
              <span>
                分时订单
                <p>￥{{ year_total.time_share_amount }}</p>
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col class="card-box">
          <el-card shadow="never" class="bank-card">
            <div class="bank-header">
              <span>累计订单</span>
              <!-- <p>￥{{ totalSumDataOrder.total }}</p> -->
            </div>
            <div class="bank">
              <span>
                普通订单
                <p>￥{{ all_total.common_amount }}</p>
              </span>
            </div>
            <div class="bank">
              <span>
                分时订单
                <p>￥{{ all_total.time_share_amount }}</p>
              </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="酒店" align="left">
        <template slot-scope="{row}">
          <span>{{ row.hotel_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单完成日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="普通订单数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.common_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="普通订单金额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.common_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分时订单数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time_share_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分时订单金额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time_share_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="btnAry.findIndex(x => x.id == '120')!=-1" label="操作" align="center" width="120">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="detailList(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <!--详情-->
    <el-dialog :title="detailTitle" :visible.sync="detailVisible" class="center-dialog" width="90%">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="普通订单" name="0" />
        <el-tab-pane label="分时订单" name="1" />
      </el-tabs>
      <el-table :data="dataDetail" border style="width: 100%;margin-top:20px">
        <el-table-column label="订单号" align="center" width="190">
          <template slot-scope="{row}">
            <span>{{ row.order_sn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="酒店房型" align="left"  :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <span>{{ row.order_title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.link_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.link_phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单日期" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用日期" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.use_start_date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="离店日期" align="center" width="160">
          <template slot-scope="{row}">
            <span v-if="row.finish_time == null || row.finish_time == ''">-</span>
            <span v-else>{{ row.finish_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.total_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总价" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.total_price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="use_score" label="使用积分" width="80" align="center" />
        <el-table-column label="实收金额" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.pay_total_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="酒店结算" align="center" width="100">
          <template slot-scope="{row}">
            <span v-if="row.hotel_money == null || row.hotel_money == ''">-</span>
            <span v-else>{{ row.hotel_money }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pay_type" label="支付方式" width="120" align="center" />
        <el-table-column label="订单状态" align="center" width="130">
          <template slot-scope="{row}">
            <span v-if="row.status == 0">待处理</span>
            <span v-if="row.status == 1">待付款</span>
            <span v-if="row.status == 2">待酒店接受</span>
            <span v-if="row.status == 3">订单取消</span>
            <span v-if="row.status == 4">已退款</span>
            <span v-if="row.status == 5">已接受待入住</span>
            <span v-if="row.status == 6">已入住</span>
            <span v-if="row.status == 7">交易完成</span>
            <span v-if="row.status == 8">退款申请</span>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="center"  width="80">
          <template slot-scope="{row}">
              <span v-if="row.order_type == 0" >普通</span>
              <span v-if="row.order_type == 1" >扫码</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="detailForm.total" :page.sync="detailForm.page" :limit.sync="detailForm.size" :autoScroll='false'  @pagination="getDetailListPage" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getOrderStatisticsList, getTotalByDateList, orderStatisticsExportExcel,getMemberOrderList,getHotelList } from '@/api/finance-manage/data-statistics'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      dateRange: [],
      hotelList: [],
      listQuery: {
        page: 1,
        size: 20,
        hotel_id: '',
        start_time: '',
        end_time: ''
      },
      total: 0,
      listLoading: false,
      list: [],
      all_total: {
        common_amount: 0,
        time_share_amount: 0
      },
      month_total: {
        common_amount: 0,
        time_share_amount: 0
      },
      today_total: {
        common_amount: 0,
        time_share_amount: 0
      },
      year_total: {
        common_amount: 0,
        time_share_amount: 0
      },
      yesterday_total: {
        common_amount: 0,
        time_share_amount: 0
      },
      detailForm: {
        total: 0,
        page: 1,
        size: 10
      },
      detailVisible: false,
      detailId: '',
      sumData: {
        amount_total: 0,
        settlement_total: 0,
        profit_total: 0
      },
      dataDetail: [],
      detailTitle: '',
      activeName: '0',
      exportAllloading: false,
      loadingSearch:false,
      btnAry:[]
    }
  },
  mounted() {
    this.getList()
    this.getTotalByDate()
    this.$store.dispatch('user/showBtn', { id: 60 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      getOrderStatisticsList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
     //刷新
    refresh(){
      this.listQuery = {
        page: 1,
        size: 20,
        hotel_id: '',
        start_time: '',
        end_time: ''
      }
      this.dateRange = []
      this.getList();
      this.getTotalByDate()
    },
    // 获取统计数据
    getTotalByDate() {
      getTotalByDateList().then(res => {
        this.all_total = res.data.all_total
        this.month_total = res.data.month_total
        this.today_total = res.data.today_total
        this.year_total = res.data.year_total
        this.yesterday_total = res.data.yesterday_total
      })
    },
    // 搜索商家
    remoteMethod(query) {
      if (query == '' || query == null) {
        this.hotelList = []
      } else {
        this.loadingSearch = true
        getHotelList({ name: query, page: 1, size: 9999,}).then(res => {
          this.loadingSearch = false
          this.hotelList = res.data
        })
      }
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getList()
    },
    // 查看明细
    detailList(row) {
      this.detailVisible = true
      if (row != undefined) {
        this.detailId = row.id
        this.detailForm.page = 1
        this.detailTitle = row.time + '-详情'
      }
      const params = {
        order_ids: this.detailId,
        is_time_division: this.activeName,
        page: this.detailForm.page,
        size: this.detailForm.size
      }
      getMemberOrderList(params).then(res => {
        // console.log(res)
        this.dataDetail = res.data.data.data
        this.detailForm.total = res.data.data.total
      })
    },
    handleClick() {
      this.detailForm.page = 1
      this.detailList()
    },
    // 明细翻页
    getDetailListPage(val) {
      if (val !== undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.detailForm.page = parseInt(json.page)
        this.detailForm.size = parseInt(json.limit)
      }
      this.detailList()
    },
    // 导出数据
    exportTable(flag) {
      let params
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] / 1000
        this.listQuery.end_time = this.dateRange[1] / 1000
      }
      if (flag == '1') {
        this.exportAllloading = true
        params = {
          hotel_id: this.listQuery.hotel_id,
          start_time: this.listQuery.start_time,
          end_time: this.listQuery.end_time
        }
      } else {
        params = this.listQuery
      }
      orderStatisticsExportExcel(params).then(res => {
        // console.log(res)
        this.exportAllloading = false
        if (res.code == 0) {
          window.open(res.data)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrap {
  display: flex;
  justify-content: space-between;
  .card-box {
    // width:20%
    flex: 1;
    margin-right: 12px;
  }
  .card-box:last-child {
    margin-right: 0px;
  }
}
.bank-card {
  background-color: #f0f2f5;
  height: 165px;
}
.bank-header {
  width: 100%;
  font-size: 17px;
  margin-right: 2%;
}
.bank-header p {
  color: blue;
  font-size: 25px;
  line-height: 0px;
}
.bank {
  width: 45%;
  float: left;
  font-size: 12px;
  margin-right: 2%;
  margin-top: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bank p {
  color: blue;
  font-size: 14px;
}
.link-type{
  color: blue;
}
</style>
