<template>
  <el-row class="transfer">
    <el-col :span="10" class="transfer-view">
      <div class="title">
        <h3>{{ title[0] }}</h3>
        <el-input
          v-if="filter"
          placeholder="输入关键字进行过滤"
          v-model="sourceFilterText"
        >
        </el-input>
      </div>
      <el-tree
        class="tree-view"
        ref="sourceTree"
        :data="leftData"
        :props="props"
        :node-key="nodeKey"
        :filter-node-method="filterNode"
        show-checkbox
        default-expand-all
      >
      </el-tree>
    </el-col>
    <el-col :span="4" class="transfer-handle">
      <el-button icon="el-icon-d-arrow-right" @click="transRight" circle></el-button>
      <el-button icon="el-icon-d-arrow-left" @click="transLeft" circle></el-button>
    </el-col>
    <el-col :span="10" class="transfer-view">
      <div class="title">
        <h3>{{ title[1] }}</h3>
        <el-input
          v-if="filter"
          placeholder="输入关键字进行过滤"
          v-model="targetFilterText"
        >
        </el-input>
      </div>
      <el-tree
        class="tree-view"
        ref="targetTree"
        :data="rightData"
        :props="props"
        :node-key="nodeKey"
        :filter-node-method="filterNode"
        show-checkbox
        default-expand-all
      >
      </el-tree>
    </el-col>
  </el-row>
</template>

<script>
// import { cloneDeep } from 'lodash'
export default {
  name: 'EleTreeTransfer',
  props: {
    source: {
      type: Array,
      default: () => [],
    },
    target: {
      type: Array,
      default: () => [],
    },
    sourceIsArray: {
      type: Boolean,
      default: false,
    },
    targetIsArray: {
      type: Boolean,
      default: false,
    },
    nodeKey: {
      type: String,
      default: 'id',
    },
    parentKey: {
      type: String,
      default: 'parentId',
    },
    title: {
      type: Array,
      default: () => ['源数据', '目标数据'],
    },
    filter: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: 'name', //指定节点标签为节点对象的某个属性值
          // children: 'children', //指定子树为节点对象的某个属性值
        }
      },
    },
  },
  data() {
    return {
      leftData: [],
      rightData: [],
      sourceFilterText: '',
      targetFilterText: '',
    }
  },
  model: {
    prop: 'target',
    event: 'change',
  },
  watch: {
    source: {
      handler: function (newVal) {
        if (newVal && newVal.length) {
          this.leftInit()
        }
      },
    },
    target: {
      handler: function (newVal) {
        if (newVal && newVal.length) {
          // console.log(newVal);
          this.rightInit()
        }
      },
    },
    sourceFilterText(val) {
      this.$refs.sourceTree.filter(val)
    },
    targetFilterText(val) {
      this.$refs.targetTree.filter(val)
    },
  },
  mounted() {},
  methods: {
    leftInit() {
      let initData = []
      if (this.sourceIsArray) {
        initData = this.cloneDeep(this.source)
      } else {
        initData = this.treeToArray(this.source)
      }
      // console.log(initData);
      this.treeMergeItems(this.leftData, initData, null)
      this.buildSourceTree()
    },
    rightInit() {
      let initData = []
      if (this.targetIsArray) {
        initData = this.cloneDeep(this.target)
      } else {
        initData = this.treeToArray(this.target)
      }
      this.treeMergeItems(this.rightData, initData, null)
      this.buildSourceTree()
    },
    buildSourceTree() {
      let transData = []
      if (this.targetIsArray) {
        transData = this.cloneDeep(this.target)
      } else {
        transData = this.treeToArray(this.target)
      }

      this.leftData = this.treeRemoveItems(
        this.leftData,
        transData,
        this.nodeKey
      )
    },
    cloneDeep(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    arrayToTree(arr, nodeKey, parentKey) {
      if (!Array.isArray(arr) || !arr.length) {
        return []
      }
      let map = {}
      arr.forEach((item) => {
        const key = item[nodeKey]
        map[key] = item
      })
      let tree = []
      arr.forEach((item) => {
        const parentId = item[parentKey]
        const parent = map[parentId]
        if (parent) {
          if (!parent.children) {
            // this.$set(parent, 'children', [])
            parent.children = []
          }
          parent.children.push(item)
        } else {
          tree.push(item)
        }
      })
      return tree
    },
    treeToArray(tree) {
      const result = []
      function getNodes(arr) {
        arr.forEach((item) => {
          const { children, ...node } = item
          result.push(node)
          if (children && children.length) {
            getNodes(children)
          }
        })
      }
      getNodes(tree)
      return result
    },
    treeRemoveItems(tree, items, nodeKey) {
      function filterChildren(tree) {
        tree.forEach((node) => {
          const inArr = items.some((item) => item[nodeKey] === node[nodeKey])
          if (!inArr) {
            return
          }
          if (node.children && node.children.length) {
            node.children = filterChildren(node.children)
          }
        })
        const result = tree.filter((node) => {
          const inArr = items.some((item) => item[nodeKey] === node[nodeKey])
          return !inArr || (inArr && node.children && node.children.length)
        })
        return result
      }
      return filterChildren(tree)
    },
    treeMergeItems(tree, items, parentId) {
      if (!items.length) {
        return
      }
      items.forEach((item) => {
        if (item[this.parentKey] === parentId) {
          const itemInTree = tree.some(
            (node) => node[this.nodeKey] === item[this.nodeKey]
          )
          if (!itemInTree) {
            item.children = []
            tree.push(item)
          }
        }
      })
      tree.forEach((child) => {
        if (child.children) {
          this.treeMergeItems(child.children, items, child[this.nodeKey])
        }
      })
    },
    transRight() {
      const data = this.$refs.sourceTree.getCheckedNodes(false, true)
      const transData = this.cloneDeep(data)
      this.treeMergeItems(this.rightData, transData, null)
      this.leftData = this.treeRemoveItems(
        this.leftData,
        transData,
        this.nodeKey
      )
      this.setModelValue()
      // this.$emit('change', 'this.treeToArray(this.rightData)')
    },
    transLeft() {
      const data = this.$refs.targetTree.getCheckedNodes(false, true)
      // console.log(data)
      const transData = this.cloneDeep(data)
      this.treeMergeItems(this.leftData, transData, null)
      this.rightData = this.treeRemoveItems(
        this.rightData,
        transData,
        this.nodeKey
      )
      this.setModelValue()
      // this.$emit('change', this.rightData)
    },
    setModelValue() {
      let data = []
      if (this.targetIsArray) {
        data = this.treeToArray(this.rightData)
      } else {
        data = this.cloneDeep(this.rightData)
      }
      // this.$emit('change', data)
      const length = this.target.length
      Array.prototype.splice.apply(this.target, [0, length, ...data])
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.props.label].includes(value)
    },
  },
}
</script>

<style lang="scss" scoped>
.transfer {
  height: 100%;
  min-height: 200px;
  > div {
    height: 100%;
  }
  .transfer-view {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    > .title {
      border-bottom: 1px solid #ddd;
      h3 {
        margin: 5px 0;
        text-align: center;
      }
      > .el-input {
        margin-bottom: 10px;
        width: 80%;
      }
    }
    > .tree-view {
      flex: 1;
      overflow: auto;
    }
  }
  .transfer-handle {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>