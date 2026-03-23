/**
 * ConfirmModal(two-button modal)
 * ----------------------------------------
 * 사용자에게 "확인/취소" 선택을 요구하는 모달입니다.
 *
 * 사용 케이스:
 * - 삭제 확인
 * - 로그아웃 확인
 * - 위험한 작업 실행 전 확인
 *
 * 특징:
 * - 버튼 2개 (취소 / 확인)
 * - 사용자의 의사결정 필요
 *
 * props:
 * - message: 표시할 메시지
 * - cancelText: 취소 버튼 텍스트 (기본값: "취소")
 * - confirmText: 확인 버튼 텍스트 (기본값: "삭제")
 * - onCancel: 취소 버튼 클릭 시 실행
 * - onConfirm: 확인 버튼 클릭 시 실행
 *
 */

import ModalBase from '@/components/common/ModalBase';

interface ConfirmModalProps {
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  message,
  cancelText = '취소',
  confirmText = '삭제',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <ModalBase className="w-[568px] rounded-[16px] p-[24px]">
      <p className="mb-[24px] text-center text-[20px] font-medium text-[#333236]">
        {message}
      </p>

      <div className="flex gap-[14px]">
        <button
          onClick={onCancel}
          className="flex-1 rounded-[8px] border border-[#D9D9D9] bg-white py-[14px] text-[16px] font-medium text-[#787486]"
        >
          {cancelText}
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 rounded-[8px] bg-[#5534DA] py-[14px] text-[16px] font-semibold text-white hover:bg-[#4C32D1]"
        >
          {confirmText}
        </button>
      </div>
    </ModalBase>
  );
}
