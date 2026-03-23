/**
 * ModalBase
 * ----------------------------------------
 * 모든 모달에서 공통으로 사용하는 "컨테이너(껍데기)" 컴포넌트입니다.
 *
 * 역할:
 * - 모달의 기본 스타일 제공
 * - 내부 콘텐츠는 children으로 받아서 렌더링
 *
 * 사용 방법:
 * - AlertModal, ConfirmModal, FormModal 등에서 감싸서 사용
 *
 * 주의:
 * - 버튼, 텍스트, input 등 "내용"은 여기서 처리하지 않음
 * - 공통 스타일만 담당
 */

import { ReactNode } from 'react';

interface ModalBaseProps {
  children: ReactNode;
  className?: string;
}

export default function ModalBase({
  children,
  className = '',
}: ModalBaseProps) {
  return <div className={`bg-white shadow-lg ${className}`}>{children}</div>;
}
