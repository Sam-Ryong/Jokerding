const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
// const https = require("https");
// const options = {
//   key: fs.readFileSync("config/server.key"),
//   cert: fs.readFileSync("config/server.crt"),
// };

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


app.get('/',(req,res) => {
  res.sendFile(__dirname + "/index_dev.html");
})

app.get('/textfile', (req, res) => {
  fs.readFile('uploads/captured-image.txt', 'utf8', (err, data) => { //이 부분을 DB에서 가져오는 것으로 변경해야해요
      if (err) {
          res.status(500).send('error!');
      } else {
          res.send(data);
      }
  });
});

app.post('/upload', async (req, res) => {
  // 요청 본문에서 이미지 데이터 URL 추출
  const imageDataUrl = req.body.image;

  // Base64 디코딩하여 이미지 데이터 추출
  const base64Data = imageDataUrl.replace(/^data:image\/png;base64,/, '');
  const currentDate = new Date();

  try {
    const response = await axios.post('http://localhost:5000/predict', {
      base64Data: base64Data,
    });

    const msg_helmet = response.data.msg_helmet;

    console.log('Received msg_helmet from Python server:', msg_helmet);

    fs.writeFile(`uploads/captured-image.txt`,msg_helmet, async (err) => { // 이 부분을 DB에 저장하는 것으로 변경해야해요
      if (err) {
        console.error('Failed to save the image:', err);
        return res.status(500).send('Failed to save the image.');
      }

      else {
        res.send('Received msg_helmet from Python server: ' + msg_helmet);

      }
    
    })
  } catch (error) {
    console.error('Error while sending request to Python server:');
    res.status(500).send('Error while sending request to Python server');
  }
  });

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// https.createServer(options, app).listen(3000, () => {
//   console.log(`HTTPS server started on port 3000`);
// });