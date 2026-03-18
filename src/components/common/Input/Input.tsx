/**
 * @file Input.tsx
 * @description 프로젝트 전반에서 사용되는 공통 텍스트 입력 폼 컴포넌트입니다.
 * 텍스트 입력, 라벨 표시, 에러 상태(빨간 테두리 및 메시지) 처리를 지원합니다.
 * @author []
 * * @param {string} [label] - Input 상단에 표시될 텍스트 라벨 (생략 시 라벨 없이 렌더링)
 * @param {boolean} [isError] - 에러 상태 여부 (true일 경우 인풋 테두리가 빨간색으로 변경됨)
 * @param {string} [errorMessage] - 유효성 검사 실패 시 하단에 표시될 빨간색 에러 메시지 텍스트
 * * @returns {JSX.Element} 커스텀 스타일 및 상태 처리가 래핑된 input 요소
 */
