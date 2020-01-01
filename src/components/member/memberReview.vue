<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息审核认证</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片主体区域 -->
    <el-card>

      <!-- 条件筛选区域 -->
      <el-row>

        <el-col :span="4">
          <span style="width:125px">会员昵称：</span>
          <el-input @change="searchItem" clearable v-model="queryInfo.nickname"></el-input>
        </el-col>

        <el-col :span="4">
          <span style="width:125px">手机号码：</span>
          <el-input @change="searchItem" clearable v-model="queryInfo.phone"></el-input>
        </el-col>

        <el-col :span="6">
          <span style="width:90px">认证时间：</span>
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
      </el-row>
      <el-row>
        <el-col :span="4">
          <span style="width:90px">认证类型</span>
          <el-select clearable @clear="typeClear" @change="typeChange" v-model="type" placeholder="请选择">
            <el-option
              v-for="(item,index) in typeOptions"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span style="width:90px">处理状态</span>
          <el-select clearable @clear="statusClear" @change="statusChange" v-model="status" placeholder="请选择">
            <el-option
              v-for="(sitem,sindex) in statusOptions"
              :key="sindex"
              :label="sitem"
              :value="sitem">
            </el-option>
          </el-select>
        </el-col>
        <el-button @click="searchAll" type="success">全部</el-button>
      </el-row>

      <!-- 状态汇总 -->
      <el-row>
        <el-col>
          <span class="nums">全部：{{totalCount}}</span>
          <span class="nums">待处理：{{pendingCount}}</span>
          <span class="nums">已处理：{{processedCount}}</span>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
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
          label="认证类型"
          align="center"
          show-overflow-tooltip>
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.type==1">个人认证</el-tag>
            <el-tag v-else>企业认证</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLogin"
          align="center"
          width="160"
          label="认证图片">
          <template slot-scope="scoped">
            <viewer :images="scoped.row.imgList"> 
              <img :src="img" v-for="(img,number) in scoped.row.imgList" :key="number">
            </viewer>
            
          </template>
        </el-table-column>
        <el-table-column
          prop="cerApplyTime"
          align="center"
          label="申请认证时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="处理状态">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.processStatus==1">已处理</el-tag>
            <el-tag v-else>待处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="认证审核结果">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.auditResult==1">通过</el-tag>
            <el-tag v-else>否决</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditRemark"
          align="center"
          label="处理备注">
        </el-table-column>
        <el-table-column
          prop="auditTime"
          align="center"
          label="处理时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="350">
          <template slot-scope="scoped">
            <el-button @click="showPassDialog(scoped.row)" v-show="scoped.row.processStatus==0" type="success" size="mini">通过</el-button>
            <el-button v-show="scoped.row.processStatus==0" type="danger" size="mini">不通过</el-button>
            <el-button @click="showInfoDialog(scoped.row)" type="primary" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

    <!-- 通过审核弹出框 -->
    <el-dialog
      title="是否通过审核"
      :visible.sync="passDialogVisible"
      width="30%">
      <el-row>
        <el-col>
          <span style="width:90px">处理备注</span>
          <el-input v-model="passParams.cerReason" placeholder="请输入处理备注"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="passAuth">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
    title="认证信息详情"
    :visible.sync="infoDialogVisible"
    width="50%">
      <div class="cer-info-box">
        <div class="item"><div>认证类型：</div><span v-if="info.type==1">个人认证</span><span v-else>公司认证</span></div>
        <div class="item"><div>会员账号：</div><span>{{info.companyLeader}}</span></div>
        <div class="item"><div>姓名：</div><span>{{info.personalTrueName}}</span></div>
        <div class="item"><div>会员手机号：</div><span>{{info.phone}}</span></div>
        <div class="item"><div>性别：</div><span>{{info.sex}}</span></div>
        <div class="item"><div>出生日期：</div><span>{{info.companyName}}</span></div>
        <div class="item"><div>所在地区：</div><span>{{info.city}}</span></div>
        <div class="item"><div>申请时间：</div><span>{{info.personalCerApplyTime}}</span></div>
        <div class="item"><div>处理时间：</div><span>{{info.companyName}}</span></div>
        <div class="item"><div>处理状态：</div><span>{{info.companyName}}</span></div>
        <div class="item"><div>认证审核结果：</div><span>{{info.companyName}}</span></div>
        <div class="item"><div>处理备注：</div><span>{{info.companyName}}</span></div>
      </div>
      <div class="cer-info-box">
        <div class="item"><div>营业执照：</div><el-image preview-src-list="" :src="info.companyBusinessLicenseImg"></el-image></div>
        <div class="item"><div>手持身份证正面照：</div><el-image :src="info.handCardImg"></el-image></div>
        <div class="item"><div>身份证正面照：</div><el-image :src="info.faceCardImg"></el-image></div>
        <div class="item"><div>身份证反面照：</div><el-image :src="info.backCardImg"></el-image></div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data(){
    return{
      datePickerOptions:{
        disabledDate(time){
          return time.getTime() > Date.now()
        }
      },
      pendingCount:'',
      processedCount:'',
      totalCount:'',
      date:'',
      typeOptions:[
        '个人认证',
        '公司认证'
      ],
      type:'',
      statusOptions:[
        '待处理',
        '已处理'
      ],
      status:'',
      list:[],
      queryInfo:{
        token:'',
        pageNo:1,
        pageSize:10,
        phone:'',
        nickname:'',
        processStatus:'',
        type:'',
        beginCerApplyTime:'',
        endCerApplyTime:''
      },
      remark:'',
      passDialogVisible:false,
      infoDialogVisible:false,
      passParams:{
        type:'',
        appuserId:'',
        cerReason:'',
        status:''
      },
      total:1,
      info:''
    }
  },
  created(){
    this.getList()
  },
  methods:{
    async getList(){
      this.queryInfo.token = window.sessionStorage.getItem('token')
      const {data:res} = await this.$http.get('/back/tbAppuserMember/selectAuthenticationList',{
        params:this.queryInfo
      })
      this.total = res.data.page.total
      this.pendingCount = res.data.pendingCount
      this.processedCount = res.data.processedCount
      this.totalCount = res.data.totalCount
      this.list = res.data.page.records
    },
    async passAuth(){
      this.passParams.status = 1
      const {data:res} = await this.$http.post('/back/tbAppuserMember/updateCerStatus',this.passParams,{params:{token:window.sessionStorage.getItem('token')}})
      if(res.resultCode!=1) return this.$message.error('操作失败')
      this.$message.success('操作成功')
      this.passDialogVisible = false
      this.getList()
    },
    showPassDialog(value){
      this.passParams.appuserId = value.appuserId
      this.passParams.type = value.type
      this.passDialogVisible = true
    },
    searchItem(){
      this.queryInfo.pageNo = 1
      this.getList()
    },
    searchAll(){
      this.type = ''
      this.status = ''
      this.queryInfo.pageNo = 1
      this.queryInfo.phone = ''
      this.queryInfo.nickname = ''
      this.queryInfo.processStatus = ''
      this.queryInfo.type = ''
      this.getList()
    },
    handleCurrentChange(value){
      this.queryInfo.pageNo = value
      this.getList()
    },
    handleSizeChange(value){
      this.queryInfo.pageSize = value
      this.getList()
    },
    statusChange(value){
      this.queryInfo.pageNo = 1
      if(value=='已处理'){
        this.queryInfo.processStatus = 1
      }else{
        this.queryInfo.processStatus = 0
      }
      this.getList()
    },
    statusClear(){
      this.queryInfo.processStatus = ''
    },
    typeChange(value){
      this.queryInfo.pageNo = 1
      if(value=='个人认证'){
        this.queryInfo.type = 1
      }else{
        this.queryInfo.type = 2
      }
      this.getList()
    },
    typeClear(){
      this.queryInfo.type = ''
    },
    async showInfoDialog(value){
      let obj = {}
      obj.appuserId = value.appuserId
      obj.type = value.type
      obj.token = window.sessionStorage.getItem('token')
      const {data:res} = await this.$http.get('/back/tbAppuserMember/getAuthenticationInfo',{
        params:obj
      })
      this.info = res.data
      this.infoDialogVisible = true
    },
    dateChange(value){
      this.queryInfo.pageNo = 1
      if(this.date==null){
        this.queryInfo.beginCerApplyTime = ''
        this.queryInfo.endCerApplyTime = ''
      }else{
        this.queryInfo.beginCerApplyTime = this.date[0]
        this.queryInfo.endCerApplyTime = this.date[1]
      }
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
  .nums{
    margin-right: 10px;
  }
}

.el-table-column{
  display: flex;
  
}
img{
  margin-right: 5px;
  width:40px;
  height:40px;
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