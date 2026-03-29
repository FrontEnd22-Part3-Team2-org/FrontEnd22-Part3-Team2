'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboards } from '@/api/dashboard';
import { Dashboard } from '@/types/dashboard';

import Button from '@/components/common/Button';
import AddItemChip from '../common/Chip/AddItemChip';
import DashboardCard from './DashboardCard';
import Pagination from '../common/Pagination';
import DashboardCreateModal from '../Modal/DashboardCreateModal';

const DASHBOARD_LIMIT = 5;

export default function DashboardList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isPlaceholderData } = useQuery({
    queryKey: ['dashboards', currentPage],
    queryFn: () => getDashboards(currentPage, DASHBOARD_LIMIT),
    placeholderData: (previousData) => previousData,
  });

  const isFirstPage = currentPage === 1;
  const rawDashboards = data?.dashboards || [];
  const isTransitioningFromFirst =
    isPlaceholderData && isFirstPage === false && rawDashboards.length > 5;

  const dashboards =
    isFirstPage || isTransitioningFromFirst
      ? rawDashboards.slice(0, 5)
      : rawDashboards;

  const totalCount = data?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DASHBOARD_LIMIT));

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="pt-[40px] flex flex-col w-full">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[8px] content-start 
          md:gap-[10px] lg:gap-[13px] 
          ${dashboards.length > 0 ? 'min-h-[160px] md:min-h-[235px] lg:min-h-[160px]' : 'min-h-0'}`}
      >
        {isFirstPage && (
          <Button
            variant="secondary"
            size="add_board"
            className="!w-full"
            onClick={openModal}
          >
            새로운 대시보드
            <AddItemChip asIcon={true} />
          </Button>
        )}

        {dashboards.map((board: Dashboard) => (
          <DashboardCard key={board.id} board={board} />
        ))}

        <DashboardCreateModal isOpen={isModalOpen} onClose={closeModal} />
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
