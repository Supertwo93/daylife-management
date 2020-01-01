<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>积分管理</el-breadcrumb-item>
      <el-breadcrumb-item>积分设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <span style="width:200px">首次签到获得积分：</span>
          <el-input v-model="point"></el-input>
        </el-col>
        <el-button type="primary" @click="setPoint">保存</el-button>
      </el-row>
    </el-card>
  </div>
</template>


<script>
export default {
  data(){
    return{
      point:''
    }
  },
  created(){
    this.getPoint()
  },
  methods:{
    async getPoint(){
      const {data:res} = await this.$http.get('/back/tbSystemparam/getFirstSignStore')
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.point = res.data
    },
    async setPoint(){
      const {data:res} = await this.$http.post('/back/tbSystemparam/updateFirstSignStore',{firstSignStore:this.point})
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.$message.success('设置成功')
      this.getPoint()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-col{
  display: flex;
  align-items: center;
}
.el-button{
  margin-left: 10px;
}
</style>

