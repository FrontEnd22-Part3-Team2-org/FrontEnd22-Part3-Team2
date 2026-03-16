/**
 * @file 대시보드 도메인 타입 정의
 * @description 대시보드(Dashboard), 칼럼(Column), 할 일 카드(Card)의 데이터 구조(interface)를 모아둔 파일입니다.
 * @note 백엔드 API 명세서의 Response 응답값과 정확히 일치하도록 타입을 정의해야 합니다.
 */

// TS가 .css를 모듈로 인식하도록
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
