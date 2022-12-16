<template>
  <div class="whole-element">
    <div class="header">
      <h1 id="welcome-name" v-show="$store.state.token != ''">
        {{ this.firstName }}'s Passport
      </h1>
    </div>
    <div class="boxes">
      <div class="left-container">
        <div class="welcome">
          <div id="user-avatar">
            <img :src="imageUrl" />
          </div>
        </div>
      </div>
      <div class="middle-container">
        <h1>Favorites</h1>
        <div class="text-container">
          <div id="favorite-brewery">
            <h3>Favorite Brewery: {{ favoriteBrewery }}</h3>
          </div>
          <div id="favorite-beer">
            <h3>Favorite Beer: Nikola</h3>
          </div>
          <div id="beers-drank">
            <h3>Number of Beers Tried: {{ allBeers }}</h3>
          </div>
          <div id="beer-passport">
            <h3>Number of Beers in Passport: {{ totalBeers }}</h3>
          </div>
        </div>
      </div>
      <div class="right-container">
        <h1>Hop Rank</h1>
        <img
          src="../resources/LowScore.png"
          v-if="this.allBeers >= 0 && this.allBeers < 4"
        />
        <img
          src="../resources/MidScore.png"
          v-if="this.allBeers >= 4 && this.allBeers < 8"
        />
        <img src="../resources/HighScore.png" v-if="this.allBeers >= 8" />
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "../services/AuthService.js";

export default {
  name: "userProfile",
  props: ["passport"],
  data() {
    return {
      drankBeers: [],
      // beersInPassport: [],

      // numberOfBeersDrank: 0,
      // numberOfTotalBeers: 0,
    };
  },

  computed: {
    totalBeers() {
      let numberOfBeersDrank = 0;

      let thisPassport = [];
      thisPassport = this.passport;

      Object.values(thisPassport).forEach((brewery) => {
        brewery.passportBeers.forEach((beer) => {
          numberOfBeersDrank += 1;
          if (beer.drank) {
            // this.drankBeers.push(beer.beerName);
          }
        });
      });
      return numberOfBeersDrank;
    },

    favoriteBrewery() {
      let favorite = 0;
      let favBrewery = "";

      let thisPassport = [];
      thisPassport = this.passport;

      Object.values(thisPassport).forEach((brewery) => {
        let beerCounter = 0;

        brewery.passportBeers.forEach((beer) => {
          if (beer.beerName != "") {
            beerCounter++;
          }
        });

        if (beerCounter > favorite) {
          favorite = beerCounter;
          favBrewery = brewery.breweryName;
        }
      });

      return favBrewery;
    },

    firstName() {
      return this.$store.state.userInfo.userFirstName;
    },
    passportBrews() {
      return this.$store.state.passportBeers;
    },

    imageUrl() {
      return this.$store.state.userInfo.imgURL;
    },

    allBeers() {
      //   let allBreweries = this.passport;
      let numberOfBeersDrank = 0;
      let thisPassport = [];
      thisPassport = this.passport;

      Object.values(thisPassport).forEach((brewery) => {
        // this.$store.commit("PASSPORT_BEERS", brewery);

        brewery.passportBeers.forEach((beer) => {
          if (beer.drank) {
            this.drankBeers.push(beer.beerName);

            numberOfBeersDrank += 1;
          }
        });
      });
      return numberOfBeersDrank;
    },
  },

  methods: {
    getUserInfo() {
      AuthService.get(this.$store.state.user.id).then((response) => {
        this.$store.commit("SET_USER_INFO", response.data);
      });
    },
  },

  created() {
    // this.score();
    // this.getUserInfo();
  },
};
</script>

<style scoped>
/* MAIN CONTAINER CSS */

.whole-element {
  margin: 20px 0px;
  color: white;
  padding: 15px 0px;
  text-align: center;
  width: 100vw;
  background-color: rgba(99, 98, 98, 0.718);
  text-shadow: 6px 6px 6px #272727;
}

/* HEADER CSS */
.header {
  margin-top: 0;
  margin-bottom: 0;
  height: 100px;
  font-size: 2em;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.boxes {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "left center right";
}

/* LEFT BOX STUFF */
.left-container {
  grid-area: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#user-avatar img {
  border-radius: 100%;
  width: 200px;
  margin: 25px;
  border: 2px solid black;
}

/* MIDDLE BOX CSS */

.middle-container {
  grid-area: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.middle-container h1 {
  margin-top: 10px;
}

/* RIGHT BOX CSS */

.right-container {
  grid-area: right;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.right-container h1 {
  margin-top: 10px;
  margin-bottom: 0px;
}

.right-container img {
  border-radius: 100%;
  width: 230px;
  margin: 20px;
}

.sub-container {
  display: flex;
  flex-direction: row;
}

.text-container {
  display: flex;
  flex-direction: column;
}
</style>
