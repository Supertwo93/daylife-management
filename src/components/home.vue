<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/img/logo.png" />
        <span>天天生活后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu v-for="(item,index) in menuList" :key="index" :index="index + ''">
            <template slot="title">
              <i :class="iconList[index]"></i>
              <span>{{item.menuName}}</span>
            </template>

            <el-menu-item :index="'/'+subItem.menuUrl" v-for="(subItem,subIndex) in item.childTreeList" :key="subIndex" @click="saveNavState('/' + subItem.menuUrl)">
              <template slot="title">
                <span>{{subItem.menuName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
      
    </el-container>


  </el-container>
</template>

<script>
export default {
  data(){
    return{
      isCollapse:false,
      activePath:'',
      menuList:[],
      imgList:[
        require('../assets/icon/1shouye.svg'),
        require('../assets/icon/2guanliyuan.svg'),
        require('../assets/icon/3huiyuan.svg'),
        require('../assets/icon/4qiye.svg'),
        require('../assets/icon/5xuqiu.svg'),
        require('../assets/icon/6dingdan.svg'),
        require('../assets/icon/7service.svg'),
        require('../assets/icon/8canshu.svg'),
        require('../assets/icon/9choujiang.svg'),
      ],
      iconList:[
        'el-icon-location-outline',
        'el-icon-coordinate',
        'el-icon-user',
        'el-icon-office-building',
        'el-icon-folder',
        'el-icon-video-camera',
        'el-icon-wallet',
        'el-icon-monitor',
        'el-icon-money',
        'el-icon-date',
        'el-icon-c-scale-to-original',
        'el-icon-shopping-bag-1',
        'el-icon-goods',
        'el-icon-setting',
      ]
    }
  },
  created(){
    this.getMenuList()
  },
  methods:{
    logout(){

    },
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('/back/sys-menu/selectUserTree',{
        params:{
          "token":window.sessionStorage.getItem('token')
        }
      })
      this.menuList = res.data
      console.log(this.menuList)
    },
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container{
  height:100%;
}
.el-header{
  background-color: #3d3741;
  display: flex;
  justify-content: space-between;
  padding-left:0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div{
    display:flex;
    align-items: center;
    img{
      width:50px;
      height:50px;
    }
  }
}


.svg-icon{
  width: 24px;
  height: 24px;
  svg{
    fill: #ff6600;
  }
  overflow: hidden;
}

.el-aside{
  background-color: #333744;
  .el-menu{
    border-right:none;
  }
}

.el-main{
  background-color: #eaedf1;
}

.toggle-button{
  background-color: #4a5064;
  font-size:10px;
  line-height:24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>