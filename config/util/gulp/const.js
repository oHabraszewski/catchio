let envs = []

module.exports.envs = envs

envs.push('dist', 'dev')

// ------------------------------------------------------------------------

let stripBlocks = []

module.exports.stripBlocks = stripBlocks

stripBlocks.push(
    {
        base: 'dev',
        key: 'start'
    },
    {
        base: 'prod',
        key: 'start'
    },
    {
        base: 'server',
        key: 'start'
    }
)

// ------------------------------------------------------------------------

let userAddons = []

module.exports.userAddons = userAddons

// ------------------------------------------------------------------------

let excludeRules = []

module.exports.excludeRules = excludeRules


