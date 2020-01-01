<template>
  <div>

    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="4">
          <el-tree
            @node-click="nodeClick"
            style="height:800px;overflow:auto" 
            :data="treeList" 
            accordion 
            :props="defaultProps">
              
          </el-tree>
        </el-col>
        <el-col :span="20">
          <el-main style="height:800px;overflow:auto" >
            <router-view></router-view>
          </el-main>          
        </el-col>
      </el-row>
    </el-card>

  </div>
  
  
</template>


<script>
export default {
  data(){
    return{
      menuList:[],
      treeList:[],
      defaultProps:{
        label:'menuName',
        children:'childTreeList',
      },
      radio: '1'
    }
  },
  created(){
    this.getMenuList()
  },
  methods:{
    async getMenuList(){
      const {data:res} = await this.$http.get('/back/sys-menu/allTrees',{
        params:{
          "token":window.sessionStorage.getItem('token')
        }
      })
      this.menuList = res.data
      this.treeList = []
      let that = this
      for(let i of this.menuList){
        let obj = {}
        obj.menuName = i.menuName
        obj.childTreeList = []
        for(let j of i.childTreeList){
          let subObj = {}
          subObj.menuName = j.menuName
          obj.childTreeList.push(subObj)
        }
        that.treeList.push(obj)
      }
    },
    nodeClick(data){
      if(this.$route.path!="/editMenu"){
        this.$router.push('/editMenu')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-container{
  display: flex;
  flex-direction: column;
}

.main-box{
  display: flex;
  .el-tree{
    
    display: block;
  }
  .el-main{
    padding:0;
    
  }
}
</style>