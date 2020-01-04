import Vue from "vue";
import VueRouter from "vue-router";


const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/welcome.vue') 
const Menu = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/systemManage/menu.vue')
const MenuList = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/systemManage/menuList.vue')
const EditMenu = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/systemManage/editMenu.vue')
const AdminList = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/admin/adminList.vue')
const RolePermission = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/admin/rolePermission.vue')
const SellerList = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/seller/sellerList.vue')
const DistributionEdit = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/paramSetting/distributionEdit.vue')
const MemberList = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/member/memberList.vue')
const MemberReview = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/member/memberReview.vue')
const EnterpriseList = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/enterprise/enterpriseList.vue')
const GoodsList = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/goods/goodsList.vue')
const PromoteMember = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/promote/promoteMember.vue')
const PermissonManage = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/admin/permissonManage.vue')
const FinanceList = () => import(/*webpackChunkName:"login_home_welcome" */ '../components/goods/financeList.vue')
const HouseList = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/goods/houseList.vue')
const MemberCardList = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/goods/memberCardList.vue')
const CouponList = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/coupon/couponList.vue')
const BannerManage = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/operation/bannerManage.vue')
const OtherPosterManage = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/operation/otherPosterManage.vue')
const Withdraw = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/finance/withdraw.vue')
const StartupManage = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/operation/startupManage.vue')
const LifeServiceManage = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/operation/lifeServiceManage')
const PointSetting = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/point/pointSetting.vue')
const PointRuleSetting = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/point/pointRuleSetting.vue')
const GroundPushList = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/member/groundPushList.vue')
const SecondTypeManage = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/publish/secondTypeManage.vue')
const GoodsOrderList = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/order/goodsOrderList.vue')
const HouseSigningList = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/order/houseSigningList.vue')
const FinanceSigningList = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/order/financeSigningList.vue')
const EditPhone = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/service/editPhone.vue')
const FeedbackList = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/service/feedbackList.vue')
const UsercashflowList = ()=> import(/*webpackChunkName:"login_home_welcome" */ '../components/finance/usercashflowList')





Vue.use(VueRouter);

const routes = [
  { path: "/",redirect: "/login" },
  { path: "/login",component: Login},
  {
    path: "/home",
    component: Home,
    redirect:'/welcome',
    children: [
      {path: "/welcome",component: Welcome},
      {path:"/adminList",component:AdminList},
      {path:"/rolePermission",component:RolePermission},
      {path:"/sellerList",component:SellerList},
      {path:"/distributionEdit",component:DistributionEdit},
      {path:"/memberList",component:MemberList},
      {path:"/memberReview",component:MemberReview},
      {path:"/enterpriseList",component:EnterpriseList},
      {path:"/goodsList",component:GoodsList},
      {path:"/promoteMember",component:PromoteMember},
      {path:"/permissonManage",component:PermissonManage},
      {path:"/financeList",component:FinanceList},
      {path:"/houseList",component:HouseList},
      {path:"/memberCardList",component:MemberCardList},
      {path:"/couponList",component:CouponList},
      {path:"/bannerManage",component:BannerManage},
      {path:"/otherPosterManage",component:OtherPosterManage},
      {path:"/withdraw",component:Withdraw},
      {path:"/startupManage",component:StartupManage},
      {path:"/lifeServiceManage",component:LifeServiceManage},
      {path:"/pointSetting",component:PointSetting},
      {path:"/pointRuleSetting",component:PointRuleSetting},
      {path:"/groundPushList",component:GroundPushList},
      {path:"/secondTypeManage",component:SecondTypeManage},
      {path:"/goodsOrderList",component:GoodsOrderList},
      {path:"/houseSigningList",component:HouseSigningList},
      {path:"/financeSigningList",component:FinanceSigningList},
      {path:"/editPhone",component:EditPhone},
      {path:"/feedbackList",component:FeedbackList},
      {path:"/usercashflowList",component:UsercashflowList},
      {
        path:"/menu",
        component:Menu,
        redirect:'/menuList',
        children:[
          {path:"/menuList",component:MenuList},
          {path:"/editMenu",component:EditMenu}
        ]
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to,from,next) =>{
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router;
