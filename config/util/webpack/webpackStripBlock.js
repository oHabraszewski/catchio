const loaderUtils = require("loader-utils");

const removeStripBlocks = require('./../removeStripBlocks.js')

function StripBlockLoader(content) {
    const options = loaderUtils.getOptions(this) || {};
    const startComment = options.start || 'develblock:start';
    const endComment = options.end || 'develblock:end';

    content = removeStripBlocks(startComment, endComment, content)
    
    if (this.cacheable) {
        this.cacheable(true);
    }

    return content;
}

module.exports = StripBlockLoader;