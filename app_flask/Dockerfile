# Python 이미지를 사용합니다.
FROM python

# 작업 디렉토리를 설정합니다.
WORKDIR /

# 필요한 파일을 복사합니다.
COPY requirements.txt ./

# Python 패키지를 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드를 복사합니다.
COPY . .

# Flask 서버를 실행합니다.
CMD ["python", "face_server_dev.py"]