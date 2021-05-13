<template>
    <div>
        <!-- 查看详情弹窗 -->
        <el-dialog :visible.sync="detailPop" title="查看详情" class="center-dialog" width="90%">
            <el-table v-loading="listLoading" :data="billList" border style="width: 100%">
                <el-table-column label="会员" align="left" width="220" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                        <div style="display:flex"> 
                            <img v-if="row.member_head_pic == '' || row.member_head_pic == null" src="@/assets/images/default_author_head.png" class="heder-img">
                            <img v-else :src="row.member_head_pic" class="heder-img">
                            <span class="member-name">{{row.member_nickname}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="过期积分" align="center" >
                    <template slot-scope="{row}">
                        <span>{{row.validly_score}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过期时间" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.validly_time}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
        </el-dialog>
    </div>
</template>

<script>
import { getWithdrawDetail} from '@/api/finance-manage/overdue-withdraw'
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
                    id: this.itemDetail.id,
                    page: this.listQuery.page,
                    size: this.listQuery.size
                }
                getWithdrawDetail(params).then(res => {
                    this.total = res.data.total
                    this.billList = res.data.data
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