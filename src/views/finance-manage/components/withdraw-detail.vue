<template>
    <div>
        <!-- 查看详情弹窗 -->
        <el-dialog :visible.sync="detailPop" title="查看详情" class="center-dialog" width="90%">
            <el-table v-loading="listLoading" :data="billList" border style="width: 100%">
                <!-- <el-table-column prop="order_sn" label="订单号" align="center"  width="190"/>
                <el-table-column prop="hotel_name" label="酒店" align="left" />
                <el-table-column prop="order_amount" label="订单金额" width="100" align="center" />
                <el-table-column prop="settle_amount" label="应结算金额" width="100" align="center" />
                <el-table-column prop="rate" label="分佣比例" width="100" align="center" />
                <el-table-column label="结算状态" width="100" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status ==1">未结算</span>
                    <span v-if="scope.row.status ==2">已结算</span>
                </template>
                </el-table-column>
                <el-table-column label="时间" width="160" align="center">
                <template slot-scope="{row}">
                    <span v-if="row.create_time==null || row.create_time==''">-</span>
                    <span v-else>{{ row.create_time }}</span>
                </template>
                </el-table-column> -->
                <el-table-column label="订单号" fixed align="center" width="190">
                    <template slot-scope="{row}">
                    <span>{{ row.order_sn }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单类型" align="center"  width="80">
                    <template slot-scope="{row}">
                        <span v-if="row.order_type == 0" >普通</span>
                        <span v-if="row.order_type == 1" >扫码</span>
                    </template>
                </el-table-column>
                <el-table-column label="结算状态" width="100" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status ==1">未结算</span>
                        <span v-if="scope.row.status ==2">已结算</span>
                    </template>
                </el-table-column>
                <el-table-column label="酒店名称" align="left" >
                    <template slot-scope="{row}">
                    <span>{{row.order_title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="会员" align="left"  width="180" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                    <div style="display:flex">
                        <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                        <img v-else :src="row.member_head_pic" class="heder-img">
                        <span class="member-name">{{row.member_nickname}}</span>
                    </div>
                    </template>
                </el-table-column>
                <el-table-column label="联系电话" align="center" width="110">
                    <template slot-scope="{row}">
                    <span>{{row.link_phone}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="下单日期/离店日期" align="center" width="160">
                    <template slot-scope="{row}">
                    <div>{{ row.create_time }}</div>
                    <div>
                        <span v-if="row.finish_time == null || row.finish_time == ''">-</span>
                        <span v-else>{{row.finish_time}}</span>
                    </div>
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="center" width="100">
                    <template slot-scope="{row}">
                    <div>{{row.total_num}}间房</div>
                    <div>{{row.booking_num}}晚</div>
                    </template>
                </el-table-column>
                <el-table-column label="总价" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{row.total_price}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实收金额" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{row.order_amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="酒店结算" align="center" width="80">
                    <template slot-scope="{row}">
                    <span v-if="row.hotel_money == null || row.hotel_money == ''">-</span>
                    <span v-else>{{row.hotel_money}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="平台佣金" align="center" width="80">
                    <template slot-scope="{row}">
                    <span v-if="row.platform_commission == null || row.platform_commission == ''">-</span>
                    <span v-else>{{row.platform_commission}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_type" label="支付方式" width="100" align="center" />
                <el-table-column label="订单状态" align="center" width="120">
                    <template slot-scope="{row}">
                        <span v-if="row.order_status == 0" >待处理</span>
                        <span v-if="row.order_status == 1" >待付款</span>
                        <span v-if="row.order_status == 2" >待酒店接受</span>
                        <span v-if="row.order_status == 3" >订单取消</span>
                        <span v-if="row.order_status == 4" >已退款</span>
                        <span v-if="row.order_status == 5" >已接受待入住</span>
                        <span v-if="row.order_status == 6" >已入住</span>
                        <span v-if="row.order_status == 7" >交易完成</span>
                        <span v-if="row.order_status == 8" >退款申请</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
        </el-dialog>
    </div>
</template>

<script>
import { getMerchStatisticsDetailList} from '@/api/finance-manage/hotel-statistics'
import Pagination from "@/components/Pagination"; // 分页

    export default {
        components: { Pagination},
        data() {
            return {
                detailPop: false,
                listLoading:false,
                billList:[],
                listQuery: {
                    page: 1,
                    size: 10
                },
                total:0,
                itemDetail:'',
            }
        },
        methods: {
            init(row){
                this.detailPop = true
                this.itemDetail = row
                this.listQuery.page = 1
                this.getList()
            },
            getList(){
                this.listLoading = true
                const params = {
                    statistics_id: this.itemDetail.id,
                    page: this.listQuery.page,
                    size: this.listQuery.size
                }
                getMerchStatisticsDetailList(params).then(res => {
                    this.total = res.data.data.total
                    this.billList = res.data.data.data
                    this.listLoading = false
                })
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
        },
    }
</script>

<style lang="scss" scoped>
.heder-img{
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.member-name{
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 5px;
}
</style>