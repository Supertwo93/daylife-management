<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>发布管理</el-breadcrumb-item>
      <el-breadcrumb-item>二级分类管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-row>
        <el-col :span="5">
          <el-input v-model="queryInfo.title" clearable @change="inputChange" suffix-icon="el-icon-search" placeholder="请输入商品名称"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button @click="addDialogVisible=true" type="success">新增</el-button>
        </el-col>
        <el-col>
          <span style="width:60px;margin-right:10px;">一级分类:</span>
          <el-select @change="cateChange" clearable v-model="queryInfo.firstTypeId" placeholder="请选择">
            <el-option
              v-for="(item,index) in cateOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>


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
          prop="firstType"
          label="一级分类"
          align="center">
        </el-table-column>
         <el-table-column
          label="分类名称"
          prop="title"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="操作"
          width="250">
          <template slot-scope="scoped">
            <el-button type="primary" @click="openEditDialog(scoped.row)" size="mini">编辑</el-button>
            <el-button type="danger" @click="deleteSecondType(scoped.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-dialog
        title="新增二级分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose">
        <el-form :model="addForm" ref="addFormRef" label-width="80px">
          <el-form-item label="一级分类">
            <el-select style="width:100%" clearable v-model="addForm.firstType" placeholder="请选择">
              <el-option
                v-for="(item,index) in firstTypeList"
                :key="index"
                :value="item.title">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="addForm.title" placeholder="请输入分类名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button @click="addSecondType" type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="编辑二级分类"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form :model="editForm" ref="editFormRef" label-width="80px">
          <el-form-item label="一级分类">
            <el-input disabled v-model="editForm.firstType"></el-input>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="editForm.title" placeholder="请输入分类名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button @click="editSecondType" type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>


<script>
export default {
  data(){
    return{
      list:[],
      queryInfo:{
        pageNo:1,
        pageSize:10,
        title:'',
        firstTypeId:''
      },
      firstTypeList:[],
      total:1,
      addDialogVisible:false,
      editDialogVisible:false,
      addForm:{
        firstType:'',
        title:''
      },
      editForm:{
        firstType:'',
        title:'',
        secondtypeinfoId:''
      },
      cateOptions:[
        {name:'生活',id:8},
        {name:'代购',id:10},
        {name:'家政',id:3},
        {name:'金融',id:5},
        {name:'房屋',id:1},
        {name:'维修',id:9},
        {name:'其它',id:4},
      ],
    }
  },
  created(){
    this.getList()
  },
  methods:{
    async getList(){
      const {data:res} = await this.$http.get('/back/tbSecondtypeinfo/selectList',{params:this.queryInfo})
      if(res.resultCode!==1){return this.$message.error('获取列表失败')}
      this.total = res.data.total
      this.list = res.data.records

      const {data:firstData} = await this.$http.get('/back/tbFirstTypeInfo/getListAll')
      if(firstData.resultCode!==1){return this.$message.error(res.message)}
      this.firstTypeList = firstData.data
    },
    handleSizeChange(value){
      this.queryInfo.pageSize = value
      this.getList()
    },
    handleCurrentChange(value){
      this.queryInfo.pageNo = value
      this.getList()
    },
    inputChange(){
      this.queryInfo.pageNo = 1
      this.getList()
    },
    async addSecondType(){
      if(this.addForm.firstType===''){
        return this.$message.info('请选择一级类')
      }
      if(this.addForm.title===''){
        return this.$message.info('请输入分类名称')
      }
      const {data:res} = await this.$http.post('/back/tbSecondtypeinfo/insert',this.addForm)
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.$message.success('添加成功')
      this.getList()
      this.addDialogVisible = false
    },
    addDialogClose(){
      this.addForm.title = ''
      this.addForm.firstType = ''
    },
    async editSecondType(){
      if(this.editForm.title===''){
        return this.$message.info('请输入分类名称')
      }
      const {data:res} = await this.$http.post('/back/tbSecondtypeinfo/update',this.editForm)
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.$message.success('编辑成功')
      this.getList()
      this.editDialogVisible = false
    },
    openEditDialog(value){
      this.editForm.secondtypeinfoId = value.secondtypeinfoId
      this.editForm.firstType = value.firstType
      this.editForm.title = value.title
      this.editDialogVisible = true
    },
    async deleteSecondType(value){
      const confirmResult = await this.$confirm(
        '此操作将永久删除二级分类，是否继续？',
        '提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).catch(err => err)

      if(confirmResult!=='confirm'){
        return this.$message.info('已取消删除')
      }

      const {data:res} = await this.$http.delete('/back/tbSecondtypeinfo/deleteById',{
        params:{secondtypeinfoId:value.secondtypeinfoId}
      })

      if(res.resultCode!==1){
        return this.$message.error(res.message)
      }

      this.$message.success('删除成功成功')
      this.getList()
    },
    cateChange(){
      this.queryInfo.pageNo = 1
      this.getList()
    }
  }
}
</script>


<style lang="scss" scoped>
.el-row{
  display: flex;
  align-items: center;
}


.el-button{
  margin-left: 10px;
}
</style>