'use strict'

function renderGallery() {
    const imgs = getImgs()
    const strHTMLs = imgs.reduce((acc, img) => {
        acc.push(`<img class="gallery-img" onclick="initPage(${img.id})" src="${img.url}">`) 
        return acc
    }, [])
    document.querySelector('.imgs-container').innerHTML = strHTMLs.join('')
}

function renderOptionKeyword(elInput) {
    const input = elInput.value
    const keywords = getRightKeyword(input)
    const strHTMLs = keywords.reduce((acc, keyword) => {
        acc.push(`<option value="${keyword}">`)
        return acc
    }, [])
    document.getElementById('keyword').innerHTML = strHTMLs.join('')
    renderGallery()
}
