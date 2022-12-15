'use strict'

const MEMESKEY = 'memes'
let gMeme
let gMemes = createMemes()

function createMemes() {
    // let memes = loadFromStorage(MEMESKEY)
    let memes
    if (!memes) memes = []
    return memes
}

function createMeme(imgId, selectedLineIdx = 0, memeUrl = '') {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx,
        lines: [createLine({ x: 200, y: 50 }, 'hello', 50, 'center', 'red')],
        memeUrl
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


function setLineTxt(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function addLine(pos) {
    const line = createLine(pos, 'hello', 50, 'center', 'red')
    gMeme.lines.push(line)
    gMeme.selectedLineIdx += 1
}

function removeLine() {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = 0
}

function isHaveLines() {
    return gMeme.lines.length > 0
}

function saveMeme(meme) {
    if (!gMemes.includes(meme)) gMemes.push(meme)
    saveToStorage(MEMESKEY, gMemes)
}

function getMemes() {
    return gMemes
}

function initMeme(index) {
    gMeme = gMemes[index]
}

function getMeme() {
    return gMeme
}
