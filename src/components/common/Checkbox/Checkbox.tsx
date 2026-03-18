// 이 파일의 모든 내용은 주석 사용 예시를 위함입니다! 편히 수정하셔요

/**
 * @file Checkbox.tsx
 * @description 커스텀 디자인이 적용된 공통 체크박스 컴포넌트입니다.
 * Tailwind의 peer 클래스를 활용하여 기본 체크박스를 숨기고 커스텀 UI를 렌더링합니다.
 * @author 인영
 */

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 체크박스 우측에 표시될 텍스트 라벨 */
  label?: string;
}

// export default function Checkbox({...