'use strict'

var gElCanvas
var gCtx
var gStartPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    renderKeywords()
    createImgs()
    renderGallery()
    gElCanvas = document.querySelector('.canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    addListeners()
    renderSearches()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        if (document.querySelector('.imgs-container').classList.contains('hide')) renderCanvas()
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('click', onImgSelect)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth;
    renderCanvas()
}

function renderCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    const meme = getMeme()
    if (meme) renderMeme(meme.elImg)
}

function renderMeme(elImg) {
    if (document.querySelector('.editor-container').classList.contains('hide')) openEditor()
    var meme = getMeme()
    if (!meme) resizeCanvas()
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
    var meme = getMeme()
    if (!meme || !meme.lines.length) {
        updateMeme(elImg)
        renderCanvas()
        return
    }
    meme.lines.forEach((line, idx) => writeText(idx, true))
}

function onImgSelect(ev) {
    const pos = getEvPos(ev)
    var meme = getMeme()
    if (meme.lines.length === 1 && meme.lines[0].text === '') return
    var lineClick = islineClick(ev)
    if (lineClick) {
        const idxLine = meme.lines.findIndex(line =>
            line === lineClick
        )
        if (lineClick.text === 'Add Text' && lineClick.id === 0) {
            document.querySelector('.text-line').value = ''
        } else document.querySelector('.text-line').value = lineClick.text
        renderCanvas()
        drawRect(lineClick)
        meme.selectedLineIdx = idxLine
    } else {
        if (!isStickerInCanvas() || !isCircleClicked(pos)) renderCanvas()
    }
}

function onDown(ev) {
    const meme = getMeme()
    const pos = getEvPos(ev)
    var lineClick = islineClick(ev)
    if (isStickerInCanvas() && isCircleClicked(pos)) {
        setCircleDrag(true)
        gStartPos = pos
        document.body.style.cursor = 'nw-resize'
    } else {
        if (!lineClick || meme.selectedLineIdx !== lineClick.id) return
        setLineDrag(true)
        document.body.style.cursor = 'grabbing'
        gStartPos = pos
    }
}

function onUp(ev) {
    onImgSelect(ev)
    setLineDrag(false)
    if (isStickerInCanvas()) {
        setCircleDrag(false)
    }
    document.body.style.cursor = 'unset'
}

function onMove(ev) {
    const memeLine = getMeme().lines[getMeme().selectedLineIdx];
    const pos = getEvPos(ev)
    if (isStickerInCanvas() && isCircleClicked(pos)) {
        var isCircleDrag = getIsCircleDrag()
        if (isCircleDrag) {
            const dx = pos.x - gStartPos.x
            const dy = pos.y - gStartPos.y
            changeStickerSize(memeLine, dx, dy)
            gStartPos = pos
            renderCanvas()
            drawRect(memeLine)
        } else {
            document.body.style.cursor = 'nw-resize'
        }
    } else if (memeLine.isDrag) {
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveLine(memeLine, dx, dy)
        gStartPos = pos
        renderCanvas()
        drawRect(memeLine)
    } else if (islineClick(ev)) {
        document.body.style.cursor = 'grab'
    }
    if (isStickerInCanvas() && !isCircleClicked(pos) && !islineClick(ev)) {
        document.body.style.cursor = 'unset'
    }
}

function moveLine(memeLine, dx, dy) {
    memeLine.x += dx
    memeLine.y += dy
    memeLine.rectSize.pos.x += dx
    memeLine.rectSize.pos.y += dy
}

function changeStickerSize(memeLine, dx, dy) {
    memeLine.sizeW += dx
    memeLine.sizeH += dy
    memeLine.rectSize.width += dx
    memeLine.rectSize.height += dy
}

function selectSticker(elSticker) {
    document.querySelector('.text-line').value = ''
    addSticker(elSticker)
    renderCanvas()
    const meme = getMeme()
    drawRect(meme.lines[meme.selectedLineIdx])
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function islineClick(ev) {
    const meme = getMeme()
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return meme.lines.find(line =>
        pos.x > line.rectSize.pos.x &&
        pos.x < (line.rectSize.pos.x + line.rectSize.width) &&
        pos.y > line.rectSize.pos.y &&
        pos.y < (line.rectSize.pos.y + line.rectSize.height)
    )
}

function writeText(lineIdx, isBackUpTexted = false) {
    setFontSize(gElCanvas.width)
    const meme = getMeme()
    const memeLine = meme.lines[lineIdx]
    if (!isBackUpTexted) {
        renderCanvas()
        drawRect(memeLine)
    }
    if (memeLine.isSticker) {
        const img = new Image()
        img.src = memeLine.img.src
        gCtx.drawImage(img, memeLine.x, memeLine.y, memeLine.sizeW, memeLine.sizeH)
    } else {
        gCtx.strokeStyle = memeLine.colorStroke
        gCtx.lineWidth = 2
        gCtx.textAlign = memeLine.align
        gCtx.fillStyle = memeLine.color
        gCtx.font = `${memeLine.size}px Impact`
        gCtx.fillText(memeLine.text, memeLine.x, memeLine.y)
        gCtx.strokeText(memeLine.text, memeLine.x, memeLine.y)
    }
}

function drawRect(memeLine) {
    var x = memeLine.rectSize.pos.x
    var y = memeLine.rectSize.pos.y
    var width = (memeLine.isSticker) ? memeLine.rectSize.width : gElCanvas.width
    var height = (memeLine.isSticker) ? memeLine.sizeH : memeLine.size
    gCtx.beginPath()
    gCtx.rect(x, y, width, height + 10)
    gCtx.fillStyle = '#aab5b83d'
    gCtx.fillRect(x, y, width, height + 10)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
    if (memeLine.isSticker) {
        var posCircle = { x: x + width, y: y + memeLine.sizeH + 10 }
        createCircle(posCircle)
        drawArc(posCircle.x, posCircle.y)
    }
}

function drawArc(x, y) {
    gCtx.beginPath()
    gCtx.lineWidth = '6'
    gCtx.arc(x, y, 7, 0, 2 * Math.PI)
    gCtx.fillStyle = 'blue'
    gCtx.fill()

}

function addLine() {
    document.querySelector('.text-line').value = ''
    document.querySelector('.text-line').focus()
    addMemeLine(false)
}

function deleteLine() {
    document.querySelector('.text-line').value = ''
    const meme = getMeme()
    if (meme.lines.length === 1 && meme.lines[0].text === '') return

    const currlineIdx = meme.selectedLineIdx
    meme.lines.splice(currlineIdx, 1)
    if (meme.lines.length) {
        renderCanvas()
        changeLinesId(meme)
        if (currlineIdx) {
            drawRect(meme.lines[currlineIdx - 1])
            meme.selectedLineIdx = currlineIdx - 1
        } else {
            drawRect(meme.lines[0])
            meme.selectedLineIdx = 0
        }
    } else {
        addMemeLine(true)
        renderCanvas()
    }
}

function moveLineUpOrDown(diff) {
    const meme = getMeme()
    if (meme.lines.length === 1 && meme.lines[0].text === '') return
    const lineNum = meme.selectedLineIdx
    var currLine = meme.lines[lineNum]
    currLine.y += diff
    currLine.rectSize.pos.y += diff
    renderCanvas()
    drawRect(currLine)
}

function switchLine() {
    const meme = getMeme()
    if ((meme.selectedLineIdx === 0)) meme.selectedLineIdx = meme.lines.length - 1
    else meme.selectedLineIdx--
    renderCanvas()
    drawRect(meme.lines[meme.selectedLineIdx])
    document.querySelector('.text-line').value = meme.lines[meme.selectedLineIdx].text
}

function changeSize(diff) {
    changeLineSize(diff)
    renderCanvas()
    drawRect(gMeme.lines[gMeme.selectedLineIdx])
}

function changeColor() {
    const elColor = document.querySelector('.color-input')
    gMeme.lines[gMeme.selectedLineIdx].color = elColor.value
    renderCanvas()
}

function changeColorStroke() {
    const elColor = document.querySelector('.color-input-stroke')
    gMeme.lines[gMeme.selectedLineIdx].colorStroke = elColor.value
    renderCanvas()
}

function openEditor() {
    var elEditor = document.querySelector('.editor-container')
    elEditor.classList.remove('hide')
    var elGallery = document.querySelector('.gallery')
    elGallery.classList.add('hide')
    var elMyMemes = document.querySelector('.container-my-memes')
    elMyMemes.classList.add('hide')
}

function getgElCanvas() {
    return gElCanvas
}
