const $=id=>document.getElementById(id);const screens=[...document.querySelectorAll('.screen')];let current=0,timers=[],urls=[];const themes={'Partner Spotlight':['#fff7f3','#d65c66'],'Adopt Me':['#fff5f5','#be1e2d'],'Fundraising':['#fff8e8','#c59635'],'Event':['#f8efff','#7b4b8f'],'Volunteer / Foster':['#eff8ff','#477a9c'],'Thank You':['#f4fff3','#5e8b58'],'Custom':['#fff7f3','#be1e2d']};
function show(n){current=n;screens.forEach((s,i)=>s.classList.toggle('active',i===n));$('status').textContent=`Screen ${n+1}`;}
function setTheme(){screens.forEach(s=>{s.style.setProperty('--c1',$('color1').value);s.style.setProperty('--c2',$('color2').value)})}
function fillWording(text){const cat=$('catName').value.trim()||'Our featured cat';return String(text||'').replaceAll('[CAT]',cat)}
function updateWording(){$('headingOut').textContent=fillWording($('heading').value);$('caption1Out').textContent=fillWording($('caption1').value);$('caption2Out').textContent=fillWording($('caption2').value);$('closingOut').textContent=fillWording($('closingHeading').value);$('caption3Out').textContent=fillWording($('caption3').value)}
$('category').onchange=()=>{const v=$('category').value;$('heading').value=v;const c=themes[v];$('color1').value=c[0];$('color2').value=c[1];setTheme();updateWording()};
['catName','heading','caption1','caption2','closingHeading','caption3'].forEach(id=>$(id).oninput=updateWording);['color1','color2'].forEach(id=>$(id).oninput=setTheme);
function objectUrl(file){const u=URL.createObjectURL(file);urls.push(u);return u}
$('catMedia').onchange=()=>{const f=$('catMedia').files[0];if(!f)return;const img=$('catImg'),vid=$('catVideo');if(f.type.startsWith('video/')){vid.src=objectUrl(f);vid.style.display='block';img.style.display='none'}else{img.src=objectUrl(f);img.style.display='block';vid.style.display='none'}applyCat()};
function applyCat(){const scale=+$('catSize').value/100,y=+$('catY').value;[$('catImg'),$('catVideo')].forEach(el=>el.style.transform=`translateY(${y}px) scale(${scale})`)}$('catSize').oninput=applyCat;$('catY').oninput=applyCat;
function prop(input,out,size){const f=$(input).files[0];if(f)$(out).src=objectUrl(f);$(out).style.width=`${105*(+$(size).value/100)}px`;$(out).style.height=`${105*(+$(size).value/100)}px`;$(out).style.display=$('useProps').checked&&$(out).src?'block':'none'}
['prop1','prop1Size'].forEach(id=>$(id).oninput=()=>prop('prop1','prop1Out','prop1Size'));['prop2','prop2Size'].forEach(id=>$(id).oninput=()=>prop('prop2','prop2Out','prop2Size'));$('useProps').onchange=()=>{prop('prop1','prop1Out','prop1Size');prop('prop2','prop2Out','prop2Size')};
$('featureMedia').onchange=()=>{const f=$('featureMedia').files[0],box=$('featureBox');if(!f)return;box.innerHTML='';if(f.type==='application/pdf'){const o=document.createElement('object');o.data=objectUrl(f);o.type='application/pdf';box.appendChild(o)}else{const i=document.createElement('img');i.src=objectUrl(f);box.appendChild(i)}};
$('musicFile').onchange=()=>{const f=$('musicFile').files[0];if(f){$('music').src=objectUrl(f);$('music').load()}};
document.querySelectorAll('[data-screen]').forEach(b=>b.onclick=()=>show(+b.dataset.screen));function stop(){timers.forEach(clearTimeout);timers=[];$('music').pause();$('catVideo').pause()}
function preview(){stop();updateWording();show(0);if($('music').src){$('music').currentTime=0;$('music').play().catch(()=>{})}if($('catVideo').src){$('catVideo').currentTime=0;$('catVideo').play().catch(()=>{})}timers.push(setTimeout(()=>show(1),8000),setTimeout(()=>show(2),16000),setTimeout(()=>{$('music').pause();$('catVideo').pause()},24000))}
$('preview').onclick=preview;$('stop').onclick=stop;

