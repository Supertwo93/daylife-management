<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="4">
          <span style="width:70px">名称</span>
          <el-input clearable @change="titleChange" v-model="queryInfo.title"></el-input>
        </el-col>
        <el-col :span="4">
          <span style="width:70px">类型：</span>
          <el-select @change="typeChange" clearable v-model="queryInfo.type" placeholder="请选择">
            <el-option
              v-for="(item,index) in typeOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <span style="width:90px">所属分类：</span>
          <el-select @change="cateChange" clearable v-model="queryInfo.serviceColumn" placeholder="请选择">
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
        :data="couponList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          label="优惠券名称"
          prop="title"
          align="center">
        </el-table-column>
        <el-table-column
          prop="count"
          label="数量"
          align="center">
        </el-table-column>
        <el-table-column
        prop="fullMoney"
        align="center"
        label="满减金额">
        </el-table-column>
        <el-table-column
          prop="discountPer"
          align="center"
          label="折扣百分比">
        </el-table-column>
        <el-table-column
          prop="enchangeStore"
          align="center"
          label="兑换积分数">
        </el-table-column>
        <el-table-column
          align="center"
          label="是否允许积分兑换">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.isExchange===1">是</el-tag>
            <el-tag type="warning" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
        align="center"
        label="服务类型">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.serviceColumn==1">生活</el-tag>
            <el-tag v-if="scoped.row.serviceColumn==2">代购</el-tag>
            <el-tag v-if="scoped.row.serviceColumn==3">家政</el-tag>
            <el-tag v-if="scoped.row.serviceColumn==4">金融</el-tag>
            <el-tag v-if="scoped.row.serviceColumn==5">房屋</el-tag>
            <el-tag v-if="scoped.row.serviceColumn==6">维修</el-tag>
          </template>
        </el-table-column>
        <el-table-column
        align="center"
        label="优惠券类型">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.type==1">满减券</el-tag>
            <el-tag v-if="scoped.row.type==2">折扣券</el-tag>
            <el-tag v-if="scoped.row.type==3">新人券</el-tag>
            <el-tag v-if="scoped.row.type==4">首单券</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="useStartDateTime"
          label="可使用开始时间"
          align="center">
          </el-table-column>
        <el-table-column
          prop="useEndDateTime"
          align="center"
          label="可使用结束时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scoped">
            <!-- 删除按钮 -->
            <el-button type="danger" @click="deleteCouponById(scoped.row)" icon="el-icon-delete" size="mini"></el-button>
            
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="添加优惠券" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input type="number" v-model="addForm.count"></el-input>
          </el-form-item>
          <el-form-item label="优惠类型">
            <el-select style="width:100%" clearable v-model="addForm.discountType" placeholder="请选择">
              <el-option
                v-for="(item,index) in discountTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="addForm.discountType==2" label="折扣百分比"> 
            <el-input type="number" v-model.number="addForm.discountPer"></el-input>
          </el-form-item>
          <el-form-item v-if="addForm.discountType==1" label="满金额">
            <el-input v-model="addForm.fullMoney"></el-input>
          </el-form-item>
          <el-form-item v-if="addForm.discountType==1" label="减金额" prop="reduceMoney">
            <el-input v-model="addForm.reduceMoney"></el-input>
          </el-form-item>
          <el-form-item label="兑换积分数">
            <el-input v-model="addForm.exchangeStore"></el-input>
          </el-form-item>
          <el-form-item label="是否允许兑换">
            <el-select style="width:100%" v-model="addForm.isExchange" placeholder="请选择">
              <el-option
                v-for="(item,index) in exchangeOptions"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领取后有效天数">
            <el-input v-model="addForm.reDaysUse"></el-input>
          </el-form-item>
          <el-form-item label="可领取时间">
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="reDateChange"
              v-model="reDate"
              type="daterange"
              range-separator="至"
              :picker-options="datePickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="可使用时间">
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="useDateChange"
              v-model="useDate"
              type="daterange"
              range-separator="至"
              :picker-options="datePickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="addForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="服务类型">
            <el-select v-model="addForm.serviceColumn" placeholder="请选择">
              <el-option
                v-for="(item,index) in cateOptions"
                :key="index"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="addForm.status" placeholder="请选择">
              <el-option
                v-for="(item,index) in statusOptions"
                :key="index"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券类型">
            <el-select v-model="addForm.type" placeholder="请选择">
              <el-option
                v-for="(item,index) in typeOptions"
                :key="index"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button @click="addCoupon" type="primary">确 定</el-button>
        </span>
      </el-dialog>
      
      <div class="bottom">
        <el-button @click="addDialogVisible = true" type="success">新增</el-button>
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
  </div>
