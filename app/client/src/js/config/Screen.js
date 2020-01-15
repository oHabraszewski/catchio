const Screen = {
    width: document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth,
    height: document.body.clientHeight || window.innerHeight || document.documentElement.clientHeight
}
const Scale = Math.floor(Math.min(Screen.width / 1920, Screen.height / 1080)*40)/40
const Canvas = {
    width: 1920 * Scale,
    height: 1080 * Scale
}
export { Canvas, Scale, Screen }
