<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="4">
          <el-input
            clearable
            @change="getGoodsList"
            placeholder="请输入关键字"
            suffix-icon="el-icon-search"
            v-model="queryInfo.title">
          </el-input>
        </el-col>
        <el-col :span="6">
          <span style="width:90px">创建时间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            @change="dateChange"
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            :picker-options="datePickerOptions"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <span style="width:90px">上架状态：</span>
          <el-select clearable @clear="statusClear" @change="statusChange" v-model="status" placeholder="请选择">
            <el-option
              v-for="(sitem,sindex) in statusOptions"
              :key="sindex"
              :value="sitem">
            </el-option>
          </el-select>
        </el-col>
        <el-button type="success">全部</el-button>
      </el-row>

      <el-table
        ref="multipleTable"
        border
        :data="goodsList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="title"
          align="center">
        </el-table-column>
        <el-table-column
          prop="price"
          label="商品价格"
          align="center">
        </el-table-column>
        <el-table-column
          label="一级分类"
          align="center"
          show-overflow-tooltip>
          金融
        </el-table-column>
        <el-table-column
          align="center"
          label="是否上架">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.isMarketable==0">否</el-tag>
            <el-tag type="success" v-else>是</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="sellerNickName"
          align="center"
          label="所属店铺">
        </el-table-column>
        <el-table-column
          prop="details"
          align="center"
          label="详情">
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
      search:'',
      date:'',
      status:'',
      statusOptions:['上架','下架'],
      datePickerOptions:{
        disabledDate(time){
          return time.getTime() > Date.now()
        }
      },
      goodsList:[],
      queryInfo:{
        token:'',
        title:'',
        auditStatus:'',
        beginCreateTime:'',
        endCreateTime:'',
        pageNo:1,
        pageSize:10,
      },
      total:1
    }
  },
  created(){
    this.queryInfo.token = window.sessionStorage.getItem('token')
    this.getGoodsList()
  },
  methods:{
    async getGoodsList(){
      const {data:res} = await this.$http.get('/back/tbReleaseFinance/selectList',{
        params:this.queryInfo
      })
      this.total = res.data.total
      this.goodsList = res.data.records
    },
    handleSizeChange(value){
      this.queryInfo.pageSize = value
      this.getGoodsList()
    },
    handleCurrentChange(value){
      this.queryInfo.pageNo = value
      this.getGoodsList()
    },
    statusChange(){
      if(this.status=='申请中'){
        this.queryInfo.auditStatus = 1
      }else if(this.status=='已驳回'){
        this.queryInfo.auditStatus = 2
      }else if(this.status=='审核通过'){
        this.queryInfo.auditStatus = 3
      }else{
        this.queryInfo.auditStatus = 4
      }
      this.getGoodsList()
    },
    statusClear(){
      this.status = ''
      this.queryInfo.auditStatus = ''
      this.getGoodsList()
    },
    dateChange(value){
      if(this.date==null){
        this.queryInfo.beginCreateTime = ''
        this.queryInfo.endCreateTime = ''
      }else{
        this.queryInfo.beginCreateTime = this.date[0]
        this.queryInfo.endCreateTime = this.date[1]
      }
      this.getGoodsList()
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