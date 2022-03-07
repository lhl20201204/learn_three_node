const video = document.getElementById('video');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const download = document.getElementById('download');
const videoSave = document.getElementById('videoSave')

const displayMediaOptions = {
    video: {
        facingMode: 'user'
    },
    audio: false
}

start.addEventListener('click',function(evt){
    startCapture();
},false)

stop.addEventListener('click',function(evt){
    stopCapture();
},false)

download.addEventListener('click',function(evt){
    mydownload();
},false)


let captureStream;
let recorder;
const chunks = []
function startCapture() {
    log = "";
    try {
       navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(captureStream => {
          window.URL.revokeObjectURL(video.src);
    video.srcObject = captureStream;
    recorder = new MediaRecorder(captureStream, {
        mimeType: 'video/webm;codecs=h264'
    });

    recorder.start();  
       });
    } catch (err) {
        console.log('Error: ' + err);
        return alert('capture is error or cancel!');
    }
    // 删除原来的blob
   

}

function stopCapture() {
    let tracks = video.srcObject.getTracks();
    tracks.forEach(track => {
        track.stop();
    });
    recorder.stop();
    recorder.ondataavailable = (event)=>{
        let videoUrl = URL.createObjectURL(new Blob([event.data],{type:'video/mp4;'} ));
        video.srcObject = null;
        video.src = videoUrl;
        chunks.push(event.data)
  }

    recorder.onstop = (event)=>{
       videoSave.src = URL.createObjectURL(new Blob(chunks,{type:'video/mp4;'} ))
    }

}

function mydownload(){
    const name = new Date().toISOString().slice(0,19).replace('T',' ').replace(' ','_').replace(/:/g,'-');
    const a = document.createElement('a');
    a.href = video.src;
    a.download = `${name}.mp4`;
    document.body.appendChild(a);
    a.click();

}
