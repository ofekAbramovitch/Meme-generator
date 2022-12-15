'use strict'

let gIsSaveShareDownload
let gEnd
let gElCanvas
let gCtx 
let gIsMove
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    document.querySelector('.editor-container').hidden = true;
    renderGallery()
}

function initPage(input, fromStr){
    gElCanvas = document.querySelector('.canvas')
    gCtx = gElCanvas.getContext('2d')
    document.querySelector('.gallery').hidden = true;
    // document.querySelector('.memes').hidden = true;
    document.querySelector('.editor-container').hidden = false;
    if(fromStr === 'gallery') createMeme(input)
    else initMeme(input)
    renderMeme()
    gIsMove = false
    gEnd = false
    addListeners()
}

function renderMeme() {
    const meme = getMeme()
    const img = findImgById(meme.selectedImgId)
    const elImg = new Image()
    elImg.src = img.url
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        renderLines()
        if(!gEnd) renderTextBox()
        else onLoadImgSaveMeme()
    }
}

function onRenderMemes() {
    const memes = getMemes()
    const strHTMLs = memes.reduce((acc, meme, index) => {
        acc.push(`<img onclick="initPage(${index}, 'meme')" src="${meme.memeUrl}">`)
        return acc
    }, [])
    console.log('strHTMLs:', strHTMLs)
    document.querySelector('.memes .container-imgs').innerHTML = strHTMLs.join('')
}

function renderLines(){
    const meme = getMeme()
    meme.lines.forEach(line => {
        gCtx.fillStyle = line.color
        gCtx.font = `${line.size}px Impact`
        gCtx.textAlign = line.align
        const {x, y} = line.pos
        gCtx.fillText(line.txt, x, y)
    });
}

function onSetText(el) {
    if(!isHaveLines()) return
    setLineTxt(`${el.value}`)
    renderMeme()
}

function onChangeAlign(align) {
    if(!isHaveLines()) return
    const meme = getMeme()
    meme.lines[meme.selectedLineIdx].align = align
    renderMeme()
}

function onAddLine() {
    const meme = getMeme()
    const numberOfLine = meme.lines.length
    let y
    const x = gElCanvas.width / 2
    switch (numberOfLine) {
        case 0:
            y = 50
            break;
        case 1:
            y = gElCanvas.height - 50
            break;
        case 2:
            y = gElCanvas.height / 2
            break;
        case 3:
            y = gElCanvas.height / 2 + 50
            break;
        case 4:
        y = gElCanvas.height / 2 - 50
        break;
    }
    addLine({x, y})
    document.querySelector('.text').value = ''
    renderMeme()
}

function onChangeFontSize(change) {
    if(!isHaveLines()) return
    const meme = getMeme()
    meme.lines[meme.selectedLineIdx].size += change
    renderMeme()
}

function onSetColorText(color) {
    if(!isHaveLines()) return
    const meme = getMeme()
    meme.lines[meme.selectedLineIdx].color = color.value
    renderMeme()
}

function onRemoveLine() {
    removeLine()
    renderMeme()
    document.querySelector('.text').value = ''
}

function onSwitchLine() {
    const meme = getMeme()
    if(meme.selectedLineIdx >= meme.lines.length - 1) meme.selectedLineIdx = 0
    else meme.selectedLineIdx += 1
    document.querySelector('.text').value = ''
    renderMeme()
    renderTextBox()
}

function renderTextBox() {
    if(!isHaveLines()) return
    const meme = getMeme()
    const pos = meme.lines[meme.selectedLineIdx].pos
    const size = meme.lines[meme.selectedLineIdx].size
    const x = 20
    const width = gElCanvas.width - 40
    const y = pos.y - size + 5
    gCtx.strokeStyle = 'black'
    gCtx.strokeRect(x, y, width, size)
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown() {
    console.log('lkdcs:')
    gIsMove = true
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    if(!gIsMove) return 
    const pos = getEvPos(ev)
    if (!isTextBoxClicked(pos)) return
    const meme = getMeme()
    meme.lines[meme.selectedLineIdx].pos = pos
    renderMeme()
}

function onUp() {
    document.body.style.cursor = 'grab'
    gIsMove = false
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }

    return pos
}

function isTextBoxClicked(posClick) {
    const meme = getMeme()
    const pos = meme.lines[meme.selectedLineIdx].pos
    const size = meme.lines[meme.selectedLineIdx].size
    const width = gElCanvas.width - 40
    const y = pos.y - size + 5
    if(posClick.x > 20 && posClick.x < width && 
       posClick.y > y && posClick.y < y + size) return true

       return false
}

function onSaveMeme() {
    gEnd = true
    gIsSaveShareDownload = 'save'
    renderMeme()
    document.querySelector('.memes').hidden = false;
    document.querySelector('.editor').hidden = true;
}

function onLoadImgSaveMeme(){
    const meme = getMeme()
    meme.memeUrl =  gElCanvas.toDataURL('image/png')
    saveMeme(meme)
    renderMeme()
}

function downloadImg(elLink) {
    const meme = getMeme()
    const img = findImgById(meme.selectedImgId)
    const elImg = new Image()
    elImg.src = img.url
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        renderLines()
    }
    renderMeme()
    elLink.href = gElCanvas.toDataURL('image/jpeg')
}
