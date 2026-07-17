/* ==========================================
   MICROPHONE BLOW DETECTION
========================================== */


let audioContext;

let analyser;

let microphone;

let dataArray;

let micStream;

let isBlown = false;

let blowCounter = 0;



/* ==========================================
   START MICROPHONE
========================================== */


function startMicrophone() {


    // reset every time cake opens

    isBlown = false;

    blowCounter = 0;



    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        console.log(
            "Microphone not supported"
        );

        return;

    }



    navigator.mediaDevices.getUserMedia({

        audio: {

            echoCancellation: true,

            noiseSuppression: true,

            autoGainControl: true

        }

    })

        .then(stream => {


            micStream = stream;



            audioContext =
                new AudioContext();



            if (audioContext.state === "suspended") {

                audioContext.resume();

            }



            microphone =
                audioContext.createMediaStreamSource(
                    stream
                );



            analyser =
                audioContext.createAnalyser();



            analyser.fftSize = 1024;



            microphone.connect(
                analyser
            );



            dataArray =
                new Uint8Array(
                    analyser.fftSize
                );



            detectBlow();



        })

        .catch(error => {


            console.log(
                "Microphone permission denied:",
                error
            );


        });


}






/* ==========================================
   DETECT BLOW
========================================== */


function detectBlow() {


    if (!analyser) {

        return;

    }



    analyser.getByteTimeDomainData(
        dataArray
    );



    let sum = 0;



    for (
        let i = 0;
        i < dataArray.length;
        i++
    ) {

        let value =
            dataArray[i] - 128;


        sum += value * value;

    }




    let volume =
        Math.sqrt(
            sum / dataArray.length
        );




    /*
        Typical values:

        Silence:
        2-5

        Talking:
        8-18

        Blow:
        20-40+

    */



    if (volume > 22) {


        blowCounter++;


    }
    else {


        blowCounter = 0;


    }





    /*
        Require continuous blow
        for better accuracy

        15 frames ≈ half second

    */


    if (
        blowCounter > 15 &&
        !isBlown
    ) {


        isBlown = true;


        stopMicrophone();


        blowCandle();


        return;


    }



    requestAnimationFrame(
        detectBlow
    );

}






/* ==========================================
   STOP MICROPHONE
========================================== */


function stopMicrophone() {



    if (micStream) {


        micStream
            .getTracks()
            .forEach(track => {

                track.stop();

            });


    }



    if (audioContext) {


        audioContext.close();


    }



}