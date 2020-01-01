<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
      <el-breadcrumb-item>店铺列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="6">
          <span style="width:85px">店铺名：</span>
          <el-input clearable v-model="queryInfo.nickName" @change="getList"></el-input>
        </el-col>

        <el-col :span="6">
          <span style="width:135px">联系人姓名：</span>
          <el-input clearable v-model="queryInfo.linkmanName" @change="getList"></el-input>
        </el-col>

        <el-col :span="6">
          <span style="width:135px">联系人号码：</span>
          <el-input clearable v-model="queryInfo.linkmanMobile" @change="getList"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">
          <span style="width:120px">当前认证状态：</span>
          <el-select clearable @change="authStatusChange" v-model="authStatus" placeholder="请选择">
            <el-option
              v-for="(item,index) in cerOptions"
              :key="index"
              :value="item">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <span style="width:75px">状态：</span>
          <el-select clearable v-model="status" @change="statusChange" placeholder="请选择">
            <el-option
              v-for="(item,index) in statusOptions"
              :key="index"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        
        <el-col :span="6">
          <span style="width:125px">创建时间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            @change="dateChange"
            v-model="date"
            type="daterange"
            range-separator="至"
            :picker-options="datePickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-button @click="showAll" type="success">全部</el-button>
      </el-row>


      <el-table
        ref="multipleTable"
        border
        :data="sellerList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center">
        </el-table-column>
        <el-table-column
          label="商家ID"
          prop="sellerId"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="店铺名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="linkmanName"
          label="联系人姓名"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="linkmanMobile"
          align="center"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="认证状态">
          <template slot-scope="scoped"> 
            <el-tag v-if="scoped.row.authenticationState==1">未认证</el-tag>
            <el-tag v-if="scoped.row.authenticationState==2">认证中</el-tag>
            <el-tag v-if="scoped.row.authenticationState==3">认证通过</el-tag>
            <el-tag v-if="scoped.row.authenticationState==4">认证失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scoped"> 
            <el-tag v-if="scoped.row.status==0">下线</el-tag>
            <el-tag v-if="scoped.row.status==1">上线/营业</el-tag>
            <el-tag v-if="scoped.row.status==2">停业</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          label="操作">
        </el-table-column> -->
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
      date:'',
      datePickerOptions:{
        disabledDate(time){
          return time.getTime() > Date.now()
        }
      },
      sellerList:[],
      cerOptions:['未认证','认证中','认证通过','认证失败'],
      statusOptions:['下线','上线/营业','停业'],
      authStatus:'',
      status:'',
      queryInfo:{
        nickName:'',
        linkmanName:'',
        linkmanMobile:'',
        authenticationState:'',
        status:'',
        pageNo:1,
        pageSize:10,
        beginCreateTime:'',
        endCreateTime:''
      },
      total:1
    }
  },
  created(){
    this.getSellerList()
  },
  methods:{
    async getSellerList(){
      const {data:res} = await this.$http.get('/back/tbSeller/selectList',{
        params:this.queryInfo
      })
      this.total = res.data.total
      this.sellerList = res.data.records
    },
    dateChange(){
      console.log(this.date)
    },
    handleSizeChange(value){
      this.queryInfo.pageSize = value
      this.getSellerList()
    },
    handleCurrentChange(value){
      this.queryInfo.pageNo = value
      this.getSellerList()
    },
    getList(){
      this.queryInfo.pageNo = 1
      this.getSellerList()
    },
    authStatusChange(value){
      this.queryInfo.pageNo = 1
      if(value=='未认证'){
        this.queryInfo.authenticationState = 1
      }else if(value=='认证中'){
        this.queryInfo.authenticationState = 2
      }else if(value=='认证通过'){
        this.queryInfo.authenticationState = 3
      }else if(value=="认证失败"){
        this.queryInfo.authenticationState = 4
      }else{
        this.queryInfo.authenticationState = ''
      }
      this.getSellerList()
    },
    statusChange(value){
      this.queryInfo.pageNo = 1
      if(value=='下线'){
        this.queryInfo.status = 0
      }else if(value=='上线/营业'){
        this.queryInfo.status = 1
      }else if(value=='停业'){
        this.queryInfo.status = 2
      }else{
        this.queryInfo.status = ''
      }
      this.getSellerList()
    },
    dateChange(value){
      this.queryInfo.pageNo = 1
      if(this.date==null){
        this.queryInfo.beginCreateTime = ''
        this.queryInfo.endCreateTime = ''
      }else{
        this.queryInfo.beginCreateTime = this.date[0]
        this.queryInfo.endCreateTime = this.date[1]
      }
      this.getSellerList()
    },
    showAll(){
      this.date = ''
      this.authStatus = ''
      this.status = ''
      this.queryInfo.nickName = ''
      this.queryInfo.linkmanName = ''
      this.queryInfo.authenticationState = ''
      this.queryInfo.status = ''
      this.queryInfo.pageNo = 1
      this.queryInfo.pageSize = 10
      this.queryInfo.beginCreateTime = ''
      this.queryInfo.endCreateTime = ''
      this.getSellerList()
    }
  },
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