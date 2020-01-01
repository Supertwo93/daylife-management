<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>参数设置</el-breadcrumb-item>
      <el-breadcrumb-item>分校规则设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :inline="true" label-width="370px" ref="form" :model="form" >
        <el-form-item :label="dict[key]" v-for="(value,key,index) in form" :key="index">
          <el-input v-model.number="form[key]" type="number"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="saveRules" type="primary">保存</el-button>
    </el-card>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        form: {
          invitedMerchantMinMoney: '',
          invitedMerchantMaxMoney: '',
          invitedMerchantMoneyAvglimit: '',
          invitedUserMinMoney: '',
          invitedUserMaxMoney: '',
          invitedUserMoneyAvglimit: '',
          agentCommissionMultiple: '',
          firstAgentCommissionMultiple: '',
          firstAgentMerchantcommissionPercentage:'',
          firstAgentMerchantcommissionWithinYears:'',
          highAgentMerchantcommissionPercentage:'',
          highAgentMerchantcommissionWithinYears:'',
          invitedMerchantcountUpgradeAgent:'',
          invitedUsercountUpgradeAgent:'',
          invitedMerchantcountUpgradeFirstAgent:'',
          invitedUsercountUpgradeFirstAgent:'',
          invitedMerchantcountUpgradeHighAgent:'',
          invitedUsercountUpgradeHighAgent:'',
          highAgentCashDeposit:''
        },
        dict:{
          invitedMerchantMinMoney: '邀请了“商家”，最小佣金（元）',
          invitedMerchantMaxMoney: '邀请了“商家”，最大佣金（元）',
          invitedMerchantMoneyAvglimit: '邀请了“商家”，平均佣金不超过N元',
          invitedUserMinMoney: '邀请了“APP新用户”，最小佣金（元）',
          invitedUserMaxMoney: '邀请了“APP新用户”，最大佣金（元）',
          invitedUserMoneyAvglimit: '邀请了“商家”，平均佣金不超过N元',
          agentCommissionMultiple: '“代理商”佣金倍数（为普通用户所得佣金的倍数）',
          firstAgentCommissionMultiple: '“一级代理商”佣金倍数（为普通用户所得佣金的倍数）',
          firstAgentMerchantcommissionPercentage:'一级代理商对“商家提成收入”的百分比 N',
          firstAgentMerchantcommissionWithinYears:'一级代理商对N年内“商家提成收入”收佣金',
          highAgentCommissionMultiple:'高级代理商”佣金倍数（为普通用户所得佣金的倍数）',
          highAgentMerchantcommissionPercentage:'高级代理商对“商家提成收入”的百分比 N',
          highAgentMerchantcommissionWithinYears:'高级代理商对N年内“商家提成收入”收佣金',
          invitedMerchantcountUpgradeAgent:'邀请N个“商家”开店，升级为“代理商”',
          invitedUsercountUpgradeAgent:'邀请N个“APP新用户”，升级为“代理商”',
          invitedMerchantcountUpgradeFirstAgent:'邀请N个“商家”开店，升级为“一级代理商”',
          invitedUsercountUpgradeFirstAgent:'邀请N个“APP新用户”，升级为“一级代理商”',
          invitedMerchantcountUpgradeHighAgent:'邀请N个“商家”开店，升级为“高级代理商”',
          invitedUsercountUpgradeHighAgent:'邀请N个“APP新用户”，升级为“高级代理商”',
          highAgentCashDeposit:'“高级代理商”的保证金（元）'
        },
        id:''
      }
    },
    created(){
      this.getList()
    },
    methods: {
      async getList(){
        const {data:res} = await this.$http.get('/back/tb-systemparam-invited/get',)
        this.id = res.data.systemparamInvitedId
        this.form = res.data
        delete(this.form.createTime)
        delete(this.form.updateTime)
        delete(this.form.systemparamInvitedId)
      },
      async saveRules(){
        let req = this.form
        req.systemparamInvitedId = this.id
        const { data:res } = await this.$http.post('/back/tb-systemparam-invited/update',req)
        if(res.resultCode!==1){
          return this.$message.error(res.message)
        }
        this.$message.success('保存分销规则成功')
      }
    }
  }
</script>