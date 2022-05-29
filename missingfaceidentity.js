const imageUpload = document.getElementById('imageUpload')
const msgfacesdiv=document.getElementById('missingfaces')
  const found=[]
  const miss=[]
function func(miss){
  document.getElementById("List").innerHTML = "";
  for(i=0;i<miss.length;i++){
    var node = document.createElement("LI");
    var textnode = document.createTextNode(miss[i]);
    node.appendChild(textnode);
    node.setAttribute("name",miss[i])
    document.getElementById("List").appendChild(node);
  }
}
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)
load=[]
async function start() {
  const display = document.createElement('div')
  display.style.position = 'relative'
  document.body.append(display)
  window.labeledFaceDescriptors = await loadLabeledImages()
  window.faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
 load.push('Loaded')
 if(load.length>0){
  document.getElementById('loadingprocess').style.zIndex="-999";
  document.getElementById('loadingprocess').style.opacity="0";
  document.getElementById('covering').style.opacity="0";
  document.getElementById('covering').style.zindex="-888";
  document.getElementById('covering').style.position="relative";
}
  
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    canvas = faceapi.createCanvasFromMedia(image)
    const displaySize = { width:image.width, height:image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    found.length=0
    results.forEach((result, i) => {
	  found.push(result._label)
    })
  
	for (i = 0; i <5; i++) 
	{
    c=0;
		for(j=0;j<5;j++)
		{if (found[j]==labels[i])
			{
        c=1;
			break;
    }
		}
	if(c==0)
		miss.push(labels[i])
	}
func(miss)
miss.length=0
find(miss);
})
}

function loadLabeledImages() {
  window.labels = ['Helly','Max','elon','Ruhi']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
       
       const img = await faceapi.fetchImage(`/labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

function find(miss)
{Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startfind)
async function startfind() {
  const display = document.createElement('div')
  display.style.position = 'relative'
  document.body.append(display)
  window.faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let fimage
  let canvas

  const fid=document.getElementById('fid')
  fid.addEventListener('change', async () => {
  if (fimage) fimage.remove()
  if (canvas) canvas.remove()
	  fimage = await faceapi.bufferToImage(fid.files[0])
    canvas = faceapi.createCanvasFromMedia(fimage)
    const displaySize = { width:fimage.width, height:fimage.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(fimage).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
if (result._label==miss[0])
{console.log("found");
}
else 
{console.log("Not found");
}	
})
})
}
}