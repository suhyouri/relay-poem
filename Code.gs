// Google Apps Script 코드
// 이 파일을 Google Apps Script 에디터에 복사하여 사용하세요

// 스프레드시트 ID (Google Sheets URL에서 복사)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'relay-poem(2026)';

// GET 요청 처리 (시 목록 가져오기)
function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getPoems') {
    return getPoems();
  }

  return ContentService.createTextOutput(
    JSON.stringify({ success: false, error: '잘못된 요청입니다.' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// POST 요청 처리 (새 시 추가)
function doPost(e) {
  try {
    const action = e.parameter.action;

    if (action === 'addPoem') {
      const name = e.parameter.name;
      const content = e.parameter.content;
      const lat = e.parameter.lat || '';
      const long = e.parameter.long || '';
      const location = e.parameter.location || '';

      if (!name || !content) {
        return createJsonResponse({
          success: false,
          error: '이름과 내용을 모두 입력해주세요.'
        });
      }

      return addPoem(name, content, lat, long, location);
    }

    return createJsonResponse({
      success: false,
      error: '잘못된 요청입니다.'
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

// 시 목록 가져오기
function getPoems() {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();

    // 첫 번째 행은 헤더이므로 제외
    const poems = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] || row[1] || row[2]) { // 빈 행이 아닌 경우만
        poems.push({
          date: row[0] || '',
          name: row[1] || '익명',
          content: row[2] || '',
          submissionDate: row[0] || '', // 날짜와 동일
          ip: row[3] || '',
          lat: row[4] || '',
          long: row[5] || '',
          location: row[6] || ''
        });
      }
    }

    // 날짜순으로 정렬 (오래된 것부터)
    poems.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    return createJsonResponse({
      success: true,
      poems: poems
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

// 새 시 추가
function addPoem(name, content, lat, long, location) {
  try {
    const sheet = getOrCreateSheet();

    // 현재 날짜와 시간
    const now = new Date();
    const date = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');

    // IP 주소는 Google Apps Script에서 직접 가져올 수 없음
    const ip = 'N/A';

    // 새 행 추가 (7개 열: Date, Name, Content, IPaddress, lat, long, location)
    sheet.appendRow([date, name, content, ip, lat, long, location]);

    return createJsonResponse({
      success: true,
      message: '시가 성공적으로 제출되었습니다.'
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

// 시트 가져오기 또는 생성
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  // 시트가 없으면 생성
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);

    // 헤더 추가 (7개 열)
    sheet.appendRow(['Date', 'Name', 'Content', 'IPaddress', 'lat', 'long', 'location']);

    // 헤더 스타일링
    const headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f3f3f3');
  }

  return sheet;
}

// JSON 응답 생성
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 테스트 함수 (선택 사항)
function testGetPoems() {
  const result = getPoems();
  Logger.log(result.getContent());
}

function testAddPoem() {
  const result = addPoem('테스트', '테스트 내용입니다.', '37.5665', '126.9780', '서울');
  Logger.log(result.getContent());
}
