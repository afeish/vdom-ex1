export const createElement = (tagName, { attrs = {}, children = [] } = {}) => {
    return {
        tagName,
        attrs,
        children
    }
}

export const renderElem = (vnode) => {
    const $el = document.createElement(vnode.tagName)

    for (const [k, v] of Object.entries(vnode.attrs)) {
        $el.setAttribute(k, v)
    }

    for (const child of vnode.children) {
        $el.appendChild(render(child))
    }

    return $el
}

export const render = (vNode) => {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode)
    }

    return renderElem(vNode)
}

export const mount = ($node, $target) => {
    $target.replaceWith($node)
    return  $node
}

// old none, new have
// old have, new changed
// old have, new none
const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = []
    
    // new have, old none
    for (const [k, v] of Object.entries(newAttrs)) {
        patches.push($node => {
            $node.setAttribute(k,v)
            return $node
        })
    }
    
    // remove old attributes
    for (const [k] of Object.entries(oldAttrs)) {
        if (!(k in newAttrs)) {
            patches.push(($node => {
                $node.removeAttribute(k)
                return $node
            }))
        }
    } 
    
    return $node => {
        for (const patch of patches) {
            patch($node)
        }

        return $node
    }
}

const zip = (xs, ys) => {
    const zipped = []

    for (let i = 0; i < Math.min(xs.length, ys.length); i ++) {
        zipped.push([xs[i], ys[i]])
    }

    return zipped
}


const diffChildren = (oldChildren, newChildren) => {
    const childPatches = []

    console.log(oldChildren.length, newChildren.length)

    oldChildren.forEach((oldChild, i) => {
        childPatches.push(diff(oldChild, newChildren[i]))
    })

    const additionalPatches = []

    for (const additionalChild of newChildren.slice(oldChildren.length)) {
        additionalPatches.push($node => {
            $node.appendChild(render(additionalChild))
            return $node
        })
    }

    return ($parent) => {

        for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
            patch(child)
        }

        for (const patch of additionalPatches) {
            patch($parent)
        }
        return $parent
    }
}

export const diff = (vNode, newVNode) => {
    if (newVNode === undefined) {
        return ($node) => {
            $node.remove()
            return undefined
        }
    }

    if (typeof vNode === 'string' ||
        typeof newVNode === 'string') {
        if (vNode !== newVNode) {
            // could be 2 cases:
            // 1. both trees are string and they have different values
            // 2. one of the trees is text node and
            //    the other one is elem node
            // Either case, we will just render(newVTree)!
            return $node => {
                const $newNode = render(newVNode);
                $node.replaceWith($newNode);
                return $newNode;
            };
        } else {
            // this means that both trees are string
            // and they have the same values
            return $node => $node;
        }
    }

    if (vNode.tagName !== newVNode.tagName) {
        return ($node) => {
            const $newNode = render(newVNode)
            $node.replaceWith($newNode)
            return $newNode
        }
    }


    // replace attrs
    let patchAttrs =  diffAttrs(vNode.attrs, newVNode.attrs)
    let patchChildren =  diffChildren(vNode.children, newVNode.children)

    return ($node) => {
        patchAttrs($node)
        patchChildren($node)
        return $node
    }
}