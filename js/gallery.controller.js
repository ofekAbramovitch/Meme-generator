'use strict'

var gCurrSerachNum = 0

function renderGallery(imgs = getImgs()) {
    var strHTML = ''
    imgs.forEach((img, idx) => {
        strHTML += `<img class="gallery-img" data-id="${idx}" src="${img.url}" alt="" onclick="renderMeme(this)">`
    })
    var elImgs = document.querySelector('.imgs-container')
    elImgs.innerHTML = strHTML
   
}

function renderSearches() {
    var strHTML = ''
    var keywords = getKeywords()
    var keyMap = getObjMapSearches()
    for (var i = gCurrSerachNum; i < gCurrSerachNum + 4; i++) {
        if (!keywords[i]) break
        var size = 16 + keyMap[keywords[i]] * 2 + 'px'
        strHTML += `<span class="keywords" data-trans="${keywords[i]}" data-value="${keywords[i]}" onclick="filterImg(this)" style="font-size: ${size};">${keywords[i]}</span>`
    }
    document.querySelector('.searched').innerHTML = strHTML
}

function moreSearch() {
    var keywords = getKeywords()
    gCurrSerachNum += 5
    if (gCurrSerachNum >= keywords.length) gCurrSerachNum = 0
    renderSearches()
}

function getObjMapSearches() {
    var keyMap = {}
    var imgs = getImgs()
    imgs.forEach(function(img) {
        var keywordsInImg = img.keywords
        keywordsInImg.forEach(function(key) {
            if (!keyMap[key]) keyMap[key] = 0
            keyMap[key]++
        })
    })
    return keyMap
}

function filterImg(elSearchWord) {
    if (!elSearchWord) elSearchWord = document.querySelector('.filter-img').value
    else if (elSearchWord.value) elSearchWord = elSearchWord.value
    else elSearchWord = elSearchWord.dataset.value
    elSearchWord = elSearchWord.toLowerCase()
    var imgs = getImgs()
    var imgsToDisplay = imgs.filter(img =>
        img.keywords.find(key => key.toLowerCase().includes(elSearchWord))
    )
    renderGallery(imgsToDisplay)
}

function onImgInput(ev) {
    loadImageFromInput(ev, addImg)
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()
    reader.onload = function(event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])

}

function addImgToGallery(btnAddImg) {
    if (btnAddImg.classList.contains('upload')) {
        document.getElementById('getFile').click()
        setTimeout(() => {
            btnAddImg.innerText = 'Add'
            btnAddImg.dataset.trans = 'add'
            btnAddImg.classList.add('add-img')
            btnAddImg.classList.remove('upload')
            doTrans()
        }, 1000)
    } else {
        btnAddImg.innerText = 'Upload'
        btnAddImg.dataset.trans = 'upload'
        btnAddImg.classList.remove('add-img')
        btnAddImg.classList.add('upload')
    }
    renderGallery()
}