// 数组转树 1.map记录所有的节点 2.遍历数组。 parentId为0的为根节点，否则塞到对应的父节点下 3.时间复杂度O(n)
function listToTree(list) { 
    if(!Array.isArray(list)) throw new TypeError('arguments must be an array')
    const map = new Map()
    for(const item of list){
        // 先准备好子节点的属性
        map.set(item.id,{...item,children:[]})
    }
    // 第二遍遍历,如果找不到他的父节点，转树后就丢弃
    const tree = []
    for(const item of list){
        const node = map.get(item.id)
        if(item.parentId === 0) {
            tree.push(node)
        } else {
            const parent = map.get(item.parentId)
            if(parent) parent.children.push(node)
        }
    }

    return tree
}

// 树转数组 1.要求用深度遍历dfs
function treeToList(tree){
    if(!Array.isArray(tree)) throw new TypeError('arguments must be an array')
    const list = []
    function dfs(children){
        for(const item of children){
            // 考虑到没设置children的情况，这样设置兜底值稳妥
            const { children = [], ...rest } = item;
            // 不建议  delete item.children，会修改原树
            list.push(rest)
            if (children.length > 0) dfs(item.children);
        }
    }
    dfs(tree)
    return list
}
