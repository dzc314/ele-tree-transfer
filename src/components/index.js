import Vue from "vue";
import EleTreeTransfer from "./EleTreeTransfer.vue";

const Components = {
  EleTreeTransfer
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components;