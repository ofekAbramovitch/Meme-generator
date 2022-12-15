'use strict'

let gImgs = createGallery()
let gFilterKeyword = ''

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
    if(!gFilterKeyword) return gImgs
    const keywords = getRightKeyword(gFilterKeyword)
    return gImgs.reduce((acc, img) => {
        img.keywords.forEach(keyword => {
            if(keywords.includes(keyword)) acc.push(img)  
        })
        return acc
    }, []) 
}

function findImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function getRightKeyword(input) {
    gFilterKeyword = input
    return gImgs.reduce((acc, img) => {
        const keywords = img.keywords
        keywords.forEach(keyword => {
            if(!keyword.indexOf(input)) {
                if(!acc.includes(keyword)) acc.push(keyword)
            } 
        })
        return acc
    }, [])
}