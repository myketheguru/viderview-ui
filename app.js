const box = document.querySelectorAll('.box');
const form = document.querySelector('form');
const checkAsJoe = document.querySelector('#check-as-joe');
const modal = document.querySelector('.modal')

const handleVerify = (evt) => {
    evt.preventDefault();
    if (evt.target === checkAsJoe) 
        form.querySelector('input').value = "Boss, Welcome"
    let button = form.querySelector('button');
    button.innerHTML = "Verifying Email...";
    setTimeout(() => {
        button.innerHTML = "Email Verified";
        button.style.backgroundColor = "#77B98B";
        setTimeout(() => {
            box[0].classList.remove('in');
            box[1].classList.remove('in-right');
            box[1].classList.add('in');
        }, 2000);
    }, 3400);
}

form.addEventListener('submit', handleVerify)
checkAsJoe.addEventListener('change', handleVerify)

///////////////////////////////////////////
const display = document.querySelector('#arena');
const msgBox = document.querySelector('.msg-box');

/* (!) NEWLY ADDED */
// Store some colors
const BLUE = 'dodgerblue';
const GREEN = 'mediumseagreen';
const GRAYWHITE = '#ddd';
/* End NEWLY ADDED BLOCK */




// -- TIMER BEGINS BELOW --
// Create start time in minutes...
// You can add as much minutes as you want
let startingMins = 2;

// Derive time in seconds
let time = startingMins * 60;

// Create time interval
/* Here, we are assigning setInterval() to a variable so that we can stop the countdown when time elapses to avoid negative values
*/
let timeInterval;

let constraintObj = {
    audio: false,
    video: {
        facingMode: 'user',
        // width: {min: 640, ideal: 1200, max: 1920}
    }
}

let startBtn = document.querySelector('#start');
startBtn.onclick = () => {
    modal.classList.remove('hide')
    modal.classList.add('show')
    
    let stream = navigator.mediaDevices.getUserMedia(constraintObj)
    .then((mediaStreamObj) => {
        if ('srcObject' in inputVideo)
        inputVideo.srcObject = mediaStreamObj
        else
        inputVideo.src = window.URL.createObjectURL(mediaStreamObj)
        
        // Create media Recorder
        let mediaRecorder = new MediaRecorder(mediaStreamObj)
        // Create chunk array
        let chunks = []
        // Start the timer
        timeInterval = setInterval(updateTimer, 120000);
        // Stop the timer after 2 mins
        setTimeout(() => {
            // mediaStreamObj.stop()
            stopStreamedVideo(inputVideo)
            mediaRecorder.stop()
            clearInterval(timeInterval)
            return;
        }, 10000);
        // Playback user video and start recording
        inputVideo.onloadedmetadata = (evt) => {
            inputVideo.play()
            mediaRecorder.start()
        }

        // Buffer the video data on to an array
    mediaRecorder.ondataavailable = (evt) => {
        chunks.push(evt.data)
    }
    // Create video file when recording stops
    mediaRecorder.onstop = (evt) => {
        let blob = new Blob(chunks, { 'type': 'video/mp4' })
        chunks = []
        let videoUrl = window.URL.createObjectURL(blob)
        console.log(videoUrl)
    }
})
.catch(err => {
    console.log(err.name, err.message)
})
}

/*
  Create a function that will show the time output to HTML. It recieves a target HTML element, as well as an array of time metric objects as parameter.
*/

function renderTimer (target, timeSnap) {
    // Loop through the time metrics using .map() method
    const output = timeSnap.map(metric => {
      // Get state of the metric
      let state = metric.val <= 0 ? 'done' : 'running';
      
      // Store pulse animation class depending on if state === 'running'
      let pulse = state === 'running' ? 'pulsate' : '';
      
      // Variable to prefix zero to the metrics
      let prefixZero = metric.val < 10 ? '0' : '';
      
      // Create singular or plural labels
      let label = (metric.val === 1) ? metric.label : (metric.label + 's');
      
      // Finally, return a div for each metric
      return `
        <div class=${state}>
          <h1 class='time-val ${pulse}'>
            ${prefixZero + metric.val}
          </h1>
          <span>${label}</span>
        </div>
      `;
    }).join('');
    
    // Send the output to HTML
    target.innerHTML = output;
}

function updateTimer() {
    /* First, collect time metrics */
    
    // Derive days metric
    const days = Math.floor(time / 86400);
    // Derive hours metric
    const hours = Math.floor(time / 60 / 60);
    // Derive minutes metric
    const minutes = Math.floor(time / 60);
    // Derive seconds metric
    const seconds = time % 60;
    
    // Check if time has elapsed, so we can stop the countdown
    if (time <= 0) {
      // If so, stop the countdown
      clearInterval(timeInterval, 1000);
      // Show a success message
      msgBox.innerHTML = 'Recording complete';
      // Give the message a background color
      msgBox.style.backgroundColor = 'mediumseagreen';
      // Animate the message
      msgBox.classList.add('pulsate');
      // Remove the animation class after 1 second
      setTimeout(function () {
        msgBox.classList.remove('pulsate');
      }, 1000);
    } else {
      /* If not, we still have time */
     
      // Just show a progress message
      msgBox.innerHTML = 'Recording in progress...';
      // ...and give the message a background color as well
      msgBox.style.backgroundColor = 'dodgerblue';
    }
    
    /* Here we create an array of time metric objects using the values derived above */
    const snapshot = [
      {val: days, label: 'day'}, 
      {val: hours, label: 'hour'},
      {val: minutes, label: 'minute'}, 
      {val: seconds, label: 'second'},
    ];
    
    /* ...then we feed these values to the renderTimer function we created above. We also give it a target HTML element to use for it's purposes */
    renderTimer(display, snapshot);
    
    // Finally, we update time by decrement
    time--;
  }

  function stopStreamedVideo(videoElem) {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
  
    tracks.forEach(function(track) {
      track.stop();
    });
  
    videoElem.srcObject = null;
  }