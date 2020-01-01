<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页banner广告管理</el-breadcrumb-item>
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
          prop="title"
          label="标题"
          align="center">
        </el-table-column>
         <el-table-column
          label="图文详情"
          prop="content"
          align="center">
        </el-table-column>
        <el-table-column
          prop="lastLogin"
          align="center"
          width="160"
          label="图片">
          <template slot-scope="scoped">
            <viewer :images="scoped.row.coverImg"> 
              <img style="width:100px;height:100px" :src="img" v-for="(img,number) in scoped.row.coverImg" :key="number">
            </viewer>
          </template>
        </el-table-column>
        <el-table-column
          prop="startDateTime"
          align="center"
          label="上线时间">
        </el-table-column>
        <el-table-column
          prop="endDateTime"
          align="center"
          label="下线时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="跳转类型">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.skipType==1">跳转链接</el-tag>
            <el-tag v-else-if="scoped.row.skipType==2">图文详情</el-tag>
            <el-tag v-else>已发布信息</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="状态">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.status==1">上线</el-tag>
            <el-tag v-else>下线</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          align="center"
          label="排序">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="350">
          <template slot-scope="scoped">
            <el-button @click="showPassDialog(scoped.row)"  type="success" size="mini">上线</el-button>
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button  type="danger" size="mini">删除</el-button>
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
      const { data:res } = await this.$http.get('/back/tbStripadvertOther/getListAll2')
      if(res.resultCode!==1){return this.$message.error(res.message)}
      for(let i of res.data.records){
        i.coverImg = Array.of(i.coverImg)
      }
      this.list = res.data.records
    }
  },
}
</script>