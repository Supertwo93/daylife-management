<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>提现管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>

        <el-col :span="4">
          <span style="width:120px">会员昵称：</span>
          <el-input placeholder="请输入负责人名称"></el-input>
        </el-col>

        <el-col :span="4">
          <span style="width:60px">状态:</span>
          <el-select @change="statusChange" clearable v-model="queryInfo.status" placeholder="请选择">
            <el-option
              v-for="(item,index) in statusOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <span style="width:90px">提现方式:</span>
          <el-select clearable v-model="queryInfo.type" placeholder="请选择">
            <el-option
              v-for="(item,index) in withdrawTypeOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <span style="width:90px">申请时间：</span>
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            @change="dateChange"
            type="daterange"
            range-separator="至"
            :picker-options="datePickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-button @click="searchAll" type="primary" icon="el-icon-search">全部</el-button>
      </el-row>

      <el-table
        ref="multipleTable"
        border
        :data="list"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          label="提现方式"
          align="center">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.type===1">支付宝</el-tag>
            <el-tag type="success" v-if="scoped.row.type===2">微信</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="会员昵称"
          prop="nickname"
          align="center">
        </el-table-column>
        <el-table-column
          label="提现金额"
          prop="money"
          align="center">
        </el-table-column>
        <el-table-column
          label="真实姓名"
          prop="trueName"
          align="center">
        </el-table-column>
        <el-table-column
          label="支付宝账号"
          prop="alipayAccount"
          align="center">
        </el-table-column>
        <el-table-column
          label="微信openid"
          prop="tenpayOpenid"
          align="center">
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="createTime"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="处理状态">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.status==1">未处理</el-tag>
            <el-tag v-if="scoped.row.status==2">已处理</el-tag>
            <el-tag type="success" v-if="scoped.row.status==3">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditOpinion"
          align="center"
          label="处理备注">
        </el-table-column>
        <el-table-column
          prop="details"
          align="center"
          label="详情">
        </el-table-column>
        <el-table-column
          label="处理时间"
          prop="auditTime"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200">
          <template slot-scope="scoped">
            <el-button @click="passWithdraw(scoped.row)" v-if="scoped.row.status==1" type="success" size="mini">通过</el-button>
            <el-button @click="denyWithdraw(scoped.row)" v-if="scoped.row.status==1" type="danger"  size="mini">不通过</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <el-dialog title="提现处理" :visible.sync="passDialogVisible" width="50%" @close="passDialogClosed">
        <el-form :model="passForm" :rules="passFormRules" ref="passFormRef" label-width="80px">
          <el-form-item label="提现备注" prop="auditOpinion">
            <el-input v-model="passForm.auditOpinion"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="passDialogVisible = false">取 消</el-button>
          <el-button @click="withdrawDeal" type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      queryInfo:{
        pageNo:1,
        pageSize:10,
        type:'',
        status:'',
        beginCreateTime:'',
        endCreateTime:''
      },
      date:'',
      withdrawTypeOptions:[
        {name:'支付宝',id:1},
        {name:'微信',id:2}
      ],
      datePickerOptions:{
        disabledDate(time){
          return time.getTime()>Date.now()
        }
      },
      statusOptions:[
        {name:'未处理',id:1},
        {name:'已处理',id:2},
        {name:'已拒绝',id:3},
      ],
      list:[],
      total:1,
      passDialogVisible:false,
      passFormRules:{
        auditOpinion:[
          {required:true,message:'请输入备注',trigger:'blur'}
        ]
      },
      passForm:{
        auditOpinion:'',
        withdrawId:''
      },
      passOrDeny:''
      
    }
  },
  created(){
    this.getWithdrawList()
  },
  methods:{
    async getWithdrawList(){
      const { data:res } = await this.$http.get('/back/tbWithdraw/getListAll',{params:this.queryInfo})
      if(res.resultCode !==1){return this.$message.error('获取列表失败')}
      this.total = res.data.total
      this.list = res.data.records
    },
    statusChange(){
      this.queryInfo.pageNo = 1
      this.getWithdrawList()
    },
    handleSizeChange(value){
      this.queryInfo.pageSize = value
      this.getWithdrawList()
    },
    handleCurrentChange(value){
      this.queryInfo.pageNo = value
      this.getWithdrawList()
    },
    dateChange(){
      if(this.date==null){
        this.queryInfo.beginCreateTime = ''
        this.queryInfo.endCreateTime = ''
      }else{
        this.queryInfo.beginCreateTime = this.date[0]
        this.queryInfo.endCreateTime = this.date[1]
      }
      this.queryInfo.pageNo = 1
      this.getWithdrawList()
    },
    searchAll(){
      this.queryInfo.pageNo = 1
      this.queryInfo.type = ''
      this.queryInfo.status = ''
      this.date = ''
      this.queryInfo.beginCreateTime = ''
      this.queryInfo.endCreateTime = ''
      this.getWithdrawList()
    },
    passWithdraw(value){
      this.passForm.withdrawId = value.withdrawId
      this.passOrDeny = 1
      this.passDialogVisible = true
    },
    denyWithdraw(value){
      this.passForm.withdrawId = value.withdrawId
      this.passOrDeny = 2
      this.passDialogVisible = true
    },
    passDialogClosed() {
      this.$refs.passFormRef.resetFields()
    },
    async withdrawDeal(){
      let url = ''
      if(this.passOrDeny===1){
        url='/back/tbWithdraw/pass'
      }else{
        url='/back/tbWithdraw/reject'
      }
      const {data:res} = await this.$http.post(url,this.passForm)
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.$message.success('处理成功')
      this.getWithdrawList()
      this.passDialogVisible = false
    }
  }
}
</script>


<style lang="scss" scoped>
.el-row{
  margin-bottom: 10px;
}

.el-col{
  display: flex;
  align-items: center;
  margin-right: 10px;
}
</style>