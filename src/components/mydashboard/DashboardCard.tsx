import { Dashboard } from '@/types/dashboard';
import Button from '../common/Button';
import ArrowRightIcon from '../common/Icon/ArrowRightIcon';
import CrownIcon from '../common/Icon/CrownIcon';

interface DashboardCardProps {
  board: Dashboard;
}

export default function DashboardCard({ board }: DashboardCardProps) {
  return (
    <Button
      variant="secondary"
      size="dashboard_card"
      className="!w-full flex items-center justify-between"
    >
      <div className="flex items-center">
        <span
          className="mr-[12px] w-[8px] h-[8px] rounded-full lg:mr-[16px]"
          style={{ backgroundColor: board.color }}
        ></span>
        <span>{board.title}</span>
        {board.createdByMe && <CrownIcon />}
      </div>
      <ArrowRightIcon width={18} height={18} />
    </Button>
  );
}
