<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      <el-breadcrumb-item>递推人员列表</el-breadcrumb-item>
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
          prop="refereeCode"
          label="我的邀请码"
          align="center">
        </el-table-column>
        <el-table-column
          prop="city"
          label="所在地区"
          align="center"
          show-overflow-tooltip>
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
          width="450">
          <template slot-scope="scoped">
            <el-button type="danger" size="mini">禁用</el-button>
            <el-button type="primary" size="mini">基本信息</el-button>
            <el-button type="primary" size="mini" @click="checkInviteList(scoped.row)">邀请列表</el-button>
            <el-button type="success" size="mini" @click="editRefereeCode(scoped.row)">修改邀请码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="修改邀请码" :visible.sync="changeDialogVisible" width="50%">
      <!-- 内容主体区域 -->
        <el-form :model="changeForm" :rules="changeFormRules" ref="changeFormRef" label-width="80px">
          <el-form-item label="邀请码" prop="refereeCode">
            <el-input v-model="changeForm.refereeCode"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="changeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditCode">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="邀请列表" :visible.sync="listDialogVisible" width="80%">
        <el-table
          ref="multipleTable"
          border
          :data="inviteList"
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
            label="所在城市"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="注册时间">
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>


<script>
import { async } from 'q'
export default {
  data(){
    return{
      list:[],
      changeDialogVisible:false,
      changeForm:{
        refereeCode:'',
        appuserId:'',
      },
      changeFormRules:{
        refereeCode:[
          {required:true,message:'请输入邀请码',trigger:'blur'},
          {
            min:6,
            max:6,
            message:'邀请码长度为6个字符',
            trigger:'blur'
          }
        ]
      },
      listDialogVisible:false,
      listQueryInfo:{
        refereeId:''
      },
      inviteList:[]

    }
  },
  created(){
    this.getList()
  },
  methods:{
    async getList(){
      const {data:res} = await this.$http.get('/back/tbAppuserGroundPush/selectList')
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.list = res.data.records
    },
    editRefereeCode(value){
      this.changeDialogVisible = true
      this.changeForm.appuserId = value.appuserId
      this.changeForm.refereeCode = value.refereeCode
    },
    async confirmEditCode(){
      this.$refs.changeFormRef.validate(async valid =>{
        if (!valid) return
        const {data:res} = await this.$http.post('/back/tbAppuserGroundPush/updateRefereeCode',this.changeForm)
        if(res.resultCode!==1){
          return this.$message.error(res.message)
        }
        this.$message.success('修改成功')
        this.changeDialogVisible = false
        this.getList()
      })
    },
    async checkInviteList(value){
      this.listDialogVisible = true
      this.listQueryInfo.refereeId = value.appuserId
      const {data:res} = await this.$http.get('/back/tbAppuserMember/selectInvitedUserList',{
        params:this.listQueryInfo
      })
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.inviteList = res.data.records
    }
  }
}
</script>


<style lang="scss" scoped>

</style>