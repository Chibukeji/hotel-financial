<template>
  <div class="mixin-components-container">
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
        <span class="select-title">商家：</span>
         <el-select  v-model="listQuery.merch_id" filterable clearable  remote placeholder="请输入商家关键字搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" >
          <el-option v-for="item in merchantList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </span>
      <span class="filter-item">
        <span class="select-title">状态：</span>
        <el-select v-model="listQuery.status" placeholder="状态" style="width: 160px">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </span>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '126')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('1')">全部导出</el-button>
      <el-button v-if="btnAry.findIndex(x => x.id == '127')!=-1" class="filter-item" type="primary" size="mini" @click="exportTable('2')">按页导出</el-button>
    </div>
    <div style="margin-bottom:20px">
      <el-tabs v-model="listQuery.status" type="card" @tab-click="handleFilter">
        <el-tab-pane v-for="(item,index) in statusList" :key="index" :label="item.name" :name="item.id"></el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="60" prop="id" />
        <el-table-column align="center" label="结算时间" width="220" >
              <template slot-scope="{row}">
                <span >{{row.time}}</span>
              </template>
          </el-table-column>
        <el-table-column align="left" label="商家"  prop="merch_name" />
        <el-table-column align="center" label="提现金额" width="140" prop="withdraw_amount" />
        <el-table-column align="center" label="总金额" width="140" prop="all_amount" />
        <el-table-column align="center" label="实收金额" width="140" prop="total_amount" />
        <el-table-column align="center" label="酒店结算金额" width="140" prop="hotel_amount" />
        <!-- <el-table-column label="收款人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.bank_acount_name }}</span>
            <span v-if="row.type==1">-{{ row.bank_card_number }}-</span>
            <span v-if="row.type==1">{{ row.bank_name }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="收款方式" align="center" width="140">
          <template slot-scope="{row}">
            <span v-if="row.type==1">银行</span>
            <span v-if="row.type==2">支付宝</span>
            <span v-if="row.type==3">微信</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="140">
          <template slot-scope="{row}">
            <span v-if="row.status==0">提交中</span>
            <span v-if="row.status==1">审核通过</span>
            <span v-if="row.status==2" style="color:red">审核未通过</span>
            <span v-if="row.status==3">已打款</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" width="200">
          <template slot-scope="{row}">
            <span v-if="row.audit_description==null || row.audit_description==''">-</span>
            <span v-else>{{ row.audit_description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==1 && btnAry.findIndex(x => x.id == '128')!=-1" type="primary" size="mini" @click="remitList(scope.row)">打款</el-button>
            <el-button v-if="(scope.row.status==0 ||scope.row.status==2 ) && btnAry.findIndex(x => x.id == '129')!=-1" type="primary" size="mini" @click="checkList(scope.row)">审核</el-button>
            <el-button v-if="btnAry.findIndex(x => x.id == '130')!=-1" type="primary" size="mini" @click="detailList(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>
    <!--明细-->
    <el-dialog :title="detailTitle" :visible.sync="detailVisible" class="center-dialog" width="90%">
      <el-tabs v-model="activeName">
        <el-tab-pane label="提现详细" name="first">
          <div class="order-detail">
            <div class="second-line commont-border">
              <div class="left-box item-box">
                <span class="title-name">打款金额:</span>
                <span>
                  <div class="item-money first-item">
                    <span class="final-statement">￥{{billDetail.withdraw_amount}}</span>
                    <span class="final-statement"></span>
                  </div>
                  <div class="item-money">
                    <span>提现金额：</span>
                    <span>{{billDetail.withdraw_amount}}</span>
                  </div>
                  <div class="item-money" v-if="billDetail.status==3">
                    <span class="remit-title">打款凭证：</span>
                    <!-- <img :src="billDetail.pay_image" class="remit-img"> -->
                     <el-image :src="billDetail.pay_image" :preview-src-list="srcList" class="remit-img"></el-image>
                  </div>
                </span>
              </div>
              <div class="left-box item-box">
                <span class="title-name">打款方式:</span>
                <span>
                  <div class="item-money first-item">
                    <span v-if="billDetail.type==1" class="bank-card">银行</span>
                    <span v-if="billDetail.type==2" class="bank-card">支付宝</span>
                    <span v-if="billDetail.type==3" class="bank-card">微信</span>
                  </div>
                   <div v-if="billDetail.type==1">
                    <div class="item-money">
                      <span>姓名：</span>
                      <span>{{billDetail.bank_acount_name}}</span>
                    </div>
                    <div class="item-money"  v-if="billDetail.type==1">
                      <span>卡号：</span>
                      <span>{{billDetail.bank_card_number}}</span>
                    </div>
                    <div class="item-money"  v-if="billDetail.type==1">
                      <span>银行：</span>
                      <span>{{billDetail.bank_name}}</span>
                    </div>
                  </div>
                  <div v-if="billDetail.type==2">
                    <div class="item-money">
                      <span>支付宝账号：</span>
                      <span>{{billDetail.alipay_account}}</span>
                    </div>
                    <div class="item-money">
                      <span>支付宝账户姓名：</span>
                      <span>{{billDetail.alipay_account_name}}</span>
                    </div>
                  </div>
                  <div v-if="billDetail.type==3">
                    <div class="item-money">
                      <span>微信账号：</span>
                      <span>{{billDetail.wechat_account}}</span>
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div class="no-withdraw-deposit-box">
              <div class="no-withdraw-deposit-btn">
                <span v-if="billDetail.status==0" class="no-pay-btn">提交中</span>
                <span v-if="billDetail.status==1" class="no-pay-btn">通过</span>
                <span v-if="billDetail.status==2" class="no-pay-btn">未通过</span>
                <span v-if="billDetail.status==3" class="alredy-pay-btn">已打款</span>
                <el-button v-if="billDetail.status==1" @click="remitList(billDetail)" type="success">打款</el-button>
                <el-button v-if="billDetail.status==0" @click="checkList(billDetail)" type="success">审核</el-button>
              </div>
              <div class="margin-10" v-if="billDetail.status==3">
                <span>申请商家：</span>
                <span>{{billDetail.merch_name}}</span>
              </div>
              <div class="margin-10" v-if="billDetail.status==3">
                <span>打款时间：</span>
                <span>{{billDetail.finish_time}}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="结算单明细" name="second">
          <el-table :data="dataDetail" border style="width: 100%;margin-top:30px" >
            <el-table-column label="日期" prop="time" align="center" />
            <el-table-column align="left" label="酒店"  prop="hotel_name" />
            <el-table-column label="总金额" prop="all_amount" align="center" />
            <el-table-column label="实收金额" align="center" prop="total_amount"  />
            <el-table-column label="酒店结算金额" align="center" prop="hotel_amount"  />
            <el-table-column label="状态" align="center" width="140">
              <template slot-scope="{row}">
                <span v-if="row.status==0">未提现</span>
                <span v-if="row.status==1" >提现审核中</span>
                <span v-if="row.status==2" >已提现</span>
                <span v-if="row.status==3" style="color:red">未通过</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="130">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="dayDetailList(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="DetailTotal" :page.sync="detailForm.page" :limit.sync="detailForm.size" :autoScroll='false' @pagination="getDetailData" />
        </el-tab-pane>
        <el-tab-pane v-if="detailStatus ==3" label="打款明细" name="third">
          <el-table :data="remitDetail" border style="width: 100%;margin-top:30px">
            <el-table-column label="打款时间" prop="finish_time" align="center" />
            <el-table-column label="金额" prop="withdraw_amount" align="center" />
            <el-table-column label="状态" align="center">
              <template slot-scope="{row}">
                <span v-if="row.status==3">已打款</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 审核弹窗 -->
    <el-dialog :title="checkTitle" :visible.sync="checkVisible"  width="40%">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="120px" style="width:80%;">
        <el-form-item label="审核" prop="status">
          <el-radio-group v-model="editForm.status" style="width:100%;text-align: left;">
            <el-radio label="1">通过</el-radio>
            <el-radio label="0">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="editForm.status == 0" label="原因" prop="desc">
          <el-input v-model="editForm.desc" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button size="small" @click="checkVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="checkSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 打款弹窗 -->
    <el-dialog :title="remitTitle" :visible.sync="remitVisible"  width="40%">
      <el-form ref="remitForm" :rules="remitRules" :model="remitForm" label-position="left" label-width="120px" style="width:80%;">
        <el-form-item label="打款凭证" prop="pay_image">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          :multiple="false"
          :action="uploadUrl"
          name="image"
          :headers="headers"
          :on-success="addUploadImgSuccess"
          list-type="picture"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="remitForm.pay_image" :src="remitForm.pay_image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      </el-form>
      <div class="pop-btn-box">
        <el-button size="small" @click="remitVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="remitSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 详情弹窗 -->
    <withdraw-detail ref="withdrawDetailChild" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // 分页
import { getWithdrawList, getWithdrawDetailList, orderWithdrawListExcel,getMerchList,getMerchCheck,getMerchPayment } from '@/api/finance-manage/hotel-withdraw'
import mix from '@/mixs/mix'
import WithdrawDetail from './components/withdraw-detail'

export default {
  components: { Pagination,WithdrawDetail },
  mixins: [mix],
  data() {
    return {
      dateRange: [],
      hotelList: [],
      statusList: [
        { name: '全部', id: '-1' },
        { name: '提交中', id: '0' },
        { name: '审核通过', id: '1' },
        { name: '审核未通过', id: '2' },
        { name: '已打款 ', id: '3' }
      ],
      list: [],
      listQuery: {
        status: '-1',
        merch_id: '',
        start_time: '',
        end_time: '',
        page: 1,
        size: 20
      },
      total: 0,
      detailVisible: false,
      dataDetail: [],
      DetailTotal: 0,
      detailForm: {
        page: 1,
        size: 10
      },
      billDetail: {},
      activeName: 'first',
      detailTitle: '',
      exportAllloading: false,
      loadingSearch:false,
      merchantList:[],
      detailStatus: "",
      checkTitle:'',
      checkVisible:false,
      checkItme:'',
      rules:{
        status: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      editForm:{
        status:'1',
        desc:'',
      },
      remitTitle:'',
      remitVisible:false,
      remitItme:'',
      remitRules:{
        pay_image: [{ required: true, message: '请上传图片', trigger: 'blur' }],
      },
      remitForm:{
        pay_image:''
      },
      // 上传地址
      uploadUrl: process.env.VUE_APP_BASE_API + 'uploadImage',
      remitDetail:[],
      srcList:[],
      btnAry:[],
    }
  },
  mounted() {
    this.getList()
    this.$store.dispatch('user/showBtn', { id: 62 }).then(res => {
      // console.log('res', res)
      this.btnAry = res.children
    })
  },
  methods: {
    getList(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      let start_time, end_time
      if (this.dateRange == null || this.dateRange.length === 0) {
        start_time = ''
        end_time = ''
      } else {
        start_time = this.dateRange[0] / 1000
        end_time = this.dateRange[1] / 1000
      }
      let status
      if(this.listQuery.status == '-1'){
        status = ''
      }else{
        status = this.listQuery.status
      }
      const params = {
        start_time: start_time,
        end_time: end_time,
        merch_id: this.listQuery.merch_id,
        status:status,
        page: this.listQuery.page,
        size: this.listQuery.size
      }
      getWithdrawList(params).then(res => {
        this.total = res.data.data.total
        this.list = res.data.data.data
      })
    },
     //刷新
    refresh(){
      this.listQuery = {
        status: '-1',
        merch_id: '',
        start_time: '',
        end_time: '',
        page: 1,
        size: 20
      }
      this.dateRange = []
      this.getList();
    },
    // 搜索商家
    remoteMethod(query) {
      if (query == '' || query == null) {
        this.merchantList = []
      } else {
        this.loadingSearch = true
        getMerchList({ name: query, page: 1, size: 9999,}).then(res => {
          this.loadingSearch = false
          this.merchantList = res.data
        })
      }
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    //审核
    checkList(row){
      this.checkItme = row
      this.checkTitle = row.merch_name+'-审核'
      this.checkVisible = true
    },
    checkSubmit(){
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let params={
            id:this.checkItme.id,
            status:this.editForm.status,
            audit_description:this.editForm.desc
          }
          getMerchCheck(params).then(res=>{
            if (res.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
                this.checkVisible = false;
                this.detailVisible = false
              }
          })
        }
      })
      
    },
    //打款
    remitList(row){
      this.remitItme = row
      this.remitTitle = row.merch_name+'-打款'
      this.remitVisible = true
      this.remitForm.pay_image = ''
    },
    addUploadImgSuccess(res, file, fileList) {
      this.remitForm.pay_image = res.data.file_url
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg,jpeg,png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
    },
    remitSubmit(){
      this.$refs.remitForm.validate((valid) => {
        if (valid) {
          let params={
            id:this.remitItme.id,
            pay_image:this.remitForm.pay_image,
          }
          getMerchPayment(params).then(res=>{
            if (res.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
                this.remitVisible = false;
                this.detailVisible = false
              }
          })
        }
      })
    },
    detailList(row) {
      this.detailVisible = true
      this.detailForm.page = 1
      this.detailTitle = '提现单详情'
      this.activeName = "first";
      if (row == undefined) {

      } else {
        this.srcList = []
        this.remitDetail = [];
        this.billDetail = row
        this.detailStatus = row.status;
        this.remitDetail.push(row);
        this.srcList.push(row.pay_image)
      }
      const params = {
        merch_settlement_id: this.billDetail.merch_settlement_id,
        page: this.detailForm.page,
        size: this.detailForm.size
      }
      getWithdrawDetailList(params).then(res => {
        this.dataDetail = res.data.data.data
        this.DetailTotal = res.data.data.total
      })
    },
    getDetailData(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.detailForm.page = parseInt(json.page)
        this.detailForm.size = parseInt(json.limit)
      }
      this.detailList()
    },
    //查看每天的详情
    dayDetailList(row){
      this.$refs.withdrawDetailChild.init(row)
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
      let status
      if(this.listQuery.status == '-1'){
        status = ''
      }else{
        status = this.listQuery.status
      }
      if (flag == '1') {
        this.exportAllloading = true
        params = {
          status: status,
          merch_id: this.listQuery.merch_id,
          start_time: this.listQuery.start_time,
          end_time: this.listQuery.end_time
        }
      } else {
        params = {
          status: status,
          merch_id: this.listQuery.merch_id,
          start_time: this.listQuery.start_time,
          end_time: this.listQuery.end_time,
          page:this.listQuery.page,
          size:this.listQuery.size,
        }
      }
      orderWithdrawListExcel(params).then(res => {
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
.tab-container {
  margin: 10px;
}
.mixin-components-container {
 padding-top:5px ;
}
.component-item {
  min-height: 10px;
}
.el-divider {
  margin: 10px 0;
}
.bank-card {
  // background-color: #f0f2f5;
  height: 150px;
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
  width: 23%;
  float: left;
  font-size: 12px;
  margin-right: 2%;
}
.bank p {
  color: blue;
  font-size: 14px;
}
.add-card {
  background-color: #f0f2f5;
  height: 180px;
}
.add-header {
  width: 100%;
  font-size: 17px;
  margin-right: 2%;
}
.add-header p {
  color: rgb(241, 96, 12);
  font-size: 25px;
  line-height: 0px;
}
.add {
  width: 90%;
  float: left;
  font-size: 12px;
  margin-right: 2%;
  margin-bottom: 4px;
}
.add b {
  color: rgb(241, 96, 12);
  font-size: 14px;
}
.el-alert {
  margin-bottom: 10px;
  height: 40px;
}
.el-form-item {
  margin-bottom: 10px;
}
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
.link-type {
  color: blue;
}
.commont-border {
  border-bottom: 1px solid #DCDFE6;
  display: flex;
  padding: 10px 0;
}
.item-box {
  width: 50%;
  display: flex;
  .title-name {
    font-size: 14px;
    color: #606266;
    display: inline-block;
    width: 100px;
    font-weight: bold;
  }
  .final-statement {
    font-size: 24px;
    color: #42b983;
  }
  .item-money {
    margin: 15px 0;
  }
  .first-item {
    margin-top: 0;
  }
  .bank-card {
    color: #1654cc;
  }
}
.no-withdraw-deposit-box {
  margin-top: 20px;
  margin-left: 100px;
  .no-withdraw-deposit-btn {
    font-size: 24px;
    width: 120px;
    text-align: center;
  }
}
.no-pay-btn {
  border: 2px solid orange;
  color: orange;
  padding: 10px;
  display: inline-block;
  margin-bottom: 10px;
}
.alredy-pay-btn {
  border: 2px solid #42b983;
  color: #42b983;
  padding: 10px;
  display: inline-block;
}
.margin-10 {
  margin: 15px 0;
}
/deep/.el-tabs__header{
  margin: 0;
}
.pop-btn-box{
    text-align: center;
    margin-top: 40px;
}
.avatar-uploader {
  /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.el-upload:hover {
    border-color: #409EFF;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  display: block;
}
.remit-title{
  position: absolute;
}
.remit-img{
  width: 100px;
  margin-left: 75px;
}
.order-detail{
  margin-top: 20px;
}
</style>