</template>


<script>
export default {
  data(){
    return{
      couponList:[],
      queryInfo:{
        pageNo:1,
        pageSize:10,
        title:'',
        type:'',
        serviceColumn:''
      },
      total:1,
      type:'',
      status:'',
      discountTypeOptions:[
        {name:'满减',id:1},
        {name:'折扣',id:2}
      ],
      typeOptions:[
        {name:'满减券',id:1},
        {name:'折扣券',id:2},
        {name:'新人券',id:3},
        {name:'首单券',id:4},
      ],
      cateOptions:[
        {name:'生活',id:1},
        {name:'代购',id:2},
        {name:'家政',id:3},
        {name:'金融',id:4},
        {name:'房屋',id:5},
        {name:'维修',id:6},
      ],
      exchangeOptions:[
        {name:'是',id:1},
        {name:'否',id:0}
      ],
      statusOptions:[
        {name:'启用',id:1},
        {name:'禁用',id:0},
      ],
      addDialogVisible:false,
      addForm:{
        count:'',
        discountPer: '',
        discountType: '',
        exchangeStore: '',
        fullMoney: '',
        isExchange: '',
        reDaysUse: '',
        reEndDateTime:'',
        reStartDateTime: '',
        reduceMoney: '',
        remark: '',
        serviceColumn: '',
        status: '',
        title: '',
        type: '',
        useEndDateTime: '',
        useStartDateTime: ''
      },
      reDate:[],
      useDate:[],
      datePickerOptions:{
        disabledDate(time){
          return time.getTime() > Date.now()
        }
      },
      addFormRules:{
        title:[
          {required:true,message:'请输入标题',trigger:'blur'},
        ]
      },
    }
  },
  created(){
    this.getCouponList()
  },
  methods:{
    async getCouponList(){
      const {data:res} = await this.$http.get('/back/tbCoupon/selectList',{
        params:this.queryInfo
      })
      if(res.resultCode!==1){ return this.$message.error('获取优惠券列表失败')}
      this.couponList = res.data.records
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange(value){
      this.queryInfo.pageSize = value
      this.getCouponList()
    },
    handleCurrentChange(value){
      this.queryInfo.pageNo = value
      this.getCouponList()
    },
    typeChange(){
      this.queryInfo.pageNo = 1
      this.getCouponList()
    },
    cateChange(){
      this.queryInfo.pageNo = 1
      this.getCouponList()
    },
    titleChange(){
      this.queryInfo.pageNo = 1
      this.getCouponList()
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    reDateChange(value){
      if(value==null){
        this.addForm.reStartDateTime = ''
        this.addForm.reEndDateTime = ''
      }else{
        this.addForm.reStartDateTime = value[0]
        this.addForm.reEndDateTime  = value[1]
      }
    },
    useDateChange(value){
      if(value==null){
        this.addForm.useStartDateTime = ''
        this.addForm.useEndDateTime = ''
      }else{
        this.addForm.useStartDateTime = value[0]
        this.addForm.useEndDateTime = value[1]
      }
    },
    async addCoupon(){
      const {data:res} = await this.$http.post('/back/tbCoupon/add',this.addForm)
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.$message.success('添加优惠券成功')
      this.getCouponList()
      this.addDialogVisible = false 
    },
    async deleteCouponById(value){
      const confirmResult = await this.$confirm(
        '此操作将永久删除优惠券，是否继续',
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

      const {data:res} = await this.$http.delete('/back/tbCoupon/deleteById',{
        params:{couponId:value.couponId}
      })
      if(res.resultCode!==1){return this.$message.error(res.message)}
      this.$message.success('删除优惠券成功')
      this.getCouponList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row{
  margin-bottom: 10px;
}

.el-col{
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.bottom{
  display: flex;
  align-items: center;
  
}
</style>