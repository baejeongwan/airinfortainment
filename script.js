let aboutModal = new bootstrap.Modal(document.getElementById('aboutModal'))
let landingModal = new bootstrap.Modal(document.getElementById('landingModal'))
let videoModal = new bootstrap.Modal(document.getElementById('videoModal'))
let videoPlayModal = new bootstrap.Modal(document.getElementById('videoPlayModal'))
let flightInfoModal = new bootstrap.Modal(document.getElementById('flightInfoModal'))
let imageModal = new bootstrap.Modal(document.getElementById('imageModal'))
let imageShowModal = new bootstrap.Modal(document.getElementById('imageShowModal'))
let videoList = []
let imageList = []


//#region 잠금화면 제어
function unlockUI() {
    document.getElementById('lockscreen').classList.add('unlocked')
    setTimeout(() => {
        document.getElementById('lockscreen').classList.add('d-none')
        document.getElementById('container').classList.remove('d-none')
    }, 500)
}

function lockUI() {
    document.getElementById('lockscreen').classList.remove('d-none')
    document.getElementById('lockscreen').classList.remove('unlocked')
    setTimeout(() => {
        document.getElementById('container').classList.add('d-none')
    }, 500)
    
}
//#endregion

//#region 시계
setInterval(clockUpdate, 500)

function clockUpdate() {
    let now = new Date();
    let hour = 0;
    let minute = 0;
    if (now.getMinutes() < 10) {
        minute = "0" + now.getMinutes().toString()
    } else {
        minute = now.getMinutes().toString()
    }

    if (now.getHours() < 10) {
        hour = "0" + now.getHours().toString()
    } else {
        hour = now.getHours().toString()
    }

    document.getElementById('clock').innerText = hour + " : " + minute
    console.log(hour + " : " + minute);
}
//#endregion

//#region 버튼 작업
function about() {
    aboutModal.show()
}

function land() {
    landingModal.show()
}

function video() {
    videoModal.show()
    fetch('./video/database.json')
        .then((response) => response.json())
        .then((data) => videoList = data)
        .then(() => {
            document.getElementById('videoListGroup').innerHTML = ""
            videoList.forEach((element, index) => {
                document.getElementById('videoListGroup').innerHTML += `
                <a onclick="playVideo(${index})" class="list-group-item list-group-item-action">${element.name}</a>`
            })
        })
}

function image() {
    imageModal.show()
    fetch('./image/database.json')
        .then((response) => response.json())
        .then((data) => imageList = data)
        .then(() => {
            document.getElementById('imageListGroup').innerHTML = ""
            imageList.forEach((element, index) => {
                document.getElementById('imageListGroup').innerHTML += `
                <a onclick="showImage(${index})" class="list-group-item list-group-item-action">${element.file}</a>`
            })
        })
}

function flightInfo() {
    flightInfoModal.show()
}
//#endregion

//#region 미디어
function playVideo(number) {
    videoPlayModal.show()
    if (videoList[number].type == "file") {
        document.getElementById("video-play-modal-body").innerHTML = `
        <video controls class="w-100 h-100">
            <source id="videoPlayModalvideo" src="${"./video/" + videoList[number].link}" />
        </video>`
        document.getElementById('videoPlayModalLabel').innerHTML = videoList[number].name
    } else if (videoList[number].type == "internet") {
        document.getElementById("video-play-modal-body").innerHTML = `
        <video controls class="w-100 h-100">
            <source id="videoPlayModalvideo" src="${videoList[number].link}" />
        </video>`
        document.getElementById('videoPlayModalLabel').innerHTML = videoList[number].name

    } else if (videoList[number].type == "iframe") {
        document.getElementById('video-play-modal-body').innerHTML = videoList[number].code
        document.getElementById('videoPlayModalLabel').innerHTML = videoList[number].name
    } else {
        document.getElementById('video-play-modal-body').innerHTML = "<h1>OOPS! Undecodable video!</h1>"
        document.getElementById('videoPlayModalLabel').innerHTML = "ERROR!"
    }
}

function showImage(number) {
    imageShowModal.show()
    document.getElementById('imageShowModalLabel').innerText = imageList[number].file
    document.getElementById('imageShowModalImage').src = "./image/" + imageList[number].file
}

//#endregion

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/goreece/sw.js').then(() => {
        console.log("Service worker OK")
    })
}