<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>企业管理</el-breadcrumb-item>
      <el-breadcrumb-item>企业列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="5">
          <span style="width:140px">负责人账号：</span>
          <el-input placeholder="请输入负责人账号"></el-input>
        </el-col>

        <el-col :span="5">
          <span style="width:140px">负责人名称：</span>
          <el-input placeholder="请输入负责人名称"></el-input>
        </el-col>

        <el-col :span="5">
          <span style="width:140px">负责人手机：</span>
          <el-input placeholder="请输入负责人手机"></el-input>
        </el-col>

        <el-col :span="4">
          <span style="width:125px">企业名称：</span>
          <el-input placeholder="请输入企业名称"></el-input>
        </el-col>
        
      </el-row>
      <el-row>
        <el-col :span="4">
          <span style="width:90px">账号状态</span>
          <el-select v-model="status" placeholder="请选择">
            <el-option
              v-for="(item,index) in statusOptions"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span style="width:125px">企业地址：</span>
          <el-input placeholder="请输入企业地址"></el-input>
        </el-col>
        <el-col :span="6">
          <span style="width:90px">注册时间：</span>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
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
          width="60"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="负责人账号"
          align="center">
        </el-table-column>
         <el-table-column
          label="负责人名称"
          prop="companyLeader"
          align="center">
        </el-table-column>
        <el-table-column
          prop="city"
          label="负责人手机号码"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="companyName"
          align="center"
          label="企业名称">
        </el-table-column>
        <el-table-column
          prop="companyAddress"
          align="center"
          label="企业地址">
        </el-table-column>
        <el-table-column
          prop=""
          align="center"
          label="团队人数">
        </el-table-column>
        <el-table-column
          prop="companyCerApplyTime"
          align="center"
          label="企业认证申请时间">
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
          width="350">
          <template slot-scope="scoped">
            <el-button type="danger" size="mini">禁用</el-button>
            <el-button type="primary" size="mini">基本信息</el-button>
            <el-button @click="checkInfo(scoped.row)" type="primary" size="mini">认证信息</el-button>
            <el-button type="primary" size="mini">团队信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="公司认证信息" :visible.sync="infoDialog">
      <div class="cer-info-box">
        <div class="item"><div>公司名称：</div><span>{{info.companyName}}</span></div>
        <div class="item"><div>企业负责人：</div><span>{{info.companyLeader}}</span></div>
        <div class="item"><div>注册地址：</div><span>{{info.companyAddress}}</span></div>
        <div class="item"><div>申请时间：</div><span>{{info.companyName}}</span></div>
        <div class="item"><div>工商注册号：</div><span>{{info.companyName}}</span></div>
      </div>
      <div class="cer-info-box">
        <div class="item"><div>营业执照：</div><el-image :src="info.companyBusinessLicenseImg"></el-image></div>
        <div class="item"><div>手持身份证正面照：</div><el-image :src="info.companyHandCardImg"></el-image></div>
        <div class="item"><div>身份证正面照：</div><el-image :src="info.companyFaceCardImg"></el-image></div>
        <div class="item"><div>身份证反面照：</div><el-image :src="info.companyBackCardImg"></el-image></div>
      </div>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data(){
    return{
      statusOptions: ['启用','禁用'],
      status: '',
      list:[],
      queryInfo:{
        token:'',
        pageNo:1,
        pageSize:10
      },
      infoDialog:false,
      info:'',
      date:''
    }
  },
  created(){
    this.getList()
  },
  methods:{
    async getList(){
      this.queryInfo.token = window.sessionStorage.getItem('token')
      const {data:res} = await this.$http.get('/back/tbAppuser/selectList',{
        params:this.queryInfo
      })
      console.log(res)
      this.list = res.data.records
    },
    async checkInfo(data){
      console.log(data.appuserId)
      this.infoDialog = true
      const {data:res} = await this.$http.get('/back/tbAppuser/getAuthenticationInfo',{
        params:{
          token:window.sessionStorage.getItem('token'),
          appuserId:data.appuserId
        }
      })
      console.log(res.data)
      this.info = res.data
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

.cer-info-box{
  display: flex;
  flex-wrap: wrap;
  .item{
    div{
      width:140px;
    }
    margin-top: 10px;
    width:50%;
    display: flex;
    .el-image{
      width:100px;
      height:100px;
    }
  }
}
</style>