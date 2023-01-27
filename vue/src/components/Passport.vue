<template>
  <div class="entirePassport">
    <div class="placeholder">
      <user-profile v-if="!isLoading" :passport="fullObject" />
    </div>

    <div class="buttons" v-if="this.beerCrawlBreweries.length > 0">
      <div id="print-button" v-on:click="printItinerary">
        <p>Print Crawl</p>
      </div>
      <div id="view-map" v-on:click="toggleMap" v-if="!showMap">
        <p>View Map</p>
      </div>
      <div id="view-list" v-on:click="toggleMap" v-if="showMap">
        <p>View List</p>
      </div>
    </div>
    <div class="main">
      <div class="leftPanel">
        <div
          class="passport"
          v-for="brewery in fullObject"
          :key="brewery.id"
          :isRendered="checkBrewery(brewery)"
        >
          <div
            id="breweryCard"
            draggable
            @dragstart="onDrag($event, brewery)"
            v-on:click="cardOpen(brewery)"
          >
            <div id="breweryName">{{ brewery.breweryName }}</div>
            <div class="open">
              <img
                v-show="brewery.cardOpen"
                src="https://i.imgur.com/3OjzTy2.png"
              />
              <img
                v-show="!brewery.cardOpen"
                src="https://i.imgur.com/YjdeFuu.png"
              />
            </div>
          </div>
          <div class="legend" v-show="brewery.cardOpen">
            <p class="legend-name">NAME</p>
            <p class="legend-style">STYLE</p>
            <p class="legend-abv">ABV</p>
            <p class="legend-review">RATING</p>
            <p class="legend-drank">DRANK</p>
            <p class="legend-remove">DELETE</p>
          </div>
          <div
            v-show="brewery.cardOpen"
            v-for="beer in brewery.passportBeers"
            :key="beer.id"
            id="beerCard"
          >
            <div class="beer-name">
              {{ beer.beerName }}
            </div>
            <div class="beer-style">
              {{ beer.styleName }}
            </div>
            <div class="beer-abv">{{ beer.abv }}%</div>
            <div class="review">
              <review :beer="beer" />
            </div>
            <div class="drank" v-on:click="toggleDrank(beer)">
              <img v-show="beer.drank" src="https://i.imgur.com/6XCzZEQ.png" />
              <img v-show="!beer.drank" src="https://i.imgur.com/YnuPcOd.png" />
            </div>
            <div
              id="remove"
              class="remove"
              v-on:click="removeFromPassport(beer.beerId, brewery)"
            >
              <img src="https://i.imgur.com/vdqV5fW.png" />
            </div>
          </div>
        </div>
      </div>
      <!-- BAR CRAWL LIST STARTS HERE  -->

      <div
        class="rightPanel"
        @drop="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="barCrawlList" v-if="!showMap">
          <h1>Beer Crawl Itinerary</h1>

          <div v-for="brewery in beerCrawlBreweries" :key="brewery.id">
            <div class="brewery-info">
              <div class="reorder">
                <img
                  id="reorderUp"
                  src="https://i.imgur.com/YjdeFuu.png"
                  @click="reorderUp(brewery)"
                />
                <img
                  id="reorderDown"
                  src="https://i.imgur.com/3OjzTy2.png"
                  @click="reorderDown(brewery)"
                />
              </div>
              <div class="details">
                <div class="brewery-name">
                  {{ beerCrawlBreweries.indexOf(brewery) + 1 }})
                  {{ brewery.breweryName }}
                </div>
                <div
                  :rendered="getBreweryAddress(brewery)"
                  class="brewery-address"
                >
                  {{ brewery.address }}
                </div>
              </div>
              <div class="remove-crawl" @click="removeFromCrawl(brewery)">
                <img src="https://i.imgur.com/vdqV5fW.png" />
              </div>
            </div>
          </div>
        </div>
        <div id="directions" v-if="showMap">
          <directions :barCrawl="beerCrawlBreweries" />
        </div>
      </div>
    </div>
  </div>
</template>

// SCRIPT STARTS HERE

<script>
import PassportService from "../services/PassportService";
import BreweryService from "../services/BreweryService.js";
import AuthService from "../services/AuthService.js";
import Directions from "../components/Directions.vue";

