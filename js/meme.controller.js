'use strict'

let gCtx
let gElCanvas


function onInit() {
    document.querySelector('.editor').hidden = true
    renderGallery()
    gElCanvas = document.querySelector('.canvas')
    gCtx = gElCanvas.getContext('2d')
}

function renderMeme(imgId) {
    if (document.querySelector('.editor-container').classList.contains('hide')) openEditor()
    const meme = getMeme()
    if (!meme) resizeCanvas()
    gCtx.drawImage(imgId, 0, 0, gElCanvas.width, gElCanvas.height)
    meme = getMeme()
    if (!meme || !meme.lines.length) {
        updateMeme(imgId)
        renderCanvas()
        return
    }
    meme.lines.forEach((line) => setLineTxt(line))
}

function openEditor() {
    var elEditor = document.querySelector('.editor-container')
    elEditor.classList.remove('hide')
    var elEditor = document.querySelector('.gallery')
    elEditor.classList.add('hide')
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
    renderCanvas()
}

function renderCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    var meme = getMeme()
    if (meme) renderMeme(meme.imgId)
}

function getElCanvas() {
    return gElCanvas
}