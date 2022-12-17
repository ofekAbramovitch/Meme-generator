'use strict'

var gImgs
var gIdLine
var gIdImg

function _createImgs() {
    gImgs = []
    gImgs.push(_createImg(['Politics', 'Trump','Angry' ]))
    gImgs.push(_createImg(['Pet', 'Dog', 'cute', 'Lick', 'Kiss']))
    gImgs.push(_createImg(['Dog', 'Baby', 'Sleep','Bed']))
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
    gIdLine = 0
    var elEditor = document.querySelector('.editor-container')
    elEditor.classList.add('hide')
    var elEditor = document.querySelector('.gallery')
    elEditor.classList.remove('hide')
    gMeme = null
    document.querySelector('.text-line').value = ''
}


function getImgs() {
    return gImgs
}

function openMenu() {
    document.body.classList.toggle('menu-open')
}