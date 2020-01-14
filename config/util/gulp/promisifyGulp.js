module.exports = (gulpFunction) => {
    return new Promise((resolve, reject) => {
        gulpFunction((err) => {
            if(err) reject(err)
            resolve()
        })
    })
}