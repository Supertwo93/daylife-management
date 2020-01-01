<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>积分管理</el-breadcrumb-item>
      <el-breadcrumb-item>积分设置</el-breadcrumb-item>
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
          prop="days"
          label="连续签到天数"
          align="center">
        </el-table-column>
         <el-table-column
          label="获得积分"
          prop="getStore"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="是否启用">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.status===1">是</el-tag>
            <el-tag v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
        align="center"
        prop="createTime"
        label="创建时间">
        </el-table-column>
        <el-table-column
        label="操作"
        align="center">
          <template slot-scope="scoped">
            <el-button type="primary" @click="openEditDialog(scoped.row)" size="mini">编辑</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="编辑规则" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="editForm" ref="editFormRef" label-width="120px">
          <el-form-item label="连续签到天数">
            <el-input type="number" v-model="editForm.days"></el-input>
          </el-form-item>
          <el-form-item label="获得积分">
            <el-input type="number" v-model="editForm.getStore"></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-select clearable @change="optionsChange" v-model="editForm.status" placeholder="请选择">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button @click="editRules" type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>


<script>
export default {
  data(){
    return{
      editDialogVisible:false,
      list:[],
      editForm:{
        days:'',
        getStore:'',
        status:'',
        sginstoreruleId:''
      },
      options:[
        {name:'是',id:1},
        {name:'否',id:0},
      ]
    }
  },
  created(){
    this.getPoint()
  },
  methods:{
    async getPoint(){
      const {data:res} = await this.$http.get('/back/tbSginstorerule/getListAll')
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.list = res.data.records
    },
    openEditDialog(value){
      this.editForm.days = value.days
      this.editForm.getStore = value.getStore
      this.editForm.status = value.status
      this.editForm.sginstoreruleId = value.sginstoreruleId
      this.editDialogVisible = true
    },
    async editRules(){
      const {data:res} = await this.$http.post('/back/tbSginstorerule/update',this.editForm)
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.$message.success('修改成功')
      this.getPoint()
      this.editDialogVisible = false
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

