/**
 * @file CountCardChip.tsx
 * @description 할 일 카드의 개수를 보여주는 컴포넌트입니다.
 * 대시보드 내 진행 상태에 따라 할 일 카드의 개수를 보여줍니다.
 *
 * @author 수경
 */

// TODO: [수경] 부모 컴포넌트로부터 prop을 받아서 화면에 보여주도록 수정 필요 👉 부모 컴포넌트 생기면 작업

export default function CountCardChip() {
  return (
    <>
      <div className="w-5 h-5 flex items-center justify-center rounded bg-gray-200">
        <span className="text-gray-500 text-xs-medium">5</span>
      </div>
    </>
  );
}
