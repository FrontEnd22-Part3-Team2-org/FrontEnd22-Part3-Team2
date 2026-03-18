// 이 파일의 모든 내용은 주석 사용 예시를 위함입니다! 편히 수정하셔요

/**
 * @file Input.tsx
 * @description 프로젝트 전반에서 사용되는 공통 텍스트 입력 폼 컴포넌트입니다.
 * 텍스트 입력, 라벨 표시, 에러 상태(빨간 테두리 및 메시지) 처리를 지원합니다.
 * @author 
 * * @example
 * <Input label="이메일" isError={true} errorMessage="이메일 형식으로 작성해 주세요." />
 */


import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Input 상단에 표시될 텍스트 라벨 (생략 시 라벨 없이 렌더링) */
  label?: string;

  /** 에러 상태 여부 (true일 경우 인풋 테두리가 빨간색으로 변경됨) */
  isError?: boolean;

  /** 유효성 검사 실패 시 하단에 표시될 빨간색 에러 메시지 텍스트 */
  errorMessage?: string;
}

export default function Input({
  label,
  isError,
  errorMessage,
  className,
  ...props
}: InputProps) {
  // ... Input 구현 로직
}
