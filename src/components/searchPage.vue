<template>
  <div class="vld-parent">
    <loading
      v-model:active="Loading"
      loader="dots"
      color="#ff5349"
      :is-full-page="true"
    />
  </div>
  <div>
    <div class="wrapper">
      <div class="container">
        <h1 class="title">
          <span class="titleAccent">C</span>ovid
          <span class="titleAccent">D</span>ata
          <span class="titleAccent">A</span>nalysis
        </h1>
        <div>
          <VueMultiselect
            v-model="SearchResult"
            :options="CountryCodes"
            label="Name"
            track-by="Name"
            placeholder="Pick A Country To Show Data"
            class="w-75 mx-auto"
            @close="getSelected()"
          >
            <template><img :src="bg.jpg" alt="No Man’s Sky"/></template>
          </VueMultiselect>
        </div>
        <div class="row w-75 mx-auto mt-3 icons">
          <div class="col-4 mx-auto mt-3 text-center">
            <infected-icon />
            <p class="m-0 p-0 counter" id="recCount">
              {{
                new Intl.NumberFormat().format(Counts.confirmed) != "NaN"
                  ? new Intl.NumberFormat().format(Counts.confirmed)
                  : "Loading..."
              }}
            </p>
            <p>Infected</p>
          </div>
          <div class="col-4 mx-auto mt-3 text-center">
            <hospitalized-icon />
            <p class="m-0 p-0 counter" id="hospCount">
              {{
                new Intl.NumberFormat().format(
                  parseInt(Counts.confirmed) - parseInt(Counts.deaths)
                ) != "NaN"
                  ? new Intl.NumberFormat().format(
                      parseInt(Counts.confirmed) - parseInt(Counts.deaths)
                    )
                  : "Loading..."
              }}
            </p>
            <p>Recovered</p>
          </div>
          <div class="col-4 mx-auto mt-3 text-center">
            <deaths-icon />
            <p class="m-0 p-0" id="deathsCount">
              {{
                new Intl.NumberFormat().format(Counts.deaths) != "NaN"
                  ? new Intl.NumberFormat().format(Counts.deaths)
                  : "Loading..."
              }}
            </p>
            <p>Deaths</p>
          </div>
        </div>
      </div>
      <footer
        class="mx-auto w-100"
        style="position: absolute; margin: auto; bottom: 30px"
      >
        <who-icon />
      </footer>
    </div>
  </div>
</template>

<script>
import {
  infectedIcon,
  hospitalizedIcon,
  deathsIcon,
  whoIcon,
} from "../assets/index";
import counterUp from "counterup2";
import getRequest from "../api/methods";
import { findFlagUrlByCountryName } from "country-flags-svg";
import VueMultiselect from "vue-multiselect";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  components: {
    infectedIcon,
    hospitalizedIcon,
    deathsIcon,
    whoIcon,
    VueMultiselect,
    Loading,
  },
  name: "searchPage",
  data() {
    return {
      SearchResult: "",
      Loading: true,
      Counts: [],
      Countries: [],
      CountryCodes: [
        {
          Name: "",
          CC: "",
        },
      ],
    };
  },
  methods: {
    getSelected() {
      console.log(this.SearchResult);
    },
  },
  async mounted() {
    const deaths = document.getElementById("deathsCount");
    const hospitalized = document.getElementById("hospCount");
    const recovered = document.getElementById("recCount");
    await getRequest("https://covid2019-api.herokuapp.com/total").then(
      (response) => (this.Counts = response)
    );
    this.Loading = false;
    counterUp(deaths, {
      duration: 800,
      delay: 5,
    });
    counterUp(hospitalized, {
      duration: 800,
      delay: 5,
    });
    counterUp(recovered, {
      duration: 800,
      delay: 5,
    });
  },
  async created() {
    await getRequest("https://covid2019-api.herokuapp.com/countries")
      .then((response) => (this.Countries = response.countries))
      .then((response) =>
        response.forEach((x) =>
          this.CountryCodes.push({
            Name: x.replaceAll("_", " "),
            CC: findFlagUrlByCountryName(x.replaceAll("_ ", " ")),
          })
        )
      );
    this.CountryCodes.shift();
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
