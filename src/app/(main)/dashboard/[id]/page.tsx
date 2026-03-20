/**
 * @file 대시보드 상세 페이지 - 칸반보드 ( /dashboard/{id} )
 * @description 특정 대시보드의 칼럼과 할 일 카드들을 보여주는 핵심 화면입니다.
 * @note 카드 생성, 수정, 삭제 시 화면이 즉각적으로 업데이트(상태 동기화) 되어야 합니다.
 */

import AddItemChip from '@/components/common/Chip/AddItemChip';
import CountCardChip from '@/components/common/Chip/CountCardChip';
import StatusChip from '@/components/common/Chip/StatusChip';

export default function DashboardPage() {
  const value = 'todo';
  return (
    <div>
      대시보드 상세 페이지
      <StatusChip />
      <AddItemChip />
      <CountCardChip />
    </div>
  );
}
