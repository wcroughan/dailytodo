<template>
  <div class="list-of-lists">
    <todo-list
      v-for="(list, idx) in listIds"
      :listId="listIdPfxs[idx]"
      :key="idx"
    />
  </div>
</template>

<script>
import TodoList from "./TodoList.vue";
export default {
  name: "ListOfLists",
  props: {
    listIdPrefix: String,
  },
  data() {
    return {
      listIds: ["daily", "weekly"],
    };
  },
  computed: {
    listIdPfxs() {
      return this.listIds.map((v) => v + "_" + this.listIdPrefix);
    },
  },
  components: { TodoList },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
