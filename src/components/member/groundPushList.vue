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
          width="250">
          <template>
            <el-button type="danger" size="mini">禁用</el-button>
            <el-button type="primary" size="mini">基本信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>


<script>
export default {
  data(){
    return{
      list:[]

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
    }
  }
}
</script>


<style lang="scss" scoped>

</style>