'use client';

import Button from '@/components/common/Button';
import AddItemChip from '../common/Chip/AddItemChip';
import DashboardCard from './DashboardCard';
import { Dashboard } from '@/types/dashboard';
import { useState } from 'react';
import Pagination from '../common/Pagination';

const DASHBOARD_LIMIT_PER_PAGE = 6;
const ADD_BUTTON_SLOT = 1;
const FIRST_PAGE_DATA_LIMIT = DASHBOARD_LIMIT_PER_PAGE - ADD_BUTTON_SLOT;

export default function DashboardList() {
  const dashboards: Dashboard[] = [];
  const [currentPage, setCurrentPage] = useState(1);

  const isFirstPage = currentPage === 1;

  const pageSize = isFirstPage
    ? FIRST_PAGE_DATA_LIMIT
    : DASHBOARD_LIMIT_PER_PAGE;
  const startIndex = isFirstPage
    ? 0
    : (currentPage - 1) * DASHBOARD_LIMIT_PER_PAGE - ADD_BUTTON_SLOT;
  const currentDashboards = dashboards.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(
    (dashboards.length + ADD_BUTTON_SLOT) / DASHBOARD_LIMIT_PER_PAGE,
  );

  return (
    <div className="pt-[40px] flex flex-col w-full">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[8px] content-start 
          md:gap-[10px] lg:gap-[13px] 
          ${dashboards.length > 0 ? 'min-h-[160px] md:min-h-[235px] lg:min-h-[160px]' : 'min-h-0'}`}
      >
        {isFirstPage && (
          <Button variant="secondary" size="add_board" className="!w-full">
            새로운 대시보드
            <AddItemChip asIcon={true} />
          </Button>
        )}

        {currentDashboards.map((board) => (
          <DashboardCard key={board.id} board={board} />
        ))}
      </div>

      {dashboards.length > 0 && (
        <div className="mt-[8px] flex justify-end items-center gap-[16px]">
          <span className="text-xs-regular text-gray-500 md:text-md-regular">
            {totalPages} 페이지 중 {currentPage}
          </span>
          <Pagination
            size="sm"
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      )}
    </div>
  );
}
