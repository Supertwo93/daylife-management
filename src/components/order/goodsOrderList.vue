<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品订单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        ref="multipleTable"
        border
        :data="list"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="订单id"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sellerNickName"
          label="所属店铺"
          align="center">
        </el-table-column>
         <el-table-column
          label="收货人号码"
          prop="receiverMobile"
          align="center">
        </el-table-column>
        <el-table-column
          prop="receiver"
          label="收货人"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="payment"
          align="center"
          label="实付金额">
        </el-table-column>
        <el-table-column
          align="center"
          label="是否支付">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.isPay==1" type="success">是</el-tag>
            <el-tag v-else type="warning">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.status==1" type="success">未付款</el-tag>
            <el-tag v-if="scoped.row.status==2" type="success">已付款(待接单)</el-tag>
            <el-tag v-if="scoped.row.status==3" type="success">未发货(进行中,待处理)</el-tag>
            <el-tag v-if="scoped.row.status==4" type="success">已发货(进行中,已处理)</el-tag>
            <el-tag v-if="scoped.row.status==5" type="success">进行中</el-tag>
            <el-tag v-if="scoped.row.status==6" type="success">交易成功</el-tag>
            <el-tag v-if="scoped.row.status==7" type="success">交易关闭, 无、待评价</el-tag>
            <el-tag v-if="scoped.row.status==8" type="success">售后订单</el-tag>
            <el-tag v-if="scoped.row.status==9" type="success">取消订单</el-tag>
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
      queryInfo:{
        pageNo:1,
        pageSize:10
      },
      total:1
    }
  },
  created(){
    this.getList()
  },
  methods:{
    async getList(){
      const {data:res} = await this.$http.get('/back/tbGoodsOrder/getListAll',{params:this.queryInfo})
      this.total = res.data.total
      this.list = res.data.records
      console.log(res)
    },
    handleSizeChange(value){
      this.queryInfo.pageSize = value
      this.getList()
    },
    handleCurrentChange(value){
      this.queryInfo.pageNo = value
      this.getList()
    }
  }
}
</script>


<style lang="scss" scoped>

</style>