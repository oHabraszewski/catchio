const Screen = {
    width: document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth,
    height: document.body.clientHeight || window.innerHeight || document.documentElement.clientHeight
}
const Scale = Math.min(Screen.width / 1920, Screen.height / 1080)
export { Screen, Scale }
