/**
 * @file 날짜 포맷팅 유틸 함수
 * @description 서버에서 내려오는 ISO 날짜 문자열을 UI에 맞는 형식(예: YYYY.MM.DD)으로 변환합니다.
 */

/** YYYY.MM.DD 형식 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

/** YYYY.MM.DD HH:mm 형식 */
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};
