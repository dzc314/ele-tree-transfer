<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" @click="showData" />
    <!-- <TreeNodeTransfer :source="source" :target="target" /> -->
    <EleTreeTransfer
      :source="source"
      :target="target"
      source-is-array
      target-is-array
      class="transfer"
    />
  </div>
</template>

<script>
// import EleTreeTransfer from './components/EleTreeTransfer.vue'

export default {
  name: 'App',
  components: {
    // EleTreeTransfer,
  },
  data() {
    return {
      source: [],
      target: [],
    }
  },
  mounted() {
    setTimeout(() => {
      this.source = [
        { id: 1, parentId: null, name: '一级' },
        { id: 2, parentId: 1, name: '二级1' },
        { id: 3, parentId: 2, name: '三级1.1' },
        { id: 4, parentId: 2, name: '三级1.2' },
        { id: 5, parentId: 1, name: '二级2' },
        { id: 6, parentId: 5, name: '三级2.1' },
        { id: 7, parentId: 5, name: '三级2.2' },
        { id: 8, parentId: 1, name: '二级3' },
      ]
    }, 1000)
    setTimeout(() => {
      this.target = [
        { id: 1, parentId: null, name: '一级' },
        { id: 2, parentId: 1, name: '二级1' },
        { id: 4, parentId: 2, name: '三级1.2' },
      ]
    }, 500)
  },
  methods: {
    showData() {
      console.log(this.target)
    },
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  .transfer {
    height: 100px;
  }
}
</style>
