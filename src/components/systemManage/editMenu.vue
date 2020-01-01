<template>
  <div>
    <div class="title-box">>>编辑菜单</div>
        <hr/>
        <div class="item-box">
          <div class="item"><span>上级：</span><div>超级管理员</div></div>
          <div class="item"><span>名称：</span><el-input placeholder="请输入内容"></el-input></div>
          <div class="item"><span>链接：</span><el-input placeholder="请输入内容"></el-input></div>
          <div class="item"><span>序号：</span><el-input placeholder="请输入内容"></el-input></div>
          <div class="item">
            <span>状态：</span>
            <el-radio v-model="radio" label="1">显示</el-radio>
            <el-radio v-model="radio" label="2">隐藏</el-radio>
          </div>
          <el-row>
            <el-button type="primary">保存</el-button>
            <el-button type="danger">取消</el-button>
          </el-row>
        </div>
  </div>
</template>


<script>
  export default{
    data(){
      return{
        radio: '1'
      }
    }
  }
</script>

<style lang="scss" scoped>
.item-box{
  .item{
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .el-input{
      width:300px;
    }
  }
}
</style>