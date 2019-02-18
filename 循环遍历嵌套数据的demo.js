import { Tree } from 'antd';
const { TreeNode, DirectoryTree } = Tree;

// mockdata
const treeData = [
  {
    title: '根目录',
    key: '0-0',
    type: 'folder',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        type: 'folder',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0', type: 'word' },
          { title: '0-0-0-1', key: '0-0-0-1', type: 'word' },
          {
            title: '0-0-0-2',
            key: '0-0-0-2',
            type: 'folder',
            children: [
              {
                title: '框架框架框架框架框架',
                key: '0-0-0-0-1',
                type: 'folder',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    type: 'folder',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0', type: 'word' },
      { title: '0-1-0-1', key: '0-1-0-1', type: 'word' },
      { title: '0-1-0-2', key: '0-1-0-2', type: 'word' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
    type: 'folder',
  },
];


  
  // 循环遍历数据
  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} dataRef={item} isLeaf={Boolean(item.type !== 'folder')} />;
  });
