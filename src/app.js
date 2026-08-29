const catName = document.getElementById("catName");
const catPhoto = document.getElementById("catPhoto");
const catSize = document.getElementById("catSize");
const catPosition = document.getElementById("catPosition");
const winnerName = document.getElementById("winnerName");
const prizeName = document.getElementById("prizeName");
const winnerDisplay = document.getElementById("winnerDisplay");
const prizeDisplay = document.getElementById("prizeDisplay");
const previewButton = document.getElementById("previewButton");
const downloadButton = document.getElementById("downloadButton");
const reveal = document.getElementById("reveal");
const suspenseText = document.getElementById("suspenseText");
const catWrap = document.querySelector(".cat-wrap");
const catImage = document.querySelector(".scene-cat");
const catAdjustmentLayer = document.getElementById("catAdjustmentLayer");
const magicWand = document.querySelector(".magic-wand");
const magicHat = document.querySelector(".magic-hat");
const magicRibbon = document.querySelector(".magic-ribbon");
const magicPoof = document.getElementById("magicPoof");
const reelTitle = document.getElementById("reelTitle");
const openingLogo = document.getElementById("openingLogo");
const drawingDate = document.getElementById("drawingDate");
const drawingDateDisplay = document.getElementById("drawingDateDisplay");
const mainTitle = document.getElementById("mainTitle");
const openingLine = document.getElementById("openingLine");
const catIntroduction = document.getElementById("catIntroduction");
const magicQuestion = document.getElementById("magicQuestion");
const winnerLabel = document.getElementById("winnerLabel");
const congratulationsText = document.getElementById("congratulationsText");
const reelMusic = document.getElementById("reelMusic");
const reel = document.querySelector(".reel");
const RECORDING_DURATION = 32000;

function updateCatAdjustment() {
  const scale = Number(catSize.value) / 100;
  const position = Number(catPosition.value);

  catAdjustmentLayer.style.transform =
    `translateX(-50%) translateY(${-position}px) scale(${scale})`;
}


catPhoto.addEventListener("change", () => {
  const file = catPhoto.files[0];

  if (file) {
   catImage.src = URL.createObjectURL(file);
catImage.alt = catName.value || "Featured cat";
catImage.style.opacity = "1";

magicHat.style.opacity = "1";
magicWand.style.opacity = "1";

updateCatAdjustment();
  }
});


catSize.addEventListener("input", () => {
  updateCatAdjustment();
  catImage.style.opacity = "1";
});


catPosition.addEventListener("input", () => {
  updateCatAdjustment();
  catImage.style.opacity = "1";
});


