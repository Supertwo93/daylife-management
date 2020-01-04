<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户财务流水管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="4">
          <span style="width:120px">流水号：</span>
          <el-input clearable placeholder="请输入流水号" @change="optionChange" v-model="queryInfo.flowNo"></el-input>
        </el-col>
        <el-col :span="4">
          <span style="width:50px">类型:</span>
          <el-select @change="optionChange" clearable v-model="queryInfo.type" placeholder="请选择">
            <el-option
              v-for="(item,index) in typeOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span style="width:80px">支付方式:</span>
          <el-select @change="optionChange" clearable v-model="queryInfo.payWay" placeholder="请选择">
            <el-option
              v-for="(item,index) in payOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span style="width:50px">事由:</span>
          <el-select @change="optionChange" clearable v-model="queryInfo.reason" placeholder="请选择">
            <el-option
              v-for="(item,index) in reasonOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
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
          prop="userNickname"
          align="center"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          label="流水号"
          prop="flowNo"
          align="center">
        </el-table-column>
        <el-table-column
          label="金额"
          prop="money"
          align="center">
        </el-table-column>
        <el-table-column
          label="支付方式"
          align="center">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.payWay==1">支付宝</el-tag>
            <el-tag v-if="scoped.row.payWay==2">微信</el-tag>
            <el-tag v-if="scoped.row.payWay==3">余额</el-tag>
            <el-tag v-if="scoped.row.payWay==4">积分支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="用户手机"
          prop="phone"
          align="center">
        </el-table-column>
        <el-table-column
          label="事由"
          align="center">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.reason==1">订单收入</el-tag>
            <el-tag v-if="scoped.row.reason==2">充值收入</el-tag>
            <el-tag v-if="scoped.row.reason==3">提现被拒退款</el-tag>
            <el-tag v-if="scoped.row.reason==4">预约金退款</el-tag>
            <el-tag v-if="scoped.row.reason==5">佣金收入</el-tag>
            <el-tag v-if="scoped.row.reason==6">服务方补偿收入</el-tag>
            <el-tag v-if="scoped.row.reason==7">积分兑换收入</el-tag>
            <el-tag v-if="scoped.row.reason==8">订单支付</el-tag>
            <el-tag v-if="scoped.row.reason==9">取消订单扣款支出</el-tag>
            <el-tag v-if="scoped.row.reason==10">预约金支出</el-tag>
            <el-tag v-if="scoped.row.reason==11">提现支出</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.status==0">已删除</el-tag>
            <el-tag v-if="scoped.row.status==1">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="类型">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.type==1">收入</el-tag>
            <el-tag v-if="scoped.row.type==2">支出</el-tag>
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
    </el-card>
  </div>
</template>


<script>
export default {
  data(){
    return{
      list:[],
      total:1,
      queryInfo:{
        pageSize:10,
        pageNo:1,
        type:'',
        reason:'',
        payWay:'',
        status:'',
        flowNo:''
      },
      typeOptions:[
        {name:'收入',id:1},
        {name:'支出',id:2},
      ],
      payOptions:[
        {name:'支付宝',id:1},
        {name:'微信',id:2},
        {name:'余额',id:3},
        {name:'积分支付',id:4},
      ],
      reasonOptions:[
        {name:'订单收入',id:1},
        {name:'充值收入',id:2},
        {name:'提现被拒退款',id:3},
        {name:'预约金退款',id:4},
        {name:'佣金收入',id:5},
        {name:'服务方补偿收入',id:6},
        {name:'积分兑换收入',id:7},
        {name:'取消订单',id:8},
        {name:'取消订单扣款支出',id:9},
        {name:'预约金支出',id:10},
        {name:'提现支出',id:11}
      ]
    }
  },
  created(){
    this.getList()
  },
  methods:{
    async getList(){
      const {data:res} = await this.$http.get('/back/tbUsercashflow/getListAll',{params:this.queryInfo})
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.total = res.data.total
      this.list = res.data.records
    },
    handleSizeChange(value){
      this.queryInfo.pageSize = value
      this.getList()
    },
    handleCurrentChange(value){
      this.queryInfo.pageNo = value
      this.getList()
    },
    optionChange(){
      this.queryInfo.pageNo = 1
      this.getList()
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