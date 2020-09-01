- [결과물](#결과물)
- [준비물](#준비물)
- [작동 원리](#작동-원리)
- [사용 방법](#사용-방법)
- [nginx 이슈](#nginx-이슈)

---

# 결과물

USB를 가지고 다니기 귀찮기도 하고 공용 컴퓨터에 클라우드 서비스 로그인 하는 것도 꺼림칙 해서 안전한(?) 파일 공유를 위해 나름 간단하게 S3을 구현해봤습니다.

IP만 알면 공용 컴퓨터에 로그인을 하는 위험을 감수하지 않고도 다운로드가 가능합니다.

파일명과 확장자를 모두 알아야 접근 가능하므로 관리자가 아닌 이상 훔쳐볼 수가 없습니다.

![](https://images.velog.io/images/jhj46456/post/5c600be2-d7ef-420a-9140-dbabed3eb83b/image.png)

이미지/동영상/텍스트 같은 경우는 미리보기가 나오고, 다른 확장자는 바로 다운로드 됩니다.

웹 서비스의 저장소로 사용하려면 fs를 사용하지 않고 multer만 사용합니다.

---

# 준비물

- Node.js LTS 이상
- ES6+ 이해
- 백엔드 이해
- Linux VM 인스턴스

---

# 작동 원리

- [express.static](https://expressjs.com/ko/starter/static-files.html)을 이용한 정적 파일 호스팅
- [multer](https://www.npmjs.com/package/multer)를 이용한 파일 업로드
- [fs](https://nodejs.org/api/fs.html)를 이용한 파일 시스템 관리
- 클라우드 서비스를 이용한 외부 접근

---

# 사용 방법

📌 **클라우드 서비스 별 방화벽 설정 방법은 다르므로 구글링하여 해결하셔야 합니다.**

📌 **프록시 서버 사용은 자유입니다.**

1. npm install
2. src/index.js의 33번 라인 id와 password를 설정해줍니다.
3. npm run build 📌 build 디렉터리를 찾을 수 없다는 에러가 나오면 `prebuild`를 지웠다가 복구합니다.
4. `build`와 `package.json`을 VM 인스턴스로 보냅니다.
5. SSH 접속 상태에서 `npm start`로 서버를 실행합니다.

---

# nginx 이슈

nginx로 프록시 서버를 구축하면 1MB 이상의 파일을 업로드할 때

    413 Request Entity Too Large

에러 코드가 나옵니다.

이는 **/etc/nginx/nginx.conf**의 **http 블럭**에 **client_max_body_size**를 추가하면 됩니다.

    http {
      client_max_body_size 500M; // 원하는 만큼
      ...
    }

저장 후

    sudo nginx -t
    sudo service nginx reload

입력해줍니다.