function formatWinnerName(fullName) {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length < 2) {
    return parts[0] || "Winner";
  }

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstName} ${lastInitial}.`;
}
function fillTemplate(text) {
  const cat = catName.value.trim() || "today's featured cat";
  const winner = formatWinnerName(winnerName.value || "Winner");

  return text
    .replaceAll("[CAT]", cat)
    .replaceAll("[WINNER]", winner);
}

function updateDrawing() {
  
  suspenseText.textContent =
  document.getElementById("openingLine")?.value ||
  "Did you know our cats are magical?!";

  reelMusic.pause();
  reelMusic.currentTime = 0;
  reelMusic.volume = 1;
  reelMusic.play();


  /* RESET OPENING */

  openingLogo.style.display = "block";
  openingLogo.style.opacity = "1";

  reelTitle.style.position = "";
  reelTitle.style.left = "";
  reelTitle.style.top = "";
  reelTitle.style.width = "";
  reelTitle.style.transform = "";
  reelTitle.classList.add("opening-title");


  /* OPENING LOGO + TITLE SWOOP */

  setTimeout(() => {

    openingLogo.animate(
      [
        {
          opacity: 1,
          transform: "translateX(-50%) scale(1)"
        },
        {
          opacity: 0,
          transform: "translateX(-50%) translateY(-15px) scale(0.85)"
        }
      ],
      {
        duration: 650,
        easing: "ease-in",
        fill: "forwards"
      }
    );

    const titleAnimation = reelTitle.animate(
      [
        {
          top: "50%",
          transform: "translate(-50%, -50%) scale(1.15)"
        },
        {
          top: "42%",
          transform: "translate(-50%, -50%) scale(1.18)",
          offset: 0.18
        },
        {
          top: "42px",
          transform: "translate(-50%, 0) scale(1)"
        }
      ],
      {
        duration: 1100,
        easing: "cubic-bezier(.22,.8,.3,1)",
        fill: "forwards"
      }
    );

    titleAnimation.onfinish = () => {

      reelTitle.classList.remove("opening-title");

      reelTitle.style.position = "absolute";
      reelTitle.style.left = "50%";
      reelTitle.style.top = "42px";
      reelTitle.style.width = "100%";
      reelTitle.style.transform = "translateX(-50%)";

      openingLogo.style.display = "none";

      titleAnimation.cancel();
    };

  }, 3000);


  /* UPDATE DRAWING DATE */

  drawingDateDisplay.textContent =
    drawingDate.value || "September 1, 2026";


  /* PREPARE WINNER */

  winnerDisplay.textContent =
    formatWinnerName(winnerName.value || "Winner");

  prizeDisplay.textContent =
    prizeName.value || "Prize";

  reveal.classList.remove("show");
  reveal.style.opacity = "0";
  reveal.style.visibility = "hidden";


  /* HIDE SETUP PREVIEW UNTIL TIMED ENTRANCES */

catImage.style.opacity = "0";
magicHat.style.transition = "none";
magicWand.style.transition = "none";
magicHat.style.opacity = "0";
magicWand.style.opacity = "0";


  /* OPENING SUSPENSE TEXT */

  setTimeout(() => {

    suspenseText.animate(
      [
        { opacity: 0 },
        { opacity: 1 }
      ],
      {
        duration: 1200,
        fill: "forwards",
        easing: "ease-out"
      }
    );

  }, 4200);


  /* HAT APPEARS */

  setTimeout(() => {
    magicHat.style.transition = "opacity 1.5s ease";
    magicHat.style.opacity = "1";
  }, 7500);


  /* CAT APPEARS + SECOND SUSPENSE LINE */

  setTimeout(() => {

    suspenseText.classList.remove("opening-text");

    suspenseText.textContent =
  fillTemplate(catIntroduction.value);

    catImage.animate(
      [
        {
          opacity: 0,
          transform: "translateX(-50%) scale(0.92)"
        },
        {
          opacity: 1,
          transform: "translateX(-50%) scale(1)"
        }
      ],
      {
        duration: 1500,
        easing: "ease-out",
        fill: "forwards"
      }
    );

  }, 9000);


  /* WAND APPEARS */

  setTimeout(() => {
    magicWand.style.transition = "opacity 1.5s ease";
    magicWand.style.opacity = "1";
  }, 11500);


  /* MAGIC QUESTION */

  setTimeout(() => {

    suspenseText.textContent =
  fillTemplate(magicQuestion.value);

  }, 15000);


  /* HAT DANCE */

  setTimeout(() => {

    magicHat.animate(
      [
        { transform: "translate(0, 0) rotate(0deg) scale(1)" },
        { transform: "translate(-8px, -18px) rotate(-10deg) scale(1.05)" },
        { transform: "translate(8px, -6px) rotate(9deg) scale(1.08)" },
        { transform: "translate(-6px, -24px) rotate(-7deg) scale(1.05)" },
        { transform: "translate(7px, -10px) rotate(8deg) scale(1.1)" },
        { transform: "translate(-4px, -20px) rotate(-5deg) scale(1.06)" },
        { transform: "translate(5px, -5px) rotate(5deg) scale(1.04)" },
        { transform: "translate(0, 0) rotate(0deg) scale(1)" }
      ],
      {
        duration: 2500,
        easing: "ease-in-out"
      }
    );

  }, 18000);


  /* HAT STAR BURSTS */

  setTimeout(() => {

    function createMagicBurst() {

      const symbols = [
        "✦", "★", "✨", "✧", "★", "✦",
        "✨", "✧", "★", "✦", "✨", "★"
      ];

      const directions = [
        [-100, -85],
        [-75, -125],
        [-40, -115],
        [5, -135],
        [45, -115],
        [90, -90],
        [115, -40],
        [105, 15],
        [75, 60],
        [30, 85],
        [-35, 80],
        [-90, 45]
      ];

      symbols.forEach((symbol, index) => {

        setTimeout(() => {

          const particle = document.createElement("span");

          particle.className =
            index % 3 === 0
              ? "magic-particle sparkle"
              : "magic-particle star";

          particle.textContent = symbol;
          catWrap.appendChild(particle);

          const [endX, endY] = directions[index];

          particle.style.left = "35px";
          particle.style.top = "40px";

          particle.animate(
            [
              {
                opacity: 0,
                transform: "translate(0, 0) scale(0.2) rotate(0deg)"
              },
              {
                opacity: 1,
                transform: "translate(0, 0) scale(1.6) rotate(100deg)",
                offset: 0.12
              },
              {
                opacity: 1,
                transform:
                  `translate(${endX * 0.65}px, ${endY * 0.65}px) scale(1.15) rotate(240deg)`,
                offset: 0.6
              },
              {
                opacity: 0,
                transform:
                  `translate(${endX}px, ${endY}px) scale(0.3) rotate(400deg)`
              }
            ],
            {
              duration: 1300,
              easing: "ease-out",
              fill: "forwards"
            }
          );

          setTimeout(() => {
            particle.remove();
          }, 1500);

        }, index * 35);
      });
    }

    createMagicBurst();

    setTimeout(createMagicBurst, 650);
    setTimeout(createMagicBurst, 1300);

  }, 18000);


  /* WAND SWOOSH */

  setTimeout(() => {

    magicWand.animate(
      [
        {
          transform: "translate(0, 0) rotate(10deg) scale(1)"
        },
        {
          transform: "translate(-5px, -5px) rotate(2deg) scale(1.03)",
          offset: 0.12
        },
        {
          transform: "translate(-18px, -22px) rotate(-22deg) scale(1.06)",
          offset: 0.30
        },
        {
          transform: "translate(-42px, -8px) rotate(-38deg) scale(1.08)",
          offset: 0.48
        },
        {
          transform: "translate(-22px, 18px) rotate(18deg) scale(1.08)",
          offset: 0.68
        },
        {
          transform: "translate(12px, 5px) rotate(34deg) scale(1.05)",
          offset: 0.84
        },
        {
          transform: "translate(0, 0) rotate(10deg) scale(1)"
        }
      ],
      {
        duration: 1900,
        easing: "cubic-bezier(.45,.05,.25,1)"
      }
    );

  }, 18150);


  /* GLOWING RIBBON */

  setTimeout(() => {

    magicRibbon.animate(
      [
        {
          opacity: 0,
          transform: "translate(80px, 55px) rotate(18deg) scale(0.18)"
        },
        {
          opacity: 1,
          transform: "translate(65px, 50px) rotate(8deg) scale(0.4)",
          offset: 0.22
        },
        {
          opacity: 1,
          transform: "translate(40px, 55px) rotate(-4deg) scale(0.65)",
          offset: 0.5
        },
        {
          opacity: 1,
          transform: "translate(10px, 70px) rotate(-14deg) scale(0.78)",
          offset: 0.72
        },
        {
          opacity: 0.8,
          transform: "translate(-20px, 90px) rotate(-20deg) scale(0.82)",
          offset: 0.88
        },
        {
          opacity: 0,
          transform: "translate(-45px, 115px) rotate(-24deg) scale(0.7)"
        }
      ],
      {
        duration: 1750,
        easing: "ease-out"
      }
    );

  }, 18200);


  /* WAND GLITTER */

  setTimeout(() => {

    const path = [
      [215, 70],
      [200, 78],
      [185, 86],
      [170, 95],
      [155, 104],
      [140, 113],
      [125, 122],
      [110, 131],
      [95, 140],
      [80, 149],
      [65, 158],
      [50, 167]
    ];

    path.forEach(([x, y], index) => {

      setTimeout(() => {

        for (let i = 0; i < 4; i++) {

          const sparkle = document.createElement("span");

          sparkle.textContent =
            Math.random() > 0.5 ? "✦" : "✧";

          sparkle.style.position = "absolute";
          sparkle.style.zIndex = "50";
          sparkle.style.pointerEvents = "none";

          sparkle.style.fontSize =
            `${10 + Math.random() * 6}px`;

          sparkle.style.color =
            Math.random() > 0.45
              ? "#ffd43b"
              : "#ff70c8";

          sparkle.style.textShadow =
            "0 0 4px white, 0 0 8px #ffd43b";

          sparkle.style.left =
            `${x + (Math.random() - 0.5) * 38}px`;

          sparkle.style.top =
            `${y + (Math.random() - 0.5) * 34}px`;

          catWrap.appendChild(sparkle);

          const flyX =
            -35 + Math.random() * 70;

          const flyY =
            -35 + Math.random() * 55;

          sparkle.animate(
            [
              {
                opacity: 0,
                transform: "translate(0, 0) scale(0.3)"
              },
              {
                opacity: 1,
                transform: "translate(0, -3px) scale(1.1)",
                offset: 0.15
              },
              {
                opacity: 1,
                transform:
                  `translate(${flyX * 0.5}px, ${flyY * 0.5}px) scale(0.9)`,
                offset: 0.55
              },
              {
                opacity: 0,
                transform:
                  `translate(${flyX}px, ${flyY}px) scale(0.2)`
              }
            ],
            {
              duration: 900,
              easing: "ease-out",
              fill: "forwards"
            }
          );

          setTimeout(() => {
            sparkle.remove();
          }, 1000);
        }

      }, index * 65);
    });

  }, 18200);


  /* POOF + WINNER */

  setTimeout(() => {

    magicPoof.animate(
      [
        {
          opacity: 0,
          transform: "translateX(-50%) scale(0.2)"
        },
        {
          opacity: 1,
          transform: "translateX(-50%) scale(0.75)",
          offset: 0.25
        },
        {
          opacity: 1,
          transform: "translateX(-50%) scale(1.25)",
          offset: 0.55
        },
        {
          opacity: 0.65,
          transform: "translateX(-50%) scale(1.6)",
          offset: 0.78
        },
        {
          opacity: 0,
          transform: "translateX(-50%) scale(2)"
        }
      ],
      {
        duration: 1400,
        easing: "ease-out"
      }
    );


    /* FIRST WINNER REVEAL */

    setTimeout(() => {

      reveal.style.visibility = "visible";
      reveal.style.opacity = "1";
      reveal.classList.add("show");

      reveal.animate(
        [
          {
            opacity: 0,
            transform: "scale(0.65) translateY(18px)"
          },
          {
            opacity: 1,
            transform: "scale(1.08) translateY(-5px)",
            offset: 0.65
          },
          {
            opacity: 1,
            transform: "scale(1) translateY(0)"
          }
        ],
        {
          duration: 900,
          easing: "ease-out",
          fill: "forwards"
        }
      );

    }, 450);


    /* FINAL CELEBRATION SCREEN */

    setTimeout(() => {

      /* FADE EVERYTHING EXCEPT WINNER CARD */

      const thingsToFade = [
        reelTitle,
        suspenseText,
        catWrap
      ];

      thingsToFade.forEach((element) => {

        if (!element) return;

        element.animate(
          [
            { opacity: 1 },
            { opacity: 0 }
          ],
          {
            duration: 700,
            easing: "ease-out",
            fill: "forwards"
          }
        );

      });


      /* CHANGE WINNER WORDING */

      const winnerParagraph = reveal.querySelector("p");

      if (winnerParagraph) {
        winnerParagraph.style.display = "none";
      }

      winnerDisplay.textContent =
        `Congratulations, ${formatWinnerName(winnerName.value || "Winner")}!`;


      /* MOVE WINNER CARD TO CENTER AND ENLARGE */

      reveal.style.position = "absolute";
      reveal.style.left = "50%";
      reveal.style.top = "50%";
      reveal.style.margin = "0";
      reveal.style.zIndex = "100";

      reveal.animate(
        [
          {
            transform: "translate(-50%, -35%) scale(1)",
            opacity: 1
          },
          {
            transform: "translate(-50%, -50%) scale(1.14)",
            opacity: 1
          }
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(.22,.8,.3,1)",
          fill: "forwards"
        }
      );


      /* MAKE CONGRATULATIONS MORE PROMINENT */

      winnerDisplay.animate(
        [
          {
            transform: "scale(0.9)",
            opacity: 0.7
          },
          {
            transform: "scale(1.05)",
            opacity: 1,
            offset: 0.7
          },
          {
            transform: "scale(1)",
            opacity: 1
          }
        ],
        {
          duration: 900,
          easing: "ease-out",
          fill: "forwards"
        }
      );

    }, 2900);

  }, 20500);


  /* FADE OUT MUSIC */

  setTimeout(() => {

    const fadeMusic = setInterval(() => {

      if (reelMusic.volume > 0.05) {
        reelMusic.volume -= 0.05;
      } else {
        clearInterval(fadeMusic);
        reelMusic.pause();
        reelMusic.currentTime = 0;
        reelMusic.volume = 1;
      }

    }, 75);

  }, 28000);

}


updateCatAdjustment();

previewButton.addEventListener("click", updateDrawing);

async function recordAndDownloadReel() {

  downloadButton.disabled = true;
  previewButton.disabled = true;
  downloadButton.textContent = "Choose This Tab...";

  let displayStream = null;
  let audioContext = null;
  let musicSource = null;
  let recordingMusic = null;

  try {

    /*
      CAPTURE THE ACTUAL BROWSER TAB
      We only need its VIDEO.
    */

    displayStream =
      await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: 30
        },
        audio: false,
        preferCurrentTab: true
      });


    downloadButton.textContent = "Recording...";


    /*
      TEMPORARILY PUT THE REEL IN A FIXED RECORDING
      POSITION THAT FITS COMPLETELY INSIDE THE TAB.

      This avoids the black/cut-off bottom we saw.
    */

    const originalReelStyle =
      reel.getAttribute("style");

    const originalBodyOverflow =
      document.body.style.overflow;

    reel.style.position = "fixed";
    reel.style.left = "50%";
    reel.style.top = "10px";
    reel.style.margin = "0";
    reel.style.transform = "translateX(-50%) scale(0.82)";
    reel.style.transformOrigin = "top center";
    reel.style.zIndex = "99999";

    document.body.style.overflow = "hidden";


    /*
      Give Chrome a moment to finish repositioning
      the reel before we measure it.
    */

    await new Promise(resolve => {
      setTimeout(resolve, 300);
    });


    /*
      PUT CAPTURED TAB INTO AN INVISIBLE VIDEO
    */

    const sourceVideo =
      document.createElement("video");

    sourceVideo.srcObject = displayStream;
    sourceVideo.muted = true;
    sourceVideo.playsInline = true;

    await sourceVideo.play();


    /*
      OUTPUT CANVAS:
      final vertical reel = 810 x 1440
    */

    const canvas =
      document.createElement("canvas");

    canvas.width = 810;
    canvas.height = 1440;

    const ctx =
      canvas.getContext("2d");

    const videoStream =
      canvas.captureStream(30);


    /*
      RECORD MUSIC DIRECTLY.

      This avoids relying on Chrome's shared-tab audio,
      which caused the volume change in the previous test.
    */

    audioContext =
      new AudioContext();

    await audioContext.resume();

    recordingMusic =
      new Audio("assets/magictree.mp3");

    recordingMusic.preload = "auto";
    recordingMusic.volume = 1;

    await new Promise((resolve, reject) => {

      if (recordingMusic.readyState >= 2) {
        resolve();
        return;
      }

      recordingMusic.addEventListener(
        "canplay",
        resolve,
        { once: true }
      );

      recordingMusic.addEventListener(
        "error",
        reject,
        { once: true }
      );

      recordingMusic.load();
    });


    musicSource =
      audioContext.createMediaElementSource(
        recordingMusic
      );

    const audioDestination =
      audioContext.createMediaStreamDestination();


    /*
      Send the recording copy ONLY to the recorder.

      The normal reelMusic element still plays through
      your speakers during the preview.
    */

    musicSource.connect(audioDestination);


    /*
      COMBINE CROPPED VIDEO + CLEAN MUSIC
    */

    const combinedStream =
      new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
      ]);


    /*
      BEST AVAILABLE WEBM FORMAT
    */

    let mimeType =
      "video/webm";

    if (
      MediaRecorder.isTypeSupported(
        "video/webm;codecs=vp9,opus"
      )
    ) {

      mimeType =
        "video/webm;codecs=vp9,opus";

    } else if (
      MediaRecorder.isTypeSupported(
        "video/webm;codecs=vp8,opus"
      )
    ) {

      mimeType =
        "video/webm;codecs=vp8,opus";
    }


    const recorder =
      new MediaRecorder(
        combinedStream,
        {
          mimeType: mimeType,
          videoBitsPerSecond: 6000000
        }
      );


    const chunks = [];


    recorder.addEventListener(
      "dataavailable",
      event => {

        if (event.data.size > 0) {
          chunks.push(event.data);
        }

      }
    );


    /*
      WHEN RECORDING FINISHES:
      download it and restore the editor.
    */

    recorder.addEventListener(
      "stop",
      async () => {

        recordingMusic.pause();
        recordingMusic.currentTime = 0;


        if (audioContext) {
          await audioContext.close();
        }


        const blob =
          new Blob(
            chunks,
            {
              type: mimeType
            }
          );


        const url =
          URL.createObjectURL(blob);


        const link =
          document.createElement("a");


        const safeDate =
          (drawingDate.value || "drawing")
            .replace(/[^a-z0-9]+/gi, "-")
            .replace(/^-|-$/g, "");


        link.href = url;

        link.download =
          `TCC-Calendar-Raffle-${safeDate}.webm`;


        document.body.appendChild(link);

        link.click();

        link.remove();


        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);


        /*
          STOP TAB CAPTURE
        */

        displayStream
          .getTracks()
          .forEach(track => {
            track.stop();
          });


        /*
          RESTORE NORMAL REEL POSITION
        */

        if (originalReelStyle === null) {
          reel.removeAttribute("style");
        } else {
          reel.setAttribute(
            "style",
            originalReelStyle
          );
        }

        document.body.style.overflow =
          originalBodyOverflow;


        downloadButton.disabled = false;
        previewButton.disabled = false;

        downloadButton.textContent =
          "Record & Download Reel";
      }
    );


    /*
      CALCULATE THE REEL'S EXACT LOCATION
      IN THE CAPTURED TAB.

      Because the reel is now fixed and completely visible,
      the whole rectangle should be available.
    */

    const rect =
      reel.getBoundingClientRect();


    /*
      Browser tab capture dimensions can differ from
      CSS pixel dimensions because of display scaling.

      Calculate those ratios once the captured video
      actually has dimensions.
    */

    while (
      sourceVideo.videoWidth === 0 ||
      sourceVideo.videoHeight === 0
    ) {

      await new Promise(resolve => {
        setTimeout(resolve, 50);
      });

    }


    const scaleX =
      sourceVideo.videoWidth /
      document.documentElement.clientWidth;

    const scaleY =
      sourceVideo.videoHeight /
      document.documentElement.clientHeight;


    const sourceX =
      rect.left * scaleX;

    const sourceY =
      rect.top * scaleY;

    const sourceWidth =
      rect.width * scaleX;

    const sourceHeight =
      rect.height * scaleY;


    /*
      COPY THE ACTUAL RENDERED REEL
      INTO OUR 810 x 1440 OUTPUT.
    */

    let recording = true;


    function drawCapturedReel() {

      if (!recording) {
        return;
      }


      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      ctx.drawImage(
        sourceVideo,

        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,

        0,
        0,
        canvas.width,
        canvas.height
      );


      requestAnimationFrame(
        drawCapturedReel
      );
    }


    /*
      START CAPTURE
    */

    recorder.start();

    drawCapturedReel();


    /*
      Start the separate, clean recording copy
      of the music.
    */

    recordingMusic.currentTime = 0;
    await recordingMusic.play();


    /*
      Start the REAL reel animation.

      updateDrawing() also starts reelMusic,
      which is what you hear from your speakers.
    */

    updateDrawing();


    /*
      STOP AFTER 32 SECONDS
    */

    setTimeout(() => {

      recording = false;


      /*
        Fade the recorded music during the final
        portion instead of allowing an abrupt cut.
      */

      const fadeInterval =
        setInterval(() => {

          if (
            recordingMusic &&
            recordingMusic.volume > 0.08
          ) {

            recordingMusic.volume =
              Math.max(
                0,
                recordingMusic.volume - 0.08
              );

          } else {

            clearInterval(fadeInterval);

            if (recordingMusic) {
              recordingMusic.volume = 0;
            }

          }

        }, 50);


      /*
        Give the fade a fraction of a second,
        then finish the video.
      */

      setTimeout(() => {

        if (
          recorder.state !== "inactive"
        ) {
          recorder.stop();
        }

      }, 650);


    }, 31350);


  } catch (error) {

    console.error(
      "Recording cancelled or failed:",
      error
    );


    if (recordingMusic) {
      recordingMusic.pause();
    }


    if (audioContext) {

      try {
        await audioContext.close();
      } catch (e) {
        // Nothing else needed.
      }

    }


    if (displayStream) {

      displayStream
        .getTracks()
        .forEach(track => {
          track.stop();
        });

    }


    downloadButton.disabled = false;
    previewButton.disabled = false;

    downloadButton.textContent =
      "Record & Download Reel";
  }
}


downloadButton.addEventListener(
  "click",
  recordAndDownloadReel
);