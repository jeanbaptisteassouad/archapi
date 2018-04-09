



const graftBranch2Tree = (branch,tree) => {
  tree.size += branch.size
  const child = branch.children[0]
  if (child) {
    const matching_child = tree.children.filter(e=>e.name===child.name)[0]
    if (matching_child) {
      graftBranch2Tree(child,matching_child)
    } else {
      tree.children.push(child)
    }
  }
}

const makeBranch = (path,size) => {
  const rev_path = path.slice().reverse()
  const head = rev_path.shift()
  return rev_path.reduce((acc,val) => {
    return {
      name:val.toString(),
      size,
      children:[acc]
    }
  },{
    name:head.toString(),
    size,
    children:[]
  })
}

exports.update = (path,size,tree) => {
  const branch = makeBranch(path,size)
  graftBranch2Tree(branch,tree)
}

exports.init = (name) => {
  return {
    name:name.toString(),
    size:0,
    children:[]
  }
}