async function record(){
 if(!window.MediaRecorder||!navigator.mediaDevices?.getDisplayMedia){alert('Recording requires a current desktop version of Chrome or Edge.');return}
 stop();updateWording();
 const button=$('record'),previewButton=$('preview'),stopButton=$('stop'),reel=$('reel');
 button.disabled=true;previewButton.disabled=true;stopButton.disabled=true;button.textContent='Choose This Tab...';
 let displayStream=null,audioContext=null,recordingMusic=null,sourceNode=null;const originalStyle=reel.getAttribute('style'),originalOverflow=document.body.style.overflow;
 try{
  displayStream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:30},audio:false,preferCurrentTab:true});
  button.textContent='Recording...';
  reel.style.position='fixed';reel.style.left='50%';reel.style.top='10px';reel.style.margin='0';reel.style.transform='translateX(-50%) scale(0.82)';reel.style.transformOrigin='top center';reel.style.zIndex='99999';document.body.style.overflow='hidden';
  await new Promise(r=>setTimeout(r,300));
  const sourceVideo=document.createElement('video');sourceVideo.srcObject=displayStream;sourceVideo.muted=true;sourceVideo.playsInline=true;await sourceVideo.play();
  while(!sourceVideo.videoWidth||!sourceVideo.videoHeight)await new Promise(r=>setTimeout(r,50));
  const canvas=document.createElement('canvas');canvas.width=810;canvas.height=1440;const ctx=canvas.getContext('2d');const videoStream=canvas.captureStream(30);
  const rect=reel.getBoundingClientRect(),scaleX=sourceVideo.videoWidth/document.documentElement.clientWidth,scaleY=sourceVideo.videoHeight/document.documentElement.clientHeight;
  const sx=rect.left*scaleX,sy=rect.top*scaleY,sw=rect.width*scaleX,sh=rect.height*scaleY;
  let recording=true;function draw(){if(!recording)return;ctx.clearRect(0,0,810,1440);ctx.drawImage(sourceVideo,sx,sy,sw,sh,0,0,810,1440);requestAnimationFrame(draw)}
  let tracks=[...videoStream.getVideoTracks()];
  if($('music').src){audioContext=new AudioContext();await audioContext.resume();recordingMusic=new Audio($('music').src);recordingMusic.preload='auto';await new Promise((resolve,reject)=>{if(recordingMusic.readyState>=2)return resolve();recordingMusic.addEventListener('canplay',resolve,{once:true});recordingMusic.addEventListener('error',reject,{once:true});recordingMusic.load()});sourceNode=audioContext.createMediaElementSource(recordingMusic);const dest=audioContext.createMediaStreamDestination();sourceNode.connect(dest);tracks.push(...dest.stream.getAudioTracks())}
  const combined=new MediaStream(tracks);let mime='video/mp4;codecs="avc1.42E01E,mp4a.40.2"';if(!MediaRecorder.isTypeSupported(mime))mime='video/webm;codecs=vp9,opus';if(!MediaRecorder.isTypeSupported(mime))mime='video/webm';
  const rec=new MediaRecorder(combined,{mimeType:mime,videoBitsPerSecond:6000000}),chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
  rec.onstop=async()=>{recording=false;if(recordingMusic)recordingMusic.pause();if(audioContext)await audioContext.close();const blob=new Blob(chunks,{type:mime});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`TCC-Reel.${mime.startsWith('video/mp4')?'mp4':'webm'}`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);displayStream?.getTracks().forEach(t=>t.stop());if(originalStyle===null)reel.removeAttribute('style');else reel.setAttribute('style',originalStyle);document.body.style.overflow=originalOverflow;button.disabled=false;previewButton.disabled=false;stopButton.disabled=false;button.textContent='Record & Download'};
  rec.start();draw();if(recordingMusic){recordingMusic.currentTime=0;await recordingMusic.play()}preview();setTimeout(()=>{recording=false;if(rec.state!=='inactive')rec.stop()},24200);
 }catch(e){console.error(e);displayStream?.getTracks().forEach(t=>t.stop());if(recordingMusic)recordingMusic.pause();if(audioContext)try{await audioContext.close()}catch{}if(originalStyle===null)reel.removeAttribute('style');else reel.setAttribute('style',originalStyle);document.body.style.overflow=originalOverflow;button.disabled=false;previewButton.disabled=false;stopButton.disabled=false;button.textContent='Record & Download';if(e.name!=='NotAllowedError')alert('Recording failed. Please choose “This Tab” when Chrome asks what to share, then try again.');}
}
$('record').onclick=record;setTheme();updateWording();show(0);