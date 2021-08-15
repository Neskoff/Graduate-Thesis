<template>
  <div>
    <div class="wrapper">
      <div class="container">
        <h1 class="title">
          <span class="titleAccent">C</span>ovid
          <span class="titleAccent">D</span>ata
          <span class="titleAccent">A</span>nalysis
        </h1>
        <input
          id="searchBox"
          class="form-control mx-auto w-75"
          type="text"
          placeholder="Type Here To Search"
          aria-label="Search Box"
          v-model="SearchResult"
        />
        <div id="searchResults">
          <ul class="countryList">
            <li
              v-for="Country in CountryCodes"
              :key="Country"
              v-bind="{ id: Country.Name }"
              @click="onListClick"
            >
              <img
                v-bind="{ src: Country.CC }"
                style="width:50px;height:25px;position:absolute;left:10px;background: aqua"
                alt="?"
              />{{ Country.Name }}
            </li>
          </ul>
        </div>
        <div class="row w-75 mx-auto mt-3 icons">
          <div class="col-4 mx-auto mt-3 text-center">
            <infected-icon />
            <p class="m-0 p-0 counter" id="recCount">
              {{ new Intl.NumberFormat().format(parseInt(Counts.confirmed)) }}
            </p>
            <p>Infected</p>
          </div>
          <div class="col-4 mx-auto mt-3 text-center">
            <hospitalized-icon />
            <p class="m-0 p-0 counter" id="hospCount">
              {{
                new Intl.NumberFormat().format(
                  parseInt(Counts.confirmed) - parseInt(Counts.deaths)
                )
              }}
            </p>
            <p>Recovered</p>
          </div>
          <div class="col-4 mx-auto mt-3 text-center">
            <deaths-icon />
            <p class="m-0 p-0" id="deathsCount">
              {{ new Intl.NumberFormat().format(parseInt(Counts.deaths)) }}
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
export default {
  components: { infectedIcon, hospitalizedIcon, deathsIcon, whoIcon },
  name: "searchPage",
  data() {
    return {
      SearchResult: "",
      Counts: [],
      Countries: [],
      FilteredCountries: [],
      CountryCodes: [
        {
          Name: "",
          CC: "",
        },
      ],
    };
  },
  watch: {
    async SearchResult() {
      var searchQuery = document.getElementById("searchBox").value;
      var results = document.getElementById("searchResults");
      if (this.Countries != null) {
        this.FilteredCountries = this.Countries.filter((x) =>
          x.toLowerCase().includes(searchQuery.toLowerCase())
        );
        this.CountryCodes = [];
        this.FilteredCountries.forEach((x) =>
          this.CountryCodes.push({
            Name: x.replace("_", " ").replaceAll("_", " "),
            CC:
              findFlagUrlByCountryName(x.replaceAll("_", " ")) == ""
                ? "data:image/png;base64,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"
                : findFlagUrlByCountryName(x.replaceAll("_", " ")),
          })
        );
      }
      searchQuery.length != 0
        ? (results.style.display = "block")
        : (results.style.display = "none");
    },
  },
  methods: {
    onListClick() {
      document.getElementById("searchBox").value = event.target.id;
    },
  },
  async mounted() {
    const deaths = document.getElementById("deathsCount");
    const hospitalized = document.getElementById("hospCount");
    const recovered = document.getElementById("recCount");
    await getRequest("https://covid2019-api.herokuapp.com/total").then(
      (response) => (this.Counts = response)
    );
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
    await getRequest("https://covid2019-api.herokuapp.com/countries").then(
      (response) => (this.Countries = response.countries)
    );
  },
};
</script>
