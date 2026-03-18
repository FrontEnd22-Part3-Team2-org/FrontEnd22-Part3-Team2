/**
 * @file Button.tsx
 * @description 프로젝트 전반에서 사용되는 공통 버튼 컴포넌트입니다.
 * @author 하늘
 * * @example
 * <Button variant="primary" size="lg" disabled={false}>저장하기</Button>
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** * 버튼의 시각적 스타일 타입
   * @default 'primary'
   */
  variant?: 'primary' | 'outline' | 'danger';

  /** * 버튼의 크기
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  // ... 버튼 구현 코드
}
