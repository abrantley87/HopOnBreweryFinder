<template>
  <div class="beerListContainer">
      <beer-list>
      </beer-list>
       <!-- <beer-detail/> -->
  </div>
</template>

<script>
// import BeerDetail from '../components/BeerDetail.vue'
import BeerList from '../components/BeerList.vue'
export default {
    name: 'beers',
  components: { BeerList, 
  // BeerDetail
  },

}
</script>

<style scoped>

.beerListContainer {
     background: url("../resources/background-image.jpg")
 no-repeat center center fixed; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100%;
  background-color: black;

}
</style>