const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


app.get('/',(req,res) => {
  res.sendFile(__dirname + "/index.html");
})

app.get('/textfile', (req, res) => {
  fs.readFile('uploads/captured-image.txt', 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('error!');
      } else {
          res.send(data);
      }
  });
});

app.post('/upload', (req, res) => {
  // 요청 본문에서 이미지 데이터 URL 추출
  const imageDataUrl = req.body.image;
 

  // Base64 디코딩하여 이미지 데이터 추출
  const base64Data = imageDataUrl.replace(/^data:image\/png;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().replace(/:/g, '-').replace(/T/, '-').replace(/\.\d+Z$/, '');
  // const fileName = `uploads/captured-image-${formattedDate}.jpg`;
  const fileName = `uploads/captured-image.jpg`;

  // 이미지를 파일로 저장
  fs.writeFile(fileName, imageBuffer, async (err) => {
    if (err) {
      console.error('Failed to save the image:', err);
      return res.status(500).send('Failed to save the image.');
    }

    console.log('Image saved successfully.');
    const image_path = fileName; // 파일 경로를 수정하세요.

  try {
    const response = await axios.post('http://localhost:5000/predict', {
      image_path: image_path,
    });

    const msg_helmet = response.data.msg_helmet;

    console.log('Received msg_helmet from Python server:', msg_helmet);

    fs.writeFile(`uploads/captured-image.txt`,msg_helmet, async (err) => {
      if (err) {
        console.error('Failed to save the image:', err);
        return res.status(500).send('Failed to save the image.');
      }

      else {
        res.send('Received msg_helmet from Python server: ' + msg_helmet);

      }
    
    })
  } catch (error) {
    console.error('Error while sending request to Python server:', error);
    res.status(500).send('Error while sending request to Python server');
  }
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
