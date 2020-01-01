<template>
  <div>
    <el-select clearable @change="memberChange" v-model="userId" placeholder="请选择" style="margin-bottom:10px">
      <el-option
        v-for="(item,index) in options"
        :key="index"
        :value="item.userId"
        :label="item.nickName">
      </el-option>
    </el-select>
    <div id="map">
      
    </div>
  </div>
  
</template>
 
<script>
import BMap from 'BMap'
export default {
  name: 'Map',
  data () {
    return {
      options:'',
      userId:''
    }
  },
  methods: {
    async getMemberList(){
      const {data:res} = await this.$http.post('/back/tbGroundPushTrajectory/findGgroundPushNameList')
      if(res.resultCode!==1){return this.$message.error('获取地推人员失败')}
      this.options = res.data
      console.log(this.options)
    },
    async createMap () {

      const {data:res} = await this.$http.post('/back/tbGroundPushTrajectory/findGgroundPushList',{},{params:{userId:this.userId}})
      if(res.resultCode!==1){return this.$message.error(res.message)}
      if(res.data.length===0){
        var map = new BMap.Map("map");
	      var point = new BMap.Point(114.258154,22.728015);
        map.centerAndZoom(point, 18);
      }
      let startLon = parseInt(res.data[0].longitude)
      let endLat = parseInt(res.data[0].latitude) 
      var map = new BMap.Map("map");
	    var point = new BMap.Point(res.data[0].longitude,res.data[0].latitude);
      map.centerAndZoom(point, 18);
      var opts = {
        width:250,
        height:80,
        title:'位置信息',
        enableMessage:true
      }

      for(let i of res.data){
        var marker = new BMap.Marker(new BMap.Point(parseFloat(i.longitude),parseFloat(i.latitude)))
        var day = new Date(i.createTime)
        
        var time = day.toLocaleString().replace(/:\d{1,2}$/,' ')
        map.addOverlay(marker)
        addClickHandler(time,marker)
      }

      function addClickHandler(time,marker){
        marker.addEventListener("click",function(e){
          openInfo(time,e)
        })
      }

      function openInfo(time,e){
        var p = e.target
        var point = new BMap.Point(p.getPosition().lng,p.getPosition().lat);
        console.log(time)
        var infoWindow = new BMap.InfoWindow(time,opts)
        map.openInfoWindow(infoWindow,point)
      }
    },
    memberChange(){
      console.log(this.member)
      this.createMap()
    }
  },
  mounted () {
    this.getMemberList()
    this.createMap()
  }
}
</script>
<style scoped lang="scss">
#map{
  min-height:100vh;
}
</style>