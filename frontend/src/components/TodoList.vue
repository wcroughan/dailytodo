<template>
  <div class="todo-list">
    <todo-list-header
      :title="title"
      :numRemaining="numRemaining"
      :numItems="numItems"
    />
    <todo-list-body
      :listItems="listItems"
      @checkboxStatesChanged="checkboxStatesChanged"
    />
    <todo-list-footer
      :isAllDone="isAllDone"
      :undoLoadDefaultPending="undoLoadDefaultPending"
      :undoSaveDefaultPending="undoSaveDefaultPending"
      :isSkipped="isSkipped"
      @toggleAll="toggleAll"
      @toggleSkipped="toggleSkipped"
      @loadDefault="loadDefaultClicked(listId)"
      @saveDefault="saveDefaultClicked(listId)"
    />
  </div>
</template>

<script>
import TodoListBody from "./TodoListBody.vue";
import TodoListFooter from "./TodoListFooter.vue";
import TodoListHeader from "./TodoListHeader.vue";
import axios from "axios";
import { backend_url } from "./dtConstants";

export default {
  name: "TodoList",
  props: {
    listId: String,
  },
  emits: ["listInfoUpdate"],
  data() {
    return {
      title: "Loading...",
      listItems: [{ id: 0, isDone: false, title: "Loading..." }],
      listCache: {},
      canceledLoadDefault: false,
      undoLoadDefaultPending: false,
      undoSaveDefaultPending: false,
      isSkipped: false,
    };
  },
  components: { TodoListHeader, TodoListBody, TodoListFooter },
  methods: {
    sendListUpdateToServer(items, id, skipped) {
      this.listCache[id].listItems = items;
      this.listCache[id].isSkipped = skipped;
      const reqParamObj = {
        data: this.listCache[id],
      };
      const backend_request = backend_url + "list";
      axios.put(backend_request, reqParamObj);
      //   .then((res) => {
      // console.log(res.data);
      //   });
    },
    requestListFromServer(id) {
      const reqParamObj = {
        id: id,
      };
      const params = new URLSearchParams(reqParamObj);
      const backend_request = backend_url + `list?${params}`;
      //   console.log(backend_request);
      axios.get(backend_request).then((res) => {
        // console.log(res.data);
        this.listCache[id] = res.data;

        // console.log(this.listId, id);
        if (this.listId == id) {
          this.listItems = this.listCache[id].listItems;
          this.title = this.listCache[id].listTitle;
          this.isSkipped = this.listCache[id].isSkipped;
        }
      });
    },
    checkboxStatesChanged(state, id) {
      this.undoLoadDefaultPending = false;
      this.undoSaveDefaultPending = false;
      this.listItems[id].isDone = state;
      this.sendListUpdateToServer(this.listItems, this.listId, this.isSkipped);
    },
    toggleAll() {
      if (this.isAllDone) this.listItems.forEach((v) => (v.isDone = false));
      else this.listItems.forEach((v) => (v.isDone = true));
      this.sendListUpdateToServer(this.listItems, this.listId, this.isSkipped);
    },
    toggleSkipped() {
      this.isSkipped = !this.isSkipped;
      this.sendListUpdateToServer(this.listItems, this.listId, this.isSkipped);
      const emitBody = {
        listId: this.listId,
        isAllDone: this.isAllDone,
        isSkipped: this.isSkipped,
      };
      this.$emit("listInfoUpdate", emitBody);
    },
    loadDefaultClicked(id) {
      if (this.undoLoadDefaultPending) {
        this.undoLoadDefaultPending = false;
        this.undoLoadDefault(id);
      } else {
        this.undoSaveDefaultPending = false;
        this.undoLoadDefaultPending = true;
        this.loadDefault(id);
      }
    },
    loadDefault(id) {
      this.canceledLoadDefault = false;
      const reqParamObj = {
        id: this.listId,
        replaceWithDefault: true,
      };
      const params = new URLSearchParams(reqParamObj);
      const backend_request = backend_url + `list?${params}`;
      //   console.log(backend_request);
      axios.get(backend_request).then((res) => {
        // console.log(res.data);
        this.listCache[id] = res.data;
        if (!this.canceledLoadDefault && this.listId === id)
          this.listItems = res.data.listItems;
      });
    },
    undoLoadDefault(id) {
      this.canceledLoadDefault = true;
      const reqParamObj = {
        id: this.listId,
        restoreBackup: true,
      };
      const params = new URLSearchParams(reqParamObj);
      const backend_request = backend_url + `list?${params}`;
      //   console.log(backend_request);
      axios.get(backend_request).then((res) => {
        // console.log(res.data);
        this.listCache[id] = res.data;
        if (this.listId === id) this.listItems = res.data.listItems;
      });
    },
    saveDefaultClicked(id) {
      if (this.undoSaveDefaultPending) {
        this.undoSaveDefaultPending = false;
        this.undoSaveDefault(id);
      } else {
        this.undoLoadDefaultPending = false;
        this.undoSaveDefaultPending = true;
        this.saveDefault(id);
      }
    },
    saveDefault(id) {
      const reqParamObj = {
        id: id,
        items: this.listCache[id].listItems,
        newDefault: true,
      };
      const backend_request = backend_url + "list";
      //   console.log(backend_request, reqParamObj);
      axios.post(backend_request, reqParamObj);
    },
    undoSaveDefault(id) {
      const reqParamObj = {
        id: id,
        restoreDefaults: true,
      };
      const backend_request = backend_url + "list";
      //   console.log(backend_request, reqParamObj);
      axios.post(backend_request, reqParamObj);
    },
  },
  created() {
    this.requestListFromServer(this.listId);
  },
  watch: {
    listId(newval) {
      const cacheval = this.listCache[newval];
      if (cacheval === undefined) {
        this.requestListFromServer(this.listId);
      } else {
        this.listItems = cacheval.listItems;
        this.title = cacheval.listTitle;
        this.isSkipped = cacheval.isSkipped;
      }
    },
    isAllDone(newval, oldval) {
      console.log("Triggered all done watch: new: ", newval, " old: ", oldval);
      const emitBody = {
        listId: this.listId,
        isAllDone: newval,
        isSkipped: this.isSkipped,
      };
      this.$emit("listInfoUpdate", emitBody);
    },
  },
  computed: {
    numItems() {
      return this.listItems.length;
    },
    numRemaining() {
      return this.listItems.reduce((a, v) => (v.isDone ? a : a + 1), 0);
    },
    isAllDone() {
      return this.listItems.reduce((a, v) => (v.isDone ? a : false), true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.todo-list {
  margin: 30px 0px;
}
</style>
