<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>金融订单</el-breadcrumb-item>
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
          prop="orderCode"
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
          prop="telephone"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="客户名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="signingDate"
          align="center"
          label="签约时间">
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
      const {data:res} = await this.$http.get('/back/tbFinanceSigning/getListAll',{params:this.queryInfo})
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