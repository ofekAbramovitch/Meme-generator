'use strict'

var gMeme
var gkeywords
var gkeywordsNumOfImg
var gFontSize
var gCircle
var gIsCircleDrag

function renderKeywords() {
    gkeywordsNumOfImg = localStorage.length
    gIdImg = 0
    gIdLine = 0
    gkeywords = ['Dog', 'Angry', 'Cat', 'Trump', 'Politics', 'Baby', 'Toy Story', 'Surprised', 'Buzz', 'Woody', 'Explaining', 'Putin', 'Laughing', 'Movie', 'Leonardo DiCaprio', 'Raising a glass', 'Wine', 'Champagne', 'Obama', 'Hat', 'Smiling']
}

function updateMeme(elImg) {
    const elCanvas = getgElCanvas()
    setFontSize(elCanvas.width)
    gMeme = {
        selectedImgId: elImg.dataset.id,
        selectedLineIdx: 0,
        elImg,
        lines: [{
            id: gIdLine++,
            text: 'Add Text',
            size: gFontSize,
            align: 'center',
            color: 'white',
            colorStroke: 'black',
            isSticker: false,
            x: elCanvas.width / 2,
            y: 50,
            rectSize: {
                pos: { x: 0, y: 50 - gFontSize },
                height: 65,
                width: elCanvas.width - 40
            },
            isDrag: false
        }],
    }
}


function addMemeLine(isEmptyLines) {
    if (isEmptyLines) gIdLine = 0
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return
    const elCanvas = getgElCanvas()
    var yPos = (gMeme.lines.length === 1) ? elCanvas.height - 20 : elCanvas.height / 2
    if (gMeme.lines.length === 0) yPos = 50
    gMeme.lines.push({
        id: gIdLine++,
        text: '',
        size: gFontSize,
        align: 'center',
        color: 'white',
        colorStroke: 'black',
        x: elCanvas.width / 2,
        y: yPos,
        rectSize: {
            pos: { x: 0, y: yPos - gFontSize },
            height: 65,
            width: elCanvas.width - 40
        },
        isDrag: false,
        isSticker: false
    })
    if (!isEmptyLines) gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function addSticker(elSticker) {
    const elCanvas = getgElCanvas()
    gMeme.lines.push({
        id: gIdLine++,
        text: '',
        isSticker: true,
        img: elSticker,
        x: elCanvas.width / 3,
        y: elCanvas.height / 3,
        sizeW: 100,
        sizeH: 100,
        size: 100,
        rectSize: {
            pos: { x: elCanvas.width / 3, y: elCanvas.height / 3 },
            height: 107,
            width: elSticker.width + 40
        },
    })
    gMeme.selectedLineIdx = gMeme.lines[gMeme.lines.length - 1].id
}

function getPosXToWrite(lineIdx) {
    const elCanvas = getgElCanvas()
    var xPos 
    switch (gMeme.lines[lineIdx].align) {
        case 'start':
            {
                xPos = 50
                break
            }
        case 'center':
            {
                xPos = elCanvas.width / 2
                break
            }
        case 'end':
            {
                xPos = elCanvas.width - 50
                break
            }
    }
    gMeme.x = xPos
    return xPos
}

function changeLinesId(gMeme) {
    gMeme.lines.forEach(function (line, idx) {
        line.id = idx
    })
    gIdLine = gMeme.lines.length
}

function setMemeText(text) {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) addLine()
    gMeme.lines[gMeme.selectedLineIdx].text = text
    writeText(gMeme.selectedLineIdx)
}

function changeLineSize(diff) {
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) {
        gMeme.lines[gMeme.selectedLineIdx].sizeH += diff
        gMeme.lines[gMeme.selectedLineIdx].sizeW += diff
        gMeme.lines[gMeme.selectedLineIdx].rectSize.width += diff
    } else {
        gMeme.lines[gMeme.selectedLineIdx].size += diff
        gMeme.lines[gMeme.selectedLineIdx].rectSize.pos.y -= diff
        gMeme.lines[gMeme.selectedLineIdx].rectSize.height += diff
    }
}

function changeAlign(align) {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return
    if (gMeme.lines.length === 1 && gMeme.lines[0].text === '') return
    gMeme.lines[gMeme.selectedLineIdx].align = align
    if (align === 'end') { }
    const posX = getPosXToWrite(gMeme.selectedLineIdx)
    gMeme.lines[gMeme.selectedLineIdx].x = posX
    renderCanvas()
    drawRect(gMeme.lines[gMeme.selectedLineIdx])
}

function changeColor() {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return
    const elColor = document.querySelector('.color-input')
    elColor.click()
}

function ChangeStrokeColor() {
    if (gMeme.lines[gMeme.selectedLineIdx].isSticker) return
    const elColor = document.querySelector('.color-input-stroke')
    elColor.click()
}

function saveMeme() {
    var numOfSaveImg = loadFromStorage('numOfSaveImg')
    if (!numOfSaveImg) {
        saveToStorage('numOfSaveImg', 1)
        numOfSaveImg = 1
    } else {
        numOfSaveImg++
    }
    renderCanvas()
    const elCanvas = getgElCanvas()
    const imgContent = elCanvas.toDataURL()
    saveToStorage(`meme${numOfSaveImg}`, [gMeme, imgContent])
    saveToStorage('numOfSaveImg', numOfSaveImg)
}

function downloadMeme(elLink) {
    renderCanvas()
    const elCanvas = getgElCanvas()
    const data = elCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'Your Meme'
    saveMeme()
}

function setLineDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function setFontSize(canvasWidth) {
    if (canvasWidth > 400) gFontSize = 50
    if (canvasWidth > 350) gFontSize = 45
    else if (canvasWidth > 300) gFontSize = 40
    else gFontSize = 35
}

function isStickerInCanvas() {
    return gMeme.lines.some(line => line.isSticker)
}

function createCircle(pos) {
    gCircle = {
        pos,
        size: 15,
        color: 'goldenrod',
    }
}

function isCircleClicked(clickedPos) {
    const { pos } = gCircle
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    return distance <= gCircle.size
}

function setCircleDrag(isDrag) {
    gIsCircleDrag = isDrag
}

function getMeme() {
    return gMeme
}

function getKeywords() {
    return gkeywords
}

function getFontSize() {
    return gFontSize
}

function getCircle() {
    return gCircle
}

function getIsCircleDrag() {
    return gIsCircleDrag
}