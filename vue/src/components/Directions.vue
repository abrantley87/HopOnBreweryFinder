<template>
  <div>

<div v-on:click="origin() + destionation()+ addWayPoints()" class="button">ROUTE MY CRAWL</div>


    <GmapMap :zoom="10" :center="{ lat: 39.9612, lng: -82.9988 }">
      <DirectionsRenderer travelMode="DRIVING" :origin="origin2" :destination="destionation2" :waypoints="waypoints1" />
    </GmapMap>

  </div>
</template>

<script>
import GoogleService from '../services/GoogleService.js'
import DirectionsRenderer from "@/components/DirectionsRenderer";

export default {
  components: {
    DirectionsRenderer
  },
  props:['barCrawl','showMap'],

  data(){
    return{
    start: '',
    end: '',
    waypts:[],
    otherArray:[]
      }
    },

 
  

  

  computed: {

    itemsLength() {
      return this.barCrawl.length
    },
 
    origin2() {
      
      if (!this.start) return null;
      return { query: this.start };
    },
    destionation2() {
      if (!this.end) return null;
      return { query: this.end };
    },
    waypoints1(){
      let otherArray=[];
      this.waypts.forEach((brewery)=>{
      let object= {};
      object.location=brewery.address;
      object.stopover=true;
      otherArray.push(object)
      })
      return otherArray
      },

  },

    

    methods:{
    origin() {
      console.log("hit origin")
      this.start=this.$store.state.userInfo.address;
      if (!this.start) return null;
      return { query: this.start };
    },
    destionation() {
    console.log('hit destination')
    console.log(this.barCrawl)
    this.end=this.barCrawl[this.barCrawl.length-1].address;
      if (!this.end) return null;
      return { query: this.end };
  
    },
    addWayPoints(){
      if (this.barCrawl.length>1){
        for(let i=0; i<this.barCrawl.length-1; i++){
          this.waypts.push(this.barCrawl[i])
        }
      }
    },



    getLocations(address){
            GoogleService.get(address).then((response)=>{
                if (response.data.error_message){
                    console.log(response.data.error_message);
                }else{
                  let location={};
                    location.lat=response.data.results[0].geometry.location.lat;
                    location.lng=response.data.results[0].geometry.location.lng;
                    return location;
                }
            }).catch((error)=>{
                console.log(error.message)
            })
            
        

    },


    
  },

  created(){
  }


};
</script>

<style scoped>
.vue-map-container {
  height: 300px;
  width: 80%;
  height: 400px;
}

    .button {
        background-color: rgb(65, 65, 65);
        width: 80%;
        height: 40px;
        text-align: center;
        color: white;
        border-radius: 5px;
        font-size: 1.2em;
        display: flex;
        align-items: center;
        justify-content: center;
        
        
    }

    .button:hover {
        background-color: rgb(0, 0, 0);
        color: rgb(255, 255, 255);
        cursor: pointer;
    }
</style>