'use strict'

let gMeme
let gImgs = createGallery()
let gFontSize

function createMeme(imgId, selectedLineIdx = 0) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx,
        lines: [createLine({ x: 200, y: 50 }, 'hello', 50, 'center', 'red')]
    }
}

function createLine(pos, txt, size, align, color) {
    return {
        pos,
        txt,
        size,
        align,
        color
    }
}

function getMeme() {
    return gMeme
}

function setLineTxt(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function addLine() {
    const line = createLine(pos, 'hello', 50, 'center', 'red')
    gMeme.lines.push(line)
    gMeme.selectedLineIdx += 1
}

function deleteLine() {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = 0
}

function isLineExist() {
    return gMeme.lines.length > 0
}

function createGallery() {
    return [
        { id: 1, url: 'img/1.jpg', keywords: ['trump', 'angry', 'politics'] },
        { id: 2, url: 'img/2.jpg', keywords: ['puppy', 'dog', 'pets'] },
        { id: 3, url: 'img/3.jpg', keywords: ['funny', 'dog', 'baby', 'sleep', 'bed'] },
        { id: 4, url: 'img/4.jpg', keywords: ['sleep', 'cat', 'laptop'] },
        { id: 5, url: 'img/5.jpg', keywords: ['baby', 'cat', 'happy', 'beach'] },
        { id: 6, url: 'img/6.jpg', keywords: ['happy', 'cat', 'hair'] },
        { id: 7, url: 'img/7.jpg', keywords: ['baby', 'cat', 'surprised'] },
        { id: 8, url: 'img/8.jpg', keywords: ['funny', 'hat'] },
        { id: 9, url: 'img/9.jpg', keywords: ['happy', 'smile', 'baby'] },
        { id: 10, url: 'img/10.jpg', keywords: ['funny', 'smile', 'happy', 'obama', 'politics'] },
        { id: 11, url: 'img/11.jpg', keywords: ['kiss', 'cat', 'fighter'] },
        { id: 12, url: 'img/12.jpg', keywords: ['tv', 'pointing', 'finger'] },
        { id: 13, url: 'img/13.jpg', keywords: ['DiCaprio', 'happy', 'movie', 'glass', 'wine'] },
        { id: 14, url: 'img/14.jpg', keywords: ['movie', 'sunglasses'] },
        { id: 15, url: 'img/15.jpg', keywords: ['movie', 'explain'] },
        { id: 16, url: 'img/16.jpg', keywords: ['funny', 'happy', 'hand on face'] },
        { id: 17, url: 'img/17.jpg', keywords: ['putin', 'politics'] },
        { id: 18, url: 'img/18.jpg', keywords: ['movie', 'toy story', 'buzz', 'woody'] }
    ]
}

function getImgs() {
    return gImgs
}

function findImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function updateMeme(imgId) {
    const elCanvas = getElCanvas()
    setFontSize(elCanvas.width)
    gMeme = {
        selectedImgId: imgId.dataset.id,
        selectedLineIdx: 0,
        imgId,
        lines: [createLine({ x: 200, y: 50 }, 'hello', 50, 'center', 'red')]
    }
}

function setFontSize(canvasWidth) {
    if (canvasWidth > 400) gFontSize = 50
    if (canvasWidth > 350) gFontSize = 45
    else if (canvasWidth > 300) gFontSize = 40
    else gFontSize = 35
}