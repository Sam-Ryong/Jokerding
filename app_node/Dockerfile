# Node.js 이미지를 사용합니다.
FROM node:14

# 작업 디렉토리를 설정합니다.
WORKDIR /

# 소스 코드를 복사합니다.
COPY . .

# npm 패키지를 설치합니다.
RUN npm install

# Node.js 서버를 실행합니다.
CMD ["node", "main_dev.js"]