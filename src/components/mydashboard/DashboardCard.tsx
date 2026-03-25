import { Dashboard } from '@/types/dashboard';
import Button from '../common/Button';
import Image from 'next/image';
import ArrowRightIcon from '../common/Icon/ArrowRightIcon';
import CrownIcon from '../common/Icon/ic-crown.svg';

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
        {board.createdByMe && (
          <Image
            className="ml-[4px] md:ml-[6px] lg:ml-[8px]"
            src={CrownIcon}
            alt="왕관"
          />
        )}
      </div>
      <ArrowRightIcon width={18} height={18} />
    </Button>
  );
}