import Review from "./Review.vue";
import UserProfile from "./UserProfile.vue";
export default {
  components: { Review, UserProfile, Directions },
  name: "my-passport",
  data() {
    return {
      allBreweries: [],
      passport: {
        brewery: {},
      },
      beerCrawlBreweries: [],
      address: "",
      breweryToOpen: "",
      showMap: false,
      isLoading: true,
    };
  },

  computed: {
    fullObject() {
      let PassportObject = this.passport;
      return PassportObject;
    },
  },

  methods: {
    toggleMap() {
      console.log("toggle Damnit!!");
      this.showMap = !this.showMap;
    },

    reorderUp(brewery) {
      let index = this.beerCrawlBreweries.indexOf(brewery);
      if (index == 0) {
        let temp = this.beerCrawlBreweries[index];
        this.beerCrawlBreweries[0] =
          this.beerCrawlBreweries[this.beerCrawlBreweries.length - 1];
        this.beerCrawlBreweries[this.beerCrawlBreweries.length - 1] = temp;
        this.$forceUpdate();
      } else {
        if (index != 0) {
          let temp = this.beerCrawlBreweries[index];
          this.beerCrawlBreweries[index] = this.beerCrawlBreweries[index - 1];
          this.beerCrawlBreweries[index - 1] = temp;
          this.$forceUpdate();
        }
      }
    },
    reorderDown(brewery) {
      let index = this.beerCrawlBreweries.indexOf(brewery);
      console.log(index);
      if (index == this.beerCrawlBreweries.length - 1) {
        let temp = this.beerCrawlBreweries[index];
        this.beerCrawlBreweries[this.beerCrawlBreweries.length - 1] =
          this.beerCrawlBreweries[0];
        this.beerCrawlBreweries[0] = temp;
        this.$forceUpdate();
      } else {
        if (index != this.beerCrawlBreweries.length) {
          let temp = this.beerCrawlBreweries[index];
          this.beerCrawlBreweries[index] = this.beerCrawlBreweries[index + 1];
          this.beerCrawlBreweries[index + 1] = temp;
          this.$forceUpdate();
        }
      }
    },
    removeFromCrawl(brewery) {
      let index = this.beerCrawlBreweries.indexOf(brewery);
      this.beerCrawlBreweries.splice(index, 1);
    },
    onDrag(evt, brewery) {
      console.log(
        "inside start drag " + brewery.breweryId + " " + brewery.breweryName
      );
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("draggedBreweryId", brewery.breweryId);
      evt.dataTransfer.setData("draggedBreweryName", brewery.breweryName);
    },
    onDrop(evt) {
      console.log("on drop started");
      const draggedBreweryId = evt.dataTransfer.getData("draggedBreweryId");
      const draggedBreweryName = evt.dataTransfer.getData("draggedBreweryName");
      console.log(draggedBreweryId + " " + draggedBreweryName);
      const breweryToAdd = {
        breweryId: draggedBreweryId,
        breweryName: draggedBreweryName,
      };
      this.beerCrawlBreweries.push(breweryToAdd);
    },

    printItinerary() {
      let contents = this.beerCrawlBreweries;
      let dialog = window.open("", "", "height=500, width=500");
      dialog.document.write("<html>");
      dialog.document.write("<body > <h1>Bar Crawl Itinerary</h1>");

      contents.forEach((pub) => {
        this.getBreweryAddress(pub);
        dialog.document.write(
          `<p><strong>${contents.indexOf(pub) + 1}) ${
            pub.breweryName
          }</strong> <br> ${pub.address}</p>`
        );
      });

      dialog.document.write("</body></html>");
      dialog.document.close();
      dialog.print();
    },

    addToBeerCrawl(brewery) {
      let pub = this.beerCrawlBreweries;
      if (!this.beerCrawlBreweries.includes(brewery)) {
        pub.push(brewery);
      } else {
        let index = pub.indexOf(brewery);
        pub.splice(index, 1);
      }
    },
    getBreweryAddress(brewery) {
      this.allBreweries.forEach((b) => {
        if (brewery.breweryId == b.breweryId) {
          brewery.address =
            b.streetAddress + " " + b.city + ", " + b.state + " " + b.zip;
        }
      });
    },

    toggleCheckBox(brewery) {
      if (this.beerCrawlBreweries.includes(brewery)) {
        return true;
      } else {
        return false;
      }
    },

    getBreweries() {
      PassportService.breweryPassport(this.$store.state.user.id).then(
        (response) => {
          this.passport = response.data;
          this.isLoading = false;
        }
      );
      BreweryService.listBreweries().then((response) => {
        this.allBreweries = response.data;
      });
    },

    toggleDrank(beer) {
      beer.drank = !beer.drank;
      PassportService.updateDrank(this.$store.state.user.id, beer.beerId);
    },
    cardOpen(brewery) {
      brewery.cardOpen = !brewery.cardOpen;
    },
    checkBrewery(brewery) {
      if (brewery.breweryId == this.breweryToOpen) {
        brewery.cardOpen = true;
      }
    },

    removeFromPassport(beerId, brewery) {
      PassportService.deleteFromPassport(this.$store.state.user.id, beerId)
        .then((response) => {
          if (response.status === 200) {
            this.breweryToOpen = brewery.breweryId;
            this.getBreweries();
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.beerCrawlBreweries.forEach((brewery) => {
        if (brewery.breweryId == brewery.breweryId) {
          let index = this.beerCrawlBreweries.indexOf(brewery);
          this.beerCrawlBreweries.splice(index, 1);
        }
      });
    },
    getUserInfo() {
      AuthService.get(this.$store.state.user.id).then((response) => {
        this.$store.commit("SET_USER_INFO", response.data);
      });
    },
  },
  created() {
    this.getBreweries();
    this.getUserInfo();
  },
};
</script>
<style scoped>
.entirePassport {
  background: url("../resources/background-image.jpg") no-repeat center center
    fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  /* height: 100%; */
  /* background-color: black; */
}

#welcome {
  margin: 20px 0px;
  color: white;
  padding: 15px 0px;
  text-align: center;
  font-size: 3em;
  background-color: rgba(99, 98, 98, 0.718);
  text-shadow: 6px 6px 6px #272727;
}
/* Sets size of the passport */
/* .main-passport {
  margin: 0 auto;
  width: 60vw;
} */
/* .passport {
  margin: 0 auto;
  width: 100vw;
}
 */
/* STYLING FOR THE LEGEND */
.legend {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-radius: 5px;
  margin: 0px 20px 0px 20px;
  height: 25px;
  background-color: rgba(15, 15, 15, 0.801);
  color: white;
  font-size: 0.65em;
  -webkit-box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
}

/** */
.legend-name {
  margin-left: 30px;
  width: 22%;
  font-size: 1em;
}
.legend-style {
  width: 15%;
  font-size: 1em;
}
.legend-abv {
  width: 9%;
  font-size: 1em;
}
.legend-review {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
}
.legend-drank {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 10%;
}
.legend-remove {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 10%;
}
/* Styles individual brewery tiles */
#breweryCard {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-radius: 5px;
  margin: 10px;
  background-color: white;
  -webkit-box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
}
#breweryName {
  margin-left: 50px;
  font-weight: bold;
}
.open {
  margin-right: 50px;
}
.open img {
  /* display: inline-block; */
  width: 25px;
  height: auto;
}
#beerCard {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
  margin: 0px 20px 10px 20px;
  height: 50px;
  background-color: rgba(56, 56, 56, 0.801);
  color: white;
  -webkit-box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
}
/*  Beer tile styling and positioning */
.beer-name {
  width: 22%;
  margin-left: 30px;
  font-size: 1em;
  font-weight: bold;
}
.beer-style {
  width: 15%;
  font-size: 0.75em;
  font-style: italic;
}
.beer-abv {
  font-size: 0.75em;
  width: 9%;
  font-style: italic;
}

