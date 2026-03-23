/**
 * @file AssigneeItem.tsx
 * @description 
 
 *
 * @author 수경
 *
 */
import UserName from '@/components/common/User/UserName';
import type { Assignee } from '@/types/dashboard';

interface Props {
  assignee: Assignee;
}

export default function AssigneeItem({ assignee }: Props) {
  const sectionClass = 'flex flex-col gap-[6px]';
  const titleClass = 'text-xs-semibold';

  return (
    <div className="flex flex-col gap-4 w-[200px] px-4 py-[14px] border border-gray-300 rounded-lg">
      <div className={sectionClass}>
        <p className={titleClass}>담당자</p>
        <UserName profile={assignee} />
      </div>
      <div className={sectionClass}>
        <p className={titleClass}>마감일</p>
        <p className="text-gray-700 text-md-regular">2026.03.23 19:30</p>
      </div>
    </div>
  );
}
