const CREATE = 'CREATE'
const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'
const UPDATE = 'UPDATE'
const SET_PROP = 'SET_PROP'
const REMOVE_PROP = 'REMOVE_PROP'

function flatten(arr) {
    return [].concat.apply([], arr)
}

function h(type, props, ...children) {
    props = props || {}

    return { type, props, children: flatten(children) }
}

function view(count) {
    const r = [...Array(count).keys()]

    return <ul id="cool" className={`my-class-${count % 3}`}>
        { r.map(n => <li> item {(count * n).toString()} </li>)}
        </ul>
}

function createElement(node) {
    if (typeof node === 'string') {
        return document.createTextNode(node)
    }

    const el = document.createElement(node.type)

    setProps(el, node.props)
    node.children.map(createElement).forEach(el.appendChild.bind(el))

    return el
}

function setProps(target, props) {
    Object.keys(props).forEach(name => {
        setProp(target, name, props[name])
    })
}

function setProp(target, name, value) {
    if (name === 'className') {
        return target.setAttribute('class', value)
    }

    target.setAttribute(name, value)
}

function patch(parent, patches, index=0) {
    if (!patches) {
        return
    }

    const el = parent.childNodes[index]

    switch (patches.type) {
        case CREATE: {
            const {newVnode} = patches
            const newEl = createElement(newVnode)
            return parent.appendChild(newEl)
        }
        case REMOVE_PROP: {

            break;
        }
        case REPLACE: {

            break;
        }

        case REMOVE: {

            break;
        }

        case UPDATE: {

            break;
        }

    }
}

function changed(vnode, newVnode) {
    return typeof vnode !== typeof newVnode || typeof vnode === 'string' && vnode !== newVnode || vnode.type !== newVnode.type
}

function diff(vnode, newVnode) {
    let patches = []
    
    if (! vnode) {
        return { type: CREATE, newVnode}
    }

    if (! newVnode) {
        return { type: REMOVE}
    }

    if (changed(vnode, newVnode)) {
        return { type: REPLACE, newVnode}
    }

    if (newVnode.type) {
        return {
            type: UPDATE,
            children: diffChildren(vnode, newVnode)
        }
    }

}

function diffChildren(vnode, newVnode) {
    let patches = []

    const patchesLength = Math.max(vnode.children.length, newVnode.children.length)

    for (let i = 0; i < patchesLength; i++) {
        patches[i] = diff(vnode.children[i], newVnode.children[i])
    }

    return patches

}

function tick(el, count)
{
    const patches = diff(view(count), view(count+1))
    patch(el, patches)
    console.log(count, patches);
    if (count > 20) { return }
    setTimeout(() => tick(el, count + 1), 500)
}

function render(el) {
    el.appendChild(createElement(view(0)))
    setTimeout(() => tick(el, 0), 500)
}