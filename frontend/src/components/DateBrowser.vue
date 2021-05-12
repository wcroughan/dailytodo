<template>
  <div class="date-browser">
    <div><button @click="onLeftWeekClicked">leftaweek</button></div>
    <date-element
      v-for="week in currentlyDisplayedWeeks"
      :isDone="week.isDone"
      :displayText="week.displayText"
      :key="week.id"
      @click="weekClicked(week.id)"
    />
    <div><button @click="onRightWeekClicked">rightaweek</button></div>
    <date-element
      v-for="day in currentlyDisplayedDays"
      :isDone="day.isDone"
      :displayText="day.displayText"
      :key="day.id"
      @click="dayClicked(day.id)"
    />
  </div>
</template>

<script>
import DateElement from "./DateElement.vue";
import axios from "axios";
// const url = require("url");
import { backend_url } from "./dtConstants";
// const DTC = require("./dtConstants");

export default {
  components: { DateElement },
  name: "DateBrowser",
  emits: ["dayChosen"],
  data() {
    return {
      numDisplayedWeeks: 5,
      centerWeekDate: this.getCurrentMonday(),
      selectedWeekDate: this.getCurrentMonday(),
      weeks: {},
      outstandingWeeks: [],
      outstandingDays: [],
      days: {},
      daysOfWeek: {
        0: "Su",
        1: "Mo",
        2: "Tu",
        3: "We",
        4: "Th",
        5: "Fr",
        6: "Sa",
      },
    };
  },
  computed: {
    currentlyDisplayedWeeks() {
      const n = Math.floor(this.numDisplayedWeeks / 2);
      let ret = [];
      for (let i = -n; i <= n; i++) {
        ret.push(this.getWeekObject(this.weekOffset(this.centerWeekDate, i)));
      }
      if (this.outstandingWeeks.length > 0) this.requestOutstandingWeeks();
      return ret;
    },
    currentlyDisplayedDays() {
      let ret = [];
      for (let i = 0; i < 7; i++) {
        ret.push(this.getDayObject(this.dayOffset(this.selectedWeekDate, i)));
      }
      if (this.outstandingDays.length > 0) this.requestOutstandingDays();
      return ret;
    },
  },
  methods: {
    getMondayForDate(d) {
      const day = d.getDay();
      const diff = d.getDate() - day + (day == 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    },
    getCurrentMonday() {
      const d = new Date();
      return this.getMondayForDate(d);
    },
    dayIdString(dateobj) {
      return (
        dateobj.getFullYear() +
        ("0" + (dateobj.getMonth() + 1)).slice(-2) +
        ("0" + dateobj.getDate()).slice(-2)
      );
    },
    dateFromId(id) {
      let s1 = id;
      if (id.includes("_")) s1 = id.split("_")[1];
      const st =
        s1.substring(0, 4) +
        "-" +
        s1.substring(4, 6) +
        "-" +
        s1.substring(6, 8);
      return new Date(st);
    },
    weekIdFromDate(dateobj) {
      return "week_" + this.dayIdString(dateobj);
    },
    getWeekObject(dateobj) {
      const id = this.weekIdFromDate(dateobj);
      if (this.weeks[id] === undefined) {
        this.weeks[id] = this.createWeekObject(dateobj);
        // console.log("adding id to outstanding weeks: ", id);
        this.outstandingWeeks.push(id);
      } else {
        // console.log("Found lookup for week with id ", id);
      }
      return this.weeks[id];
    },
    requestOutstandingWeeks() {
      const reqParamObj = {
        type: "week",
        dates: this.outstandingWeeks,
      };
      const params = new URLSearchParams(reqParamObj);
      const backend_request = backend_url + `weeks_info?${params}`;
      //   console.log(backend_request);
      axios.get(backend_request).then((res) => {
        // console.log(res.data);
        this.weeks = {
          ...this.weeks,
          ...res.data,
        };
      });
      this.outstandingWeeks = [];
    },
    requestOutstandingDays() {
      const reqParamObj = {
        type: "day",
        dates: this.outstandingDays,
      };
      const params = new URLSearchParams(reqParamObj);
      const backend_request = backend_url + `days_info?${params}`;
      //   console.log(backend_request);
      axios.get(backend_request).then((res) => {
        // console.log(res.data);
        this.days = {
          ...this.days,
          ...res.data,
        };
      });
      this.outstandingDays = [];
    },
    weekOffset(dateobj, offset) {
      const ret = new Date(dateobj);
      ret.setDate(dateobj.getDate() + offset * 7);
      return ret;
    },
    weekDisplayTextFromDate(dateobj) {
      return dateobj.getMonth() + 1 + "/" + dateobj.getDate();
    },
    createWeekObject(dateobj) {
      return {
        id: this.weekIdFromDate(dateobj),
        displayText: this.weekDisplayTextFromDate(dateobj),
        isDone: false,
        isSkipped: false,
      };
    },
    onLeftWeekClicked() {
      this.centerWeekDate = this.weekOffset(
        this.centerWeekDate,
        -(this.numDisplayedWeeks - 1)
      );
    },
    onRightWeekClicked() {
      this.centerWeekDate = this.weekOffset(
        this.centerWeekDate,
        this.numDisplayedWeeks - 1
      );
    },
    dayIdFromDate(dateobj) {
      return "day_" + this.dayIdString(dateobj);
    },
    getDayObject(dateobj) {
      const id = this.dayIdFromDate(dateobj);
      if (this.days[id] === undefined) {
        this.days[id] = this.createDayObject(dateobj);
        // console.log("adding id to outstanding days: ", id);
        this.outstandingDays.push(id);
      } else {
        // console.log("Found lookup for day with id ", id);
      }
      return this.days[id];
    },
    dayOffset(dateobj, offset) {
      const ret = new Date(dateobj);
      ret.setDate(dateobj.getDate() + offset);
      return ret;
    },
    dayDisplayTextFromDate(dateobj) {
      return this.daysOfWeek[dateobj.getDay()] + " " + dateobj.getDate();
    },
    createDayObject(dateobj) {
      return {
        id: this.dayIdFromDate(dateobj),
        displayText: this.dayDisplayTextFromDate(dateobj),
        isDone: false,
        isSkipped: false,
      };
    },
    dayClicked(dayId) {
      this.$emit("dayChosen", dayId.split("_")[1]);
    },
    weekClicked(weekId) {
      //   Offsetting because timezone weirdness
      const dfi = this.dayOffset(this.dateFromId(weekId), 2);
      const mon = this.getMondayForDate(dfi);
      const ret = this.dayIdString(mon);
      this.selectedWeekDate = mon;
      this.$emit("dayChosen", ret);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.date-browser {
  display: grid;
  grid-template-columns: 15% 14% 14% 14% 14% 14% 15%;
  max-width: 1000px;
  margin: auto;
}
</style>
