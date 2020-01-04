<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>客服管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户意见反馈</el-breadcrumb-item>
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
          label="反馈用户"
          align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容详情"
          align="center">
        </el-table-column>
        <el-table-column
          label="是否已读"
          align="center">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.isRead==0">未读</el-tag>
            <el-tag v-if="scoped.row.isRead==1">已读</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scoped">
            <el-button @click="setRead(scoped.row)" size="mini" type="success" v-if="scoped.row.isRead==0">标为已读</el-button>
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
      queryInfo:{
        pageNo:1,
        pageSize:10
      },
      list:[]
    }
  },
  created(){
    this.getList()
  },
  methods:{
    async getList(){
      const {data:res} = await this.$http.get('/back/tbFeedback/selectList',{params:this.queryInfo})
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.list = res.data.records
    },
    async setRead(value){
      const {data:res} = await this.$http.post('/back/tbFeedback/updateIsRead',{feedbackId:value.feedbackId})
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.$message.success('标记成功')
      this.getList()
    }
  }
}
</script>