# Node.js 이미지를 사용합니다.
FROM node:14

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# Node.js 서버에 필요한 파일을 복사합니다.
COPY node-app/package*.json ./
RUN npm install
COPY node-app/ ./

# Flask 서버에 필요한 파일을 복사합니다.
COPY flask-app/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY flask-app/ ./

# 동시에 Node.js 서버와 Flask 서버를 실행합니다.
CMD ["sh", "-c", "npm start & python app.py"]