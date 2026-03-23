/**
 * @file StatusChip.tsx
 * @description 작업의 진행 상태(todo, in-progress, done)를 시각적으로 표시하는 태그 컴포넌트입니다.
 * 할 일 카드 및 대시보드 UI에서 사용됩니다.
 *
 * @author 수경
 */

interface StatusTagProps {
  status: string;
}
/**
 * prop으로 태그 라벨 내려받기
 * 색상이 랜덤으로 지정되는 기능 구현 필요
 */
export default function StatusChip({ status }: StatusTagProps) {
  const label = status;

  return (
    <div className="inline-flex items-center gap-2 bg-brand-violet-light px-3 py-1 rounded-2xl">
      <span className="w-2 h-2 rounded-full bg-brand-violet"></span>
      <p className="text-brand-violet text-md-regular">{label}</p>
    </div>
  );
}