.review {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
}

.drank {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 10%;
}

.drank img {
  margin: 0 auto;
  width: 35px;
  height: auto;
}
.remove {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 10%;
  /* margin-right: 20px; */
}
.remove img {
  float: right;
  width: 40px;
  margin: 0 auto;
  height: auto;
}
#button {
  width: 25px;
  height: 25px;
  background-color: red;
}
.main {
  width: 80vw;
  background-color: rgba(228, 228, 228, 0.164);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-areas: "left-panel right-panel";
}
.leftPanel {
  width: 100%;
  grid-area: left-panel;
}
.rightPanel {
  margin-right: 15px;
  grid-area: right-panel;
}

/* STYLING FOR THE BAR CRAWL LIST */
.barCrawlList {
  margin: 36px 10px 10px 20px;
  height: auto;
  margin: 0 auto;
  -webkit-box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 12px 0px 24px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 12px 0px 24px 0px rgba(0, 0, 0main, 0.75);
}
.barCrawlList h1 {
  font-size: 2em;
  background-color: rgba(99, 98, 98, 0.718);
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
  padding: 10px 0px;
}

.brewery-info {
  display: grid;
  grid-template-columns: 0.5fr 3fr 0.5fr;
  grid-template-areas: "reorder details remove-item";

  background-color: white;
  margin: 0px 8px 10px;
  border-radius: 5px;
  -webkit-box-shadow: 0 8px 6px -6px black;
  -moz-box-shadow: 0 8px 6px -6px black;
  box-shadow: 0 8px 6px -6px black;
}
.details {
  grid-area: details;
  display: flex;
  height: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.brewery-name {
  font-weight: bold;
  font-size: 1.15em;
}

.brewery-address {
  margin-left: 25px;
  font-style: italic;
  font-size: 1em;
}

.buttons {
  margin-top: 25px;
  margin-bottom: -15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#print-button,
#view-map,
#view-list {
  background-color: rgb(44, 72, 235);
  border-radius: 5px;
  width: 150px;
  height: 45px;
  margin: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  -webkit-box-shadow: 3px 0px 6px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 0px 6px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 0px 6px 0px rgba(0, 0, 0, 0.75);
}
#print-button:hover,
#view-map:hover,
#view-list:hover {
  background-color: #1d309e;
  cursor: pointer;
}

#print-button p,
#view-map p,
#view-list p {
  color: white;
  font-size: 1.25em;
}
.remove-crawl {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.remove-crawl img {
  grid-area: remove-item;

  width: 30px;
}
.reorder {
  grid-area: reorder;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#reorderUp,
#reorderDown {
  width: 20px;
}

/* STYLING FOR THE MAP */
#directions {
  width: 125%;
  height: 125%;

  /* margin: 0px auto; */
}
</style>
