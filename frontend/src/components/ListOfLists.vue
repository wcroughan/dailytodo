<template>
  <div class="list-of-lists">
    <todo-list v-for="(list, idx) in listIds" :listId="list" :key="idx" />
  </div>
</template>

<script>
import TodoList from "./TodoList.vue";
export default {
  name: "ListOfLists",
  props: {
    dateString: String,
  },
  data() {
    return {};
  },
  computed: {
    listIds() {
      let ret = [];
      ret[0] = "daily_" + this.dateString;
      const d = new Date(
        this.dateString.substring(0, 4) +
          "-" +
          this.dateString.substring(4, 6) +
          "-" +
          this.dateString.substring(6, 8)
      );
      const day = d.getDay();
      const diff = d.getDate() - day + 1;
      const mon = new Date(d.setDate(diff));
      console.log(day, diff, mon);
      const monstr =
        mon.getFullYear() +
        ("0" + (mon.getMonth() + 1)).slice(-2) +
        ("0" + mon.getDate()).slice(-2);
      ret[1] = "weekly_" + monstr;
      return ret;
    },
  },
  components: { TodoList },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
