<template>
    <div>
        <!-- 查看详情弹窗 -->
        <el-dialog :visible.sync="detailPop" title="查看详情" class="center-dialog" width="90%">
            <el-table v-loading="listLoading" :data="billList" border style="width: 100%">
                <el-table-column prop="order_sn" label="订单号" align="center"  width="190"/>
                <el-table-column label="订单类型" align="center"  width="80">
                    <template slot-scope="{row}">
                        <span v-if="row.order_type == 0" >普通</span>
                        <span v-if="row.order_type == 1" >扫码</span>
                    </template>
                </el-table-column>
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
                const params = {
                    statistics_id: this.itemDetail.id,
                    page: this.listQuery.page,
                    size: this.listQuery.size
                }
                getMerchStatisticsDetailList(params).then(res => {
                    this.total = res.data.data.total
                    this.billList = res.data.data.data
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

</style>