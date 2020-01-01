<template>
  <el-table
    :data="menuList"
    style="width: 100%">
    <el-table-column
    type="index">
    </el-table-column>
    <el-table-column
      prop="menuName"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="menuUrl"
      label="资源路径">
    </el-table-column>
    <el-table-column
      prop=""
      label="状态">
      <template slot-scope="scope">
        <el-switch>
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      prop=""
      label="操作">
      <template slot-scope="scope">
        <!-- 修改按钮 -->
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        <!-- 分配角色按钮 -->
        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default{
    data(){
      return{
        menuList:[]
      }
    },
    methods:{
      async getMenuList(){
        const {data:res} = await this.$http.get('/back/sys-menu/allTrees',{
          params:{
            "token":window.sessionStorage.getItem('token')
          }
        })
        this.menuList = res.data
        console.log(this.menuList)
      },
    },
    created(){
      this.getMenuList()
    }
  }
</script>

<style lang="scss" scoped>
  .el-table{
    padding:0 10px;
    margin-top: 0;
  }
</style>