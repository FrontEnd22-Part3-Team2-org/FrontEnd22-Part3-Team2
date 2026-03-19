/**
 * @file Input.tsx
 * @description 텍스트 입력, 라벨, 에러 상태를 지원하는 공통 폼 컴포넌트입니다.
 * @author 수경
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input 상단에 표시될 텍스트 라벨 (생략 시 라벨 없이 렌더링) */
  label?: string;

  /** * 에러 상태 여부 (true일 경우 테두리가 빨간색으로 변경됨)
   * @default false
   */
  isError?: boolean;
}

export default function Input({
  label,
  isError = false,
  ...props
}: InputProps) {
  // ... 구현 코드
}
