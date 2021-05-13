<template>
  <div class="todo-list-footer">
    <!-- Buttons for Mark all (unmark all), Load default (undo), Save as default -->
    <button @click="$emit('toggleAll')">
      {{ isAllDone ? "Uncheck All" : "Check All" }}
    </button>
    <button @click="$emit('toggleSkipped')">
      {{ isSkipped ? "Don't Skip" : "Skip" }}
    </button>
    <button @click="$emit('loadDefault')">
      {{ loadDefaultText }}
    </button>
    <button @click="$emit('saveDefault')">
      {{ saveDefaultText }}
    </button>
  </div>
</template>

<script>
export default {
  name: "TodoListFooter",
  props: {
    isAllDone: Boolean,
    isSkipped: Boolean,
    undoLoadDefaultPending: Boolean,
    undoSaveDefaultPending: Boolean,
  },
  emits: ["toggleAll", "loadDefault", "saveDefault", "toggleSkipped"],
  data() {
    return {};
  },
  computed: {
    loadDefaultText() {
      if (!this.undoLoadDefaultPending) return "Load defaults";
      else return "Undo";
    },
    saveDefaultText() {
      if (!this.undoSaveDefaultPending) return "Save as default";
      else return "Undo";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
