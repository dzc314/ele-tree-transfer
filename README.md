# ele-tree-transfer
## 说明
ele-tree-transfer是一个树形穿梭框，依赖于element-ui的树形组件、按钮、输入框等组件，本组件最大亮点是对目标数据的双向数据绑定。

## 通过NPM安装
```
npm i @dzc314/ele-tree-transfer -S
```

### 引入组件
```
import '@dzc314/ele-tree-transfer'
import '@dzc314/ele-tree-transfer/dist/ele-tree-transfer.css'
```

### 使用
```
<ele-tree-transfer
  :source="fromData" //源数据
  :target="toData"   //目标数据
  node-key="id"
  parent-key="parentId"
  source-is-array //来源数据是否是平行结构数组
  target-is-array //目标数据是否是平行结构数组
  :title="title"  // ['源数据', '目标数据']
  :props="defaultProps" // {label: 'name'}
  filter  //开启搜索
></ele-tree-transfer>
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
