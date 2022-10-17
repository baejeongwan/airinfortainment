let aboutModal = new bootstrap.Modal(document.getElementById('aboutModal'))
let landingModal = new bootstrap.Modal(document.getElementById('landingModal'))
let videoModal = new bootstrap.Modal(document.getElementById('videoModal'))
let videoPlayModal = new bootstrap.Modal(document.getElementById('videoPlayModal'))
let flightInfoModal = new bootstrap.Modal(document.getElementById('flightInfoModal'))
let imageModal = new bootstrap.Modal(document.getElementById('imageModal'))
let imageShowModal = new bootstrap.Modal(document.getElementById('imageShowModal'))
let timerConfModal = new bootstrap.Modal(document.getElementById('timerConfModal'))
let timerViewModal = new bootstrap.Modal(document.getElementById('timerViewModal'))
let infoToast = new bootstrap.Toast(document.getElementById('airmanaging'))
let timerInterval;
let timesOver;
let videoList = []
let imageList = []

let timerTotalLength;
let timerLeftLength;


//#region 잠금화면 제어
function unlockUI() {
    document.getElementById('lockscreen').classList.add('unlocked')
    setTimeout(() => {
        document.getElementById('lockscreen').classList.add('d-none')
        document.getElementById('container').classList.remove('d-none')
    }, 500)
    infoToast.show()
    setTimeout(() => {
        infoToast.hide()
    }, 2000);
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

function timer() {
    timerConfModal.show()
    document.getElementById('timerName').value = "그리기 타이머"
    document.getElementById('timerMinute').value = 6;
    document.getElementById('timerSecond').value = 0;
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


//#region 타이머
function runTimer() {
    if (document.getElementById('timerConfForm').checkValidity()) {
        timerConfModal.hide()
        //Show timer
        timesOver = false;
        document.getElementById('timerViewTimerName').innerText = document.getElementById('timerName').value
        let minute = parseInt(document.getElementById('timerMinute').value)
        let second = parseInt(document.getElementById('timerSecond').value)
        timerTotalLength = minute * 60 + second
        timerLeftLength = timerTotalLength
        let minuteLeftCalc = Math.floor(timerLeftLength / 60)
        let secondLeftCalc = timerLeftLength % 60
        if (minuteLeftCalc < 10) {
            minuteLeftCalc = "0" + minuteLeftCalc.toString()
        }
    
        if (secondLeftCalc < 10) {
            secondLeftCalc = "0" + secondLeftCalc.toString()
        }
    
        let finalTimerString = minuteLeftCalc + ":" + secondLeftCalc
        document.getElementById('timerLeftView').innerText = finalTimerString
        timerViewModal.show()
        timerInterval = setInterval(timerUpdate, 1000)
        document.getElementById('timerConfForm').reset()
    }
}   


function timerUpdate() {
    if (timerLeftLength == 0) {
        //RING!
        clearInterval(timerInterval)
        timesOver = true
        document.getElementById('timerEndAudio').play()
        document.getElementById('timerLeftView').innerHTML = "시간이<br>끝났습니다"
        document.getElementById('timerLeftView').style.color = "#FF0000"
        return
    }
    timerLeftLength = timerLeftLength - 1;
    let minuteLeftCalc = Math.floor(timerLeftLength / 60)
    let secondLeftCalc = timerLeftLength % 60
    if (minuteLeftCalc < 10) {
        minuteLeftCalc = "0" + minuteLeftCalc.toString()
    }

    if (secondLeftCalc < 10) {
        secondLeftCalc = "0" + secondLeftCalc.toString()
    }

    let finalTimerString = minuteLeftCalc + ":" + secondLeftCalc
    document.getElementById('timerLeftView').innerText = finalTimerString
}

function timerPause() {
    if (timesOver) {
        return
    }
    clearInterval(timerInterval)
    document.getElementById('whileTimerRunningBtn').classList.add('d-none')
    document.getElementById('whileTimerPausedBtn').classList.remove('d-none')
}

function timerResume() {
    if (timesOver) {
        return
    }
    timerInterval = setInterval(timerUpdate, 1000)
    document.getElementById('whileTimerRunningBtn').classList.remove('d-none')
    document.getElementById('whileTimerPausedBtn').classList.add('d-none')
}

function timerReset() {
    clearInterval(timerInterval)
    //Stop ring
    if (timesOver) {
        document.getElementById('timerEndAudio').pause()
        document.getElementById('timerLeftView').style.color = "#000000"
    }
    //reset time
    timerLeftLength = timerTotalLength
    let minuteLeftCalc = Math.floor(timerLeftLength / 60)
    let secondLeftCalc = timerLeftLength % 60
    if (minuteLeftCalc < 10) {
        minuteLeftCalc = "0" + minuteLeftCalc.toString()
    }

    if (secondLeftCalc < 10) {
        secondLeftCalc = "0" + secondLeftCalc.toString()
    }

    let finalTimerString = minuteLeftCalc + ":" + secondLeftCalc
    document.getElementById('timerLeftView').innerText = finalTimerString
    //reset button
    if (document.getElementById('whileTimerRunningBtn').classList.contains('d-none')) {
        document.getElementById('whileTimerRunningBtn').classList.remove('d-none')
    }
    if (!document.getElementById('whileTimerPausedBtn').classList.contains('d-none')) {
        document.getElementById('whileTimerPausedBtn').classList.add('d-none')
    }
    timerInterval = setInterval(timerUpdate, 1000)
}

function quitTimer() {
    clearInterval(timerInterval)
    //Stop ring
    if (timesOver) {
        document.getElementById('timerEndAudio').pause()
        document.getElementById('timerLeftView').style.color = "#000000"
    }
    //reset button
    if (document.getElementById('whileTimerRunningBtn').classList.contains('d-none')) {
        document.getElementById('whileTimerRunningBtn').classList.remove('d-none')
    }
    if (!document.getElementById('whileTimerPausedBtn').classList.contains('d-none')) {
        document.getElementById('whileTimerPausedBtn').classList.add('d-none')
    }
}

//#endregion