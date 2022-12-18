'use strict'

var gImgs
var gIdLine
var gIdImg
var gImgSelect

function createImgs() {
    gImgs = []
    gImgs.push(_createImg(['Politics', 'Trump', 'Angry']))
    gImgs.push(_createImg(['Pet', 'Dog', 'cute', 'Lick', 'Kiss']))
    gImgs.push(_createImg(['Dog', 'Baby', 'Sleep', 'Bed']))
    gImgs.push(_createImg(['Cat', 'Sleep', 'Laptop']))
    gImgs.push(_createImg(['Baby', 'Happy', 'Beach']))
    gImgs.push(_createImg(['Movie', 'Explaining']))
    gImgs.push(_createImg(['Baby', 'Shocked', 'Surprised']))
    gImgs.push(_createImg(['Movie', 'Hat', 'Smiling']))
    gImgs.push(_createImg(['Smiling', 'Baby', 'Laughing']))
    gImgs.push(_createImg(['Laughing', 'Obama', 'Politics']))
    gImgs.push(_createImg(['Kiss', 'Sport']))
    gImgs.push(_createImg(['TV', 'Pointing']))
    gImgs.push(_createImg(['Leonardo DiCaprio', 'Movie', 'Raising a glass', 'Wine', 'Champagne']))
    gImgs.push(_createImg(['Movie', 'Sunglasses']))
    gImgs.push(_createImg(['Movie', 'Explaining']))
    gImgs.push(_createImg(['Laughing', 'Movie']))
    gImgs.push(_createImg(['Politics', 'Explaining', 'Putin']))
    gImgs.push(_createImg(['Toy Story', 'Buzz', 'Woody']))
}

function _createImg(keywords) {
    return { id: gIdImg++, url: `img/${gIdImg}.jpg`, keywords };
}

function addImg(img) {
    gImgs.unshift({ id: gIdImg++, url: img.src, keywords: [] });
}

function openGallery() {
    var elEditor = document.querySelector('.editor-container')
    elEditor.classList.add('hide')
    var elGallery = document.querySelector('.gallery')
    elGallery.classList.remove('hide')
    gMeme = null
    document.querySelector('.text-line').value = ''
}

function initMyMemes() {
    var elEditor = document.querySelector('.editor-container')
    elEditor.classList.add('hide')
    var elGallery = document.querySelector('.gallery')
    elGallery.classList.add('hide')
    renderMyMemes()
}

function renderMyMemes() {
    var strHtml = ''
    for (var i = 1; i <= loadFromStorage('numOfSaveImg'); i++) {
        var meme = loadFromStorage(`meme${i}`)
        strHtml += `<img class="gallery-img" data-id="${i}" onclick="selectImg(this)" src="${meme[1]}" alt="">`
    }
    var elContainer = document.querySelector('.container-my-memes')
    elContainer.innerHTML = strHtml
}

function selectImg(selectElImg) {
    gImgSelect = selectElImg
    const elImgs = document.querySelectorAll('.gallery-img')
    elImgs.forEach(img => img.classList.remove('selected'))
    selectElImg.classList.add('selected')
  
}

function downloadMeme(elLink) {
    if (!gImgSelect) return
    elLink.href = gImgSelect.src
    elLink.download = 'your Meme'
}

function getImgs() {
    return gImgs
}

function openMenu() {
    document.body.classList.toggle('menu-open')
}