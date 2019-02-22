import {createElement, diff, mount, render} from "./src/vdom";

const createVApp =  (count) => createElement('div', {
    attrs: {
        id: 'app',
        dataCount: count,
    },
    children: [
        createElement('input', {
            attrs: {
                value: String(count)
            }
        }),
        String(count),
        ...Array.from({length: count}, () => createElement('img', {
            attrs: {
                src: 'https://media.giphy.com/media/vRMiNAqy6seD57KFzf/giphy.gif'
            }
        }))
    ]
})

let n = 0

let vApp = createVApp(n)

let $app =  render(vApp)

let $rootEl = mount($app, document.getElementById('app'))

setInterval(() => {
    const n = Math.floor(Math.random() * 10) + 1;

    let newVApp = createVApp(n)

    let patch = diff(vApp, newVApp)

    $rootEl = patch($rootEl)

    vApp = newVApp
}, 1000)
