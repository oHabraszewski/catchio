module.exports = (pStartComment, pEndComment, pContent) => {

    const startComment = pStartComment || 'dev:start';
    const endComment = pEndComment || 'dev:end';

    const regexPattern1 = new RegExp(`\\/\\* *${startComment} *\\*\\/[\\s\\S]*?\\/\\* *${endComment} *\\*\\/`, 'g') // js, css, scss
    const regexPattern2 = new RegExp(`<!-- *${startComment} *-->[\\s\\S]*?<!-- *${endComment} *-->`, 'g') // html

    let content = pContent

    content = content.replace(regexPattern1, '');
    content = content.replace(regexPattern2, '');
    
    return content
}




//  \/\* *dev:start *\*\/[\s\S]*?\/\* *dev:end *\*\/
// <!-- *dev:start *-->[\s\S]*<!-- *dev:end *-->


// \\/\\* *dev:start *\\*\\/[\\s\\S]*?\\/\\* *dev:end *\\*\\/
// <!-- *dev:start *-->[\\s\\S]*<!-- *dev:end *-->