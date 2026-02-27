# 릴레이-시작 | Relay-Poem

릴레이 시 작성 웹 애플리케이션입니다. GitHub Pages에 호스팅되며, Google Apps Script를 통해 Google Spreadsheet에 데이터를 저장합니다.

## 기능

- 과거에 작성된 시들을 날짜순으로 확인
- 새로운 시 작성 및 제출
- Google Spreadsheet와 실시간 연동
- 작성자 이름, 날짜 자동 기록
- 자동 새로고침 (30초마다)
- GitHub Pages 무료 호스팅

## 설치 방법

### 1. Google Spreadsheet 생성

1. [Google Sheets](https://sheets.google.com/)에서 새 스프레드시트 생성
2. 스프레드시트 이름: "relay-poem-2026" (또는 원하는 이름)
3. 스프레드시트 URL에서 ID 복사
   - URL 형식: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
   - `YOUR_SPREADSHEET_ID` 부분이 필요합니다

### 2. Google Apps Script 설정

1. 스프레드시트에서 **확장 프로그램** > **Apps Script** 클릭
2. 기본 코드를 모두 삭제하고 `Code.gs` 파일의 내용을 복사하여 붙여넣기
3. 코드 상단의 `SPREADSHEET_ID`를 본인의 스프레드시트 ID로 변경:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```

4. **배포** > **새 배포** 클릭
5. 배포 유형: **웹 앱** 선택
6. 설정:
   - 설명: "Relay Poem Web App" (선택 사항)
   - 실행 계정: **나**
   - 액세스 권한: **모든 사용자** 선택
7. **배포** 클릭
8. 권한 승인 (처음 한 번만):
   - "권한 검토" 클릭
   - Google 계정 선택
   - "고급" > "안전하지 않은 페이지로 이동" 클릭
   - "허용" 클릭
9. **웹 앱 URL** 복사 (나중에 사용)
   - 형식: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

### 3. 프론트엔드 설정

1. 이 저장소를 Fork 또는 Clone
2. `script.js` 파일을 열고 `CONFIG.webAppUrl`에 Google Apps Script Web App URL 입력:
   ```javascript
   const CONFIG = {
       webAppUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
   };
   ```

### 4. GitHub Pages 배포

#### 방법 1: GitHub 웹사이트에서 설정

1. GitHub에 저장소 생성 (또는 Fork한 저장소 사용)
2. 코드를 GitHub에 Push
3. 저장소 설정(Settings) > Pages로 이동
4. Source: **Deploy from a branch** 선택
5. Branch: **main** (또는 master) 선택, 폴더: **/ (root)** 선택
6. **Save** 클릭
7. 몇 분 후 `https://your-username.github.io/relay-poem/` 에서 접속 가능

#### 방법 2: 로컬에서 Git 사용

```bash
# 저장소 초기화 (아직 안 했다면)
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Relay Poem application"

# GitHub 저장소와 연결 (your-username을 본인 계정명으로 변경)
git remote add origin https://github.com/your-username/relay-poem.git

# Push
git branch -M main
git push -u origin main
```

그 다음 위의 "방법 1"의 3-7번 단계를 따라하세요.

## 파일 구조

```
relay-poem/
├── index.html      # 메인 HTML 파일
├── style.css       # 스타일시트
├── script.js       # 프론트엔드 JavaScript
├── Code.gs         # Google Apps Script 코드 (별도로 배포)
├── .gitignore      # Git 무시 파일
└── README.md       # 이 파일
```

## 사용 방법

1. GitHub Pages URL로 접속 (예: `https://your-username.github.io/relay-poem/`)
2. "내용보기" 섹션에서 기존 시들을 확인
3. "이름" 필드에 이름 입력
4. 텍스트 영역에 시 내용 입력
5. "제출버튼" 클릭하여 제출
6. 제출된 시는 자동으로 Google Spreadsheet에 저장되고 화면에 표시됩니다

## 키보드 단축키

- **Enter** (이름 필드): 내용 필드로 포커스 이동
- **Ctrl/Cmd + Enter** (내용 필드): 시 제출

## Google Spreadsheet 데이터 구조

스프레드시트는 다음과 같은 열로 구성됩니다:

| 날짜 | 이름 | 내용 | 제출일 | IP주소 |
|------|------|------|--------|--------|
| 2026-02-27 | 홍길동 | 시 내용... | 2026-02-27 17:30:00 | N/A |

## 기술 스택

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Hosting**: GitHub Pages (무료)

## 문제 해결

### "Google Apps Script 연결 오류" 메시지

1. `script.js`의 `CONFIG.webAppUrl`이 올바르게 설정되었는지 확인
2. Google Apps Script가 "모든 사용자" 액세스로 배포되었는지 확인
3. 브라우저 콘솔(F12)에서 자세한 오류 확인

### 시가 제출되지 않음

1. Google Apps Script 코드의 `SPREADSHEET_ID`가 올바른지 확인
2. 스프레드시트 권한이 올바른지 확인
3. Apps Script 실행 로그 확인:
   - Apps Script 에디터 > **실행** > **실행 로그**

### Google Apps Script 배포 후 변경사항 반영

1. Apps Script 코드를 수정한 후
2. **배포** > **배포 관리** 클릭
3. 기존 배포의 **편집** 아이콘 클릭
4. **버전** > **새 버전** 선택
5. **배포** 클릭

## 보안 참고사항

- Google Apps Script Web App URL은 공개되어도 안전합니다
- 스프레드시트 자체는 본인만 액세스 가능합니다
- 악의적인 사용을 방지하기 위해 추가 검증 로직을 구현할 수 있습니다

## 커스터마이징

### 스프레드시트 이름 변경

`Code.gs` 파일의 `SHEET_NAME` 상수를 수정:

```javascript
const SHEET_NAME = '원하는-시트-이름';
```

### 자동 새로고침 주기 변경

`script.js` 파일 하단의 값을 수정 (밀리초 단위):

```javascript
// 30초마다 새로고침
setInterval(loadPoems, 30000);

// 60초(1분)마다 새로고침으로 변경하려면:
setInterval(loadPoems, 60000);
```

## 라이선스

MIT License

## 기여

이슈나 Pull Request는 언제나 환영합니다!
