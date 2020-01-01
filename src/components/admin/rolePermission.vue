<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色（基础权限）</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table
        ref="multipleTable"
        border
        :data="roleList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          label="角色"
          prop="roleName"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scoped">
            <el-button type="success" size="mini" @click="openPermiDialog(scoped.row)">菜单权限</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="editRoleName(scoped.row)" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRoleById(scoped.row)" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="success" @click="addRoleDialogVisible=true" style="margin-top:10px">新增角色</el-button>
    </el-card>

    <el-dialog title="菜单权限" :visible.sync="permiDialogVisible" width="50%">
      <el-tree
      :data="treeList"
      show-checkbox
      :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTree">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑角色名" :visible.sync="editDialogVisible" width="50%">
      <el-input v-model="roleName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRoleName">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增角色" :visible.sync="addRoleDialogVisible" width="50%">
      <el-input v-model="addRoleName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data(){
    return{
      roleList:[],
      permiDialogVisible:false,
      editDialogVisible:false,
      addRoleDialogVisible:false,
      treeList:[],
      defaultProps:{
        children:'childTreeList',
        label:'menuName'
      },
      addRoleName:'',
      roleName:'',
      roleId:''
    }
  },
  created(){
    this.getRoleList()
    this.getAllTree()
  },
  methods:{
    async getRoleList(){
      const {data:res} = await this.$http.get('/back/sys-role/getListAll')
      if(res.resultCode!==1){
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data.records
    },
    async getAllTree(){
      const {data:res} = await this.$http.get('/back/sys-menu/allTrees')
      if(res.resultCode!==1){
        return this.$message.error('获取资源树失败')
      }
      console.log(res.data)
      this.treeList = res.data
    },
    openPermiDialog(){
      this.permiDialogVisible = true
    },
    saveTree(){
      this.permiDialogVisible = false
    },
    editRoleName(value){
      this.roleName = value.roleName
      this.roleId = value.roleId
      this.editDialogVisible = true
    },
    async changeRoleName(){
      const {data:res} = await this.$http.post('/back/sys-role/update',{roleName:this.roleName,roleId:this.roleId})
      if(res.resultCode!==1){
        return this.$message.error(res.message)
      }
      this.$message.success('修改角色名成功')
      this.getRoleList()
      this.editDialogVisible = false
    },
    async addRole(){
      const {data:res} = await this.$http.post('/back/sys-role/insert',{roleName:this.addRoleName})
      if(res.resultCode!==1){
        return this.$message.error('新增角色失败')
      }
      this.$message.success('新增角色成功')
      this.getRoleList()
      this.addRoleDialogVisible = false
    },
    async deleteRoleById(value){
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色，是否继续？',
        '提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).catch(err => err)

      if(confirmResult !== 'confirm'){
        return this.$message.info('已取消操作')
      }

      const {data:res} = await this.$http.delete('/back/sys-role/deleteById',{
        params:{
          roleId:value.roleId
        }
      })
      if(res.resultCode !== 1){
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRoleList()
    }
  }
}
</script>