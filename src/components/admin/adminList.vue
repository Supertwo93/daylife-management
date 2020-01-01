<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="4">
          <el-input @change="keywordChange" clearable placeholder="请输入内容" v-model="queryInfo.keyword" prefix-icon="el-icon-search"></el-input>
        </el-col>
        <el-select clearable @change="roleChange" v-model="role" placeholder="请选择">
          <el-option
            v-for="(item,index) in roleOptions"
            :key="index"
            :value="item.roleId"
            :label="item.roleName">
          </el-option>
        </el-select>
        <el-select clearable @change="statusChange" v-model="status" placeholder="请选择">
          <el-option
            v-for="(sitem,sindex) in statusOptions"
            :key="sindex"
            :value="sitem">
          </el-option>
        </el-select>
        <el-button type="primary" @click="searchAll">全部</el-button>
      </el-row>

      <el-table
        ref="multipleTable"
        border
        @selection-change="handleSelectionChange"
        :data="adminList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          align="center">
        </el-table-column>
        <el-table-column
          prop="truename"
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="lastLogin"
          align="center"
          label="最后登录时间">
        </el-table-column>
        <el-table-column
          prop="ip"
          align="center"
          label="最后登录ip">
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="">

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
            <!-- 修改按钮 -->
            <el-button type="primary" @click="openEditDialog(scoped.row)" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" @click="deleteUserById(scoped.row)" icon="el-icon-delete" size="mini"></el-button>
            
          </template>
        </el-table-column>
      </el-table>

      <div class="bottom">
        <el-button @click="addDialogVisible = true" type="success">新增</el-button>
        <el-button @click="deleteBatch" type="danger" icon="el-icon-delete"></el-button>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNo"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input show-password v-model="addForm.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="truename">
          <el-input v-model="addForm.truename"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select @change="addRoleChange" v-model="addrole" placeholder="请选择">
            <el-option
              v-for="(item,index) in roleOptions"
              :key="index"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select @change="addStatusChange" v-model="addstatus" placeholder="请选择">
            <el-option
              v-for="(sitem,sindex) in statusOptions"
              :key="sindex"
              :value="sitem">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.bz" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input show-password v-model="editForm.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="truename">
          <el-input v-model="editForm.truename"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select @change="editRoleChange" v-model="editrole" placeholder="请选择">
            <el-option
              v-for="(item,index) in roleOptions"
              :key="index"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select @change="editStatusChange" v-model="editstatus" placeholder="请选择">
            <el-option
              v-for="(sitem,sindex) in statusOptions"
              :key="sindex"
              :value="sitem">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.bz" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  
  data(){
    var checkEmail = (rule,value,cb) =>{
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    var confirmPass = (rule,value,cb) =>{
      if(value===''){
        cb(new Error('请再次输入密码'))
      }else if(value !== this.addForm.password){
        cb(new Error('两次输入密码不一致'))
      }else{
        cb()
      }
    }
    return{
      addForm: {
        username: '',
        password: '',
        confirmPassword:'',
        truename:'',
        roleId:'',
        status:'',
        bz:'',
        email: '',
        phone: ''
      },
      editForm:{
        userId:'',
        username: '',
        password: '',
        confirmPassword:'',
        truename:'',
        roleId:'',
        status:'',
        bz:'',
        email: '',
        phone: ''
      },
      roleOptions: [
        '超级管理员',
        '管理员'
      ],
      statusOptions:['正常','禁用'],
      adminList:[],
      role:'',
      addrole:'',
      editrole:'',
      status:'',
      addstatus:'',
      editstatus:'',
      queryInfo:{
        pageNo:1,
        pageSize:10,
        keyword:'',
        status:'',
        roleId:'',
      },
      total:1,
      addDialogVisible:false,
      editDialogVisible:false,
      addFormRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {
            min:3,
            max:10,
            message:'用户名的长度在3~10个字符之间',
            trigger:'blur'
          }
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {
            min:6,
            max:15,
            message:'密码的长度在6~15个字符之间',
            trigger:'blur'
          }
        ],
        confirmPassword:[
          { required:true,message:'请输入确认密码',trigger:'blur'},
          { validator:confirmPass,trigger:'blur'}
        ],
        truename:[
          {required:true,message:'请输入姓名',trigger:'blur'},
          {
            min:3,
            max:10,
            message:'姓名的长度在3~10个字符之间',
            trigger:'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules:{
        password:[
          {
            min:6,
            max:15,
            message:'密码的长度在6~15个字符之间',
            trigger:'blur'
          }
        ],
        truename:[
          {required:true,message:'请输入姓名',trigger:'blur'},
          {
            min:3,
            max:10,
            message:'姓名的长度在3~10个字符之间',
            trigger:'blur'
          }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      idList:''
    }
  },
  created(){
    this.getAdminList()
    this.getRoleNameList()
  },
  methods:{
    handleSizeChange(val) {
      this.queryInfo.pageSize = val
      this.getAdminList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val
      this.getAdminList()
    },
    async getAdminList(){
      const { data:res } = await this.$http.get('/back/sysUser/getListAll',{
        params:this.queryInfo
      })
      this.total = res.data.total
      console.log(res)
      this.adminList = res.data.records
    },
    async getRoleNameList(){
      const {data:res} = await this.$http.get('/back/sys-role/getList')
      this.roleOptions = res.data
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    addUser(){
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('/back/sysUser/insert', this.addForm)
        if (res.resultCode !== 1) {
          return this.$message.error(res.message)
        }
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        this.getAdminList()
      })
    },
    editUser(){
      this.$refs.editFormRef.validate(async valid =>{
        if (!valid) return
        const {data:res} = await this.$http.post('/back/sysUser/update',this.editForm,{
          params:{token:window.sessionStorage.getItem('token')}
        })
        if(res.resultCode !==1){
          return this.$message.error(res.message)
        }
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getAdminList()
      })
    },
    addRoleChange(item){
      this.addForm.roleId = item
    },
    editRoleChange(item){
      this.editForm.roleId = item
    },
    addStatusChange(item){
      if(item=='正常'){
        this.addForm.status = 0
      }else{
        this.addForm.status = 1
      }
    },
    editStatusChange(item){
      if(item=='正常'){
        this.editForm.status = 0
      }else{
        this.editForm.status = 1
      }
    },
    openEditDialog(value){
      this.editrole = value.roleName
      if(value.status==0){
        this.editstatus = '正常'
      }else{
        this.editstatus = '禁用'
      }
      this.editForm.userId = value.userId
      this.editForm.username = value.username
      this.editForm.truename = value.truename
      this.editForm.roleId = value.roleId
      this.editForm.status = value.status
      this.editForm.bz = value.bz
      this.editForm.email = value.email
      this.editForm.phone = value.phone
      this.editDialogVisible = true
    },
    async deleteUserById(value){
      const confirmResult = await this.$confirm(
        '此操作将永久删除该管理员，是否继续？',
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

      const {data:res} = await this.$http.delete('/back/sysUser/deleteById',{
        params:{userId:value.userId}
      })

      if(res.resultCode!==1){
        return this.$message.error('删除管理员失败!')
      }

      this.$message.success('删除管理员成功')
      this.getAdminList()
    },
    keywordChange(){
      this.getAdminList()
    },
    roleChange(value){
      this.queryInfo.roleId = value
      this.getAdminList()
    },
    statusChange(value){
      if(value==''){
        this.queryInfo.status = ''
      }else if(value==='正常'){
        this.queryInfo.status = 0
      }else{
        this.queryInfo.status = 1
      }
      this.getAdminList()
    },
    searchAll(){
      this.status = ''
      this.queryInfo.status = ''
      this.role = ''
      this.queryInfo.roleId = ''
      this.queryInfo.keyword = ''
      this.queryInfo.pageNo = 1
      this.queryInfo.pageSize = 10
      this.getAdminList()
    },
    handleSelectionChange(value){
      if(value.length===0){
        this.idList = ''
      }else{
        let arr = []
        for(let i of value){
          arr.push(i.userId)
        }
        this.idList = arr.toString()
      }
    },
    async deleteBatch(){
      if(this.idList===''){
        this.$message.error('请选择要删除的管理员')
      }else{
        const confirmResult = await this.$confirm(
          '此操作将永久删除管理员，是否继续？',
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

        const {data:res} = await this.$http.delete('/back/sysUser/deleteBatch',{
          params:{token:window.sessionStorage.getItem('token'),idList:this.idList}
        })

        if(res.resultCode!==1){
          return this.$message.error('删除管理员失败!')
        }

        this.$message.success('删除管理员成功')
        this.getAdminList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-col{
  margin-right: 10px;
}
.el-select{
  margin-right: 10px;
}

.el-table{
  margin-bottom: 10px;
}

.bottom{
  display: flex;
  align-items: center;
  
}


.el-pagination{
  margin-top: 0;
}
</style>