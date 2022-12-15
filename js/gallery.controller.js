'use strict'

function renderGallery() {
    const imgs = getImgs()
    const strHTMLs = imgs.reduce((acc, img) => {
        acc.push(`<img class="gallery-img" onclick="renderMeme(${img.id})" src="${img.url}">`) 
        return acc
    }, [])
    document.querySelector('.imgs-container').innerHTML = strHTMLs.join('')
}

