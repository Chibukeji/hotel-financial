<template>
  <div class="home-page">
    <div class="right-box">
      <div class="title">
        操作日志
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="ID" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <span class="desc-box-div" >{{ row.text }}</span>
            <!-- @click="detailHandle(row)" -->
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    </div>
    <!-- 日志详情弹窗 -->
    <el-dialog  :visible.sync="logDialogVisible" title="操作详情" width="30%">
      <div>{{itemDetail.text}}</div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getLogList } from '@/api/home'

export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        size: 10,
      },
      total: 0,
      listLoading: false,
      list: [],
      logDialogVisible:false,
      itemDetail:'',
    }
  },
  mounted () {
    this.getLog();
  },
  methods: {
    //获取操作日志
    getLog(){
      getLogList(this.listQuery).then(res=>{
        this.list = res.data.data.data
        this.total = res.data.data.total
      })
    },
    // 翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getLog()
    },
    //操作详情
    detailHandle(row){
      this.logDialogVisible = true
      this.itemDetail = row
    }
  },
}
</script>

<style lang="scss" scoped>
.home-page{
  .title{
      border-left: 4px solid #409eff;
      padding-left: 10px;
      margin-bottom: 20px;
      font-size: 14px;
    }
}
.desc-box-div{
  // width: 100%;
  // white-space:nowrap;
  // overflow:hidden;
  // text-overflow: ellipsis;
  cursor: pointer;
  color: #409eff;
}
/deep/.el-dialog__wrapper {
    overflow: auto; 
}
</style>
