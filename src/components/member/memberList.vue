<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
    
        <el-col :span="4">
          <span style="width:125px">会员昵称：</span>
          <el-input clearable @change="getMemberList" v-model="queryInfo.nickname"></el-input>
        </el-col>

        <el-col :span="4">
          <span style="width:125px">手机号码：</span>
          <el-input clearable @change="getMemberList" v-model="queryInfo.phone"></el-input>
        </el-col>

        <el-col :span="6">
          <span style="width:90px">注册时间：</span>
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
      </el-row>
      <el-row>
        <el-col :span="4">
          <span style="width:90px">账号状态</span>
          <el-select @change="statusChange" clearable v-model="status" placeholder="请选择">
            <el-option
              v-for="(item,index) in statusOptions"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span style="width:90px">注册来源</span>
          <el-select clearable v-model="source" @change="sourceChange" placeholder="请选择">
            <el-option
              v-for="(sitem,sindex) in sourceOptions"
              :key="sindex"
              :label="sitem"
              :value="sitem">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span style="width:90px">所在地区</span>
          <el-cascader
          clearable
          :options="areaOptions"
          :props="{ checkStrictly: true }"
          v-model="selectOptions"
          @change="areaChange">
          </el-cascader>
        </el-col>
        <el-button @click="showAll" type="primary">全部</el-button>
      </el-row>

      <el-table
        ref="multipleTable"
        border
        :data="memberList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="会员昵称"
          align="center">
        </el-table-column>
         <el-table-column
          label="手机号码"
          prop="phone"
          align="center">
        </el-table-column>
        <el-table-column
          prop="city"
          label="所在地区"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="lastLogin"
          align="center"
          label="公司账号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="注册时间">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="状态">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.status==1" type="success">启用</el-tag>
            <el-tag v-else type="warning">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="操作"
          width="250">
          <template>
            <el-button type="danger" size="mini">禁用</el-button>
            <el-button type="primary" size="mini">基本信息</el-button>
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
import {regionData,CodeToText} from 'element-china-area-data'
export default {
  data(){
    return{
      date:'',
      statusOptions: ['启用','禁用'],
      sourceOptions:['web','IOS','Android'],
      datePickerOptions:{
        disabledDate(time){
          return time.getTime() > Date.now()
        }
      },
      status: '',
      source:'',
      areaOptions:regionData,
      selectOptions:[],
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        nickname:'',
        status:'',
        phone:'',
        registerOrigin:'',
        beginCreateTime:'',
        endCreateTime:''
      },
      memberList:[],
      total:1,
    }
  },
  created(){
    this.getMemberList()
  },
  methods:{
    areaChange(value){
      console.log(value)
    },
    async getMemberList(){
      const {data:res} = await this.$http.get('/back/tbAppuserMember/selectList',{
        params: this.queryInfo
      })
      console.log(res)
      this.memberList = res.data.records
      this.total = res.data.total
    },
    handleSizeChange(value){
      this.queryInfo.pageSize = value
      this.getMemberList()
    },
    handleCurrentChange(value){
      this.queryInfo.pageNo = value
      this.getMemberList()
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
      this.getMemberList()
    },
    statusChange(){
      this.queryInfo.pageNo = 1
      if(this.status=="启用"){
        this.queryInfo.status = 1
      }else if(this.status==''){
        this.queryInfo.status = ''
      }
      else{
        this.queryInfo.status = 0
      }
      this.getMemberList()
    },
    sourceChange(){
      this.queryInfo.pageNo = 1
      if(this.source=='web'){
        this.queryInfo.registerOrigin = 1
      }else if(this.source=='IOS'){
        this.queryInfo.registerOrigin = 2
      }else if(this.source == ''){
        this.queryInfo.registerOrigin = ''
      }else{
        this.queryInfo.registerOrigin = 3
      }
      this.getMemberList()
    },
    showAll(){
      this.source = ''
      this.status = ''
      this.date = ''
      this.queryInfo.pageNo = 1
      this.queryInfo.pageSisz = 10
      this.queryInfo.nickname = ''
      this.queryInfo.status = ''
      this.queryInfo.phone = ''
      this.queryInfo.registerOrigin = ''
      this.queryInfo.beginCreateTime = ''
      this.queryInfo.endCreateTime = ''
      this.getMemberList()
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