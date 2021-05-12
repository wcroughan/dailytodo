<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <date-browser @dayChosen="dayChosen($event)" />
    <list-of-lists :dateString="dateString" />
  </div>
</template>

<script>
import DateBrowser from "./components/DateBrowser.vue";
import ListOfLists from "./components/ListOfLists.vue";
// import HelloWorld from "./components/HelloWorld.vue";
// import TodoItem from "./components/TodoItem.vue";

export default {
  name: "App",
  components: {
    // HelloWorld,
    ListOfLists,
    DateBrowser,
  },
  data() {
    return {
      dateString: this.currentDayID(),
    };
  },
  methods: {
    currentDayID() {
      const dateobj = new Date();
      return (
        dateobj.getFullYear() +
        ("0" + (dateobj.getMonth() + 1)).slice(-2) +
        ("0" + dateobj.getDate()).slice(-2)
      );
    },
    dayChosen(day) {
      this.dateString = day;
      console.log("received dayChosen: ", day, this.dateString);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
