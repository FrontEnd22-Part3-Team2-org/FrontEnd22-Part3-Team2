/**
 * @file AssigneeItem.tsx
 * @description 
 * ### 반응형 브레이트포인트
 * | breakpoint | 기기        |
| ---------- | -------------- |
| sm (640)   | 큰 모바일 / 작은 태블릿 |
| md (768)   | 태블릿            |
| lg (1024)  | 작은 노트북         |
| xl (1280)  | 데스크탑           |
| 2xl (1536) | 큰 모니터          |

 *
 * @author 수경
 *
 */
import UserName from '@/components/common/User/UserName';
import type { Assignee } from '@/types/dashboard';

interface Props {
  assignee: Assignee | null;
  dueDate: string | null;
}

export default function AssigneeItem({ assignee, dueDate }: Props) {
  if (!assignee) return null; // null이면 렌더링 안함

  const sectionClass = 'flex flex-col gap-[6px] w-full';
  const titleClass = 'text-xs-semibold';

  return (
    <div className="flex md:flex-col flex-row items-center md:gap-4 gap-1 md:w-[200px] px-4 py-[14px] border border-gray-300 rounded-lg">
      <div className={sectionClass}>
        <p className={titleClass}>담당자</p>
        <UserName profile={assignee} />
      </div>
      <div className={sectionClass}>
        <p className={titleClass}>마감일</p>
        <p className="text-gray-700 text-md-regular">{dueDate}</p>
      </div>
    </div>
  );
}
