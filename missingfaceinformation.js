const image_upload = document.getElementById('image_upload')

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    
  ]).then(start)

  async function start(){
    const container = document.createElement('div')
    container.style.position = 'relative'
    document.body.append(container)
    window.labeledFaceDescriptors = await loadLabeledImages()
  window.faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    let image
  let canvas
    document.body.append('Loaded')
    image_upload.addEventListener('change', async () => {
      if (image) image.remove()
    if (canvas) canvas.remove()
        image = await faceapi.bufferToImage(image_upload.files[0])
       container.append(image)
         canvas = faceapi.createCanvasFromMedia(image)
        container.append(canvas)
        const displaySize = { width: image.width, height: image.height }
        faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(image)
       .withFaceLandmarks().withFaceDescriptors()
       const resizedDetections = faceapi.resizeResults(detections,displaySize)
       const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
       resizedDetections.forEach(detection => {
           const box = detection.detection.box
           const drawBox = new faceapi.draw.DrawBox(box, { label: results,i}) 
          drawBox.draw(canvas)

       })
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