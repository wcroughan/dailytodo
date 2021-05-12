<template>
  <div class="todo-list-footer">
    <!-- Buttons for Mark all (unmark all), Load default (undo), Save as default -->
    <button @click="$emit('toggleAll')">
      {{ isAllDone ? "Uncheck All" : "Check All" }}
    </button>
    <button @click="onLoadDefaultClicked">
      {{ loadDefaultText }}
    </button>
    <button @click="onSaveDefaultClicked">
      {{ saveDefaultText }}
    </button>
  </div>
</template>

<script>
export default {
  name: "TodoListFooter",
  props: {
    isAllDone: Boolean,
  },
  emits: [
    "toggleAll",
    "loadDefault",
    "undoLoadDefault",
    "saveDefault",
    "undoSaveDefault",
  ],
  data() {
    return {
      undoLoadDefaultPending: false,
      undoLoadTimer: null,
      undoLoadCounter: null,
      undoTimeout: 10,
      undoSaveDefaultPending: false,
      undoSaveTimer: null,
      undoSaveCounter: null,
    };
  },
  methods: {
    onLoadDefaultClicked() {
      if (this.undoSaveDefaultPending) {
        clearInterval(this.undoSaveTimer);
        this.undoSaveDefaultPending = false;
      }

      if (this.undoLoadDefaultPending) {
        this.undoLoadDefaultPending = false;
        clearInterval(this.undoLoadTimer);
        this.$emit("undoLoadDefault");
      } else {
        this.undoLoadDefaultPending = true;
        this.undoLoadCounter = this.undoTimeout;
        this.undoLoadTimer = setInterval(() => {
          this.undoLoadCounter--;
          if (this.undoLoadCounter === 0) {
            clearInterval(this.undoLoadTimer);
            this.undoLoadDefaultPending = false;
          }
        }, 1000);
        this.$emit("loadDefault");
      }
    },
    onSaveDefaultClicked() {
      if (this.undoLoadDefaultPending) {
        clearInterval(this.undoLoadTimer);
        this.undoLoadDefaultPending = false;
      }

      if (this.undoSaveDefaultPending) {
        this.undoSaveDefaultPending = false;
        clearInterval(this.undoSaveTimer);
        this.$emit("undoSaveDefault");
      } else {
        this.undoSaveDefaultPending = true;
        this.undoSaveCounter = this.undoTimeout;
        this.undoSaveTimer = setInterval(() => {
          this.undoSaveCounter--;
          if (this.undoSaveCounter === 0) {
            clearInterval(this.undoSaveTimer);
            this.undoSaveDefaultPending = false;
          }
        }, 1000);
        this.$emit("SaveDefault");
      }
    },
  },
  computed: {
    loadDefaultText() {
      if (!this.undoLoadDefaultPending) return "Load Defaults";
      else return "Undo (" + this.undoLoadCounter + ")";
    },
    saveDefaultText() {
      if (!this.undoSaveDefaultPending) return "Save Defaults";
      else return "Undo (" + this.undoSaveCounter + ")";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
