'use client';

import { deleteInvitation, getInvitations } from '@/api/dashboard';
import Button from '@/components/common/Button';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';
import Pagination from '@/components/common/Pagination';
import { ConfirmModal } from '@/components/Modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const EMAIL_PER_PAGE = 5;

interface EmailTableProps {
  dashboardId: string;
}

export default function ManageInvitations({ dashboardId }: EmailTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInviterEmail, setSelectedInviterEmail] = useState<
    number | null
  >(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invitations', dashboardId, currentPage],
    queryFn: () =>
      getInvitations(Number(dashboardId), currentPage, EMAIL_PER_PAGE),
    enabled: !!dashboardId,
  });

  const deleteMutation = useMutation({
    mutationFn: (invitationId: number) =>
      deleteInvitation(Number(dashboardId), invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', dashboardId] });
      setSelectedInviterEmail(null);
    },
    onError: () => {
      alert('초대 취소에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  const invitations = data?.invitations ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / EMAIL_PER_PAGE) || 1;

  if (isLoading) return <div>초대 내역 로딩 중...</div>;
  if (isError) return <div>데이터를 불러오는 중 에러가 발생했습니다.</div>;

  const handleDeleteConfirm = () => {
    if (selectedInviterEmail) {
      deleteMutation.mutate(selectedInviterEmail);
    }
  };

  return (
    <div className="relative pt-[22px] md:pt-[26px]">
      <div className="flex items-center justify-between">
        <span className="pl-[16px] text-xl-bold md:pl-[28px] md:text-2xl-bold">
          초대 내역
        </span>
        <div className="pr-[16px] flex items-center gap-[12px] md:pr-[28px] md:gap-[16px]">
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
          <Button
            variant="primary"
            className="absolute right-[16px] top-[72px]
            px-[0px] w-[86px] h-[26px] justify-center text-white text-xs-medium gap-[6px] 
            md:static md:w-[105px] md:h-[32px] md:text-md-medium md:gap-[8px]"
          >
            <AddBoxIcon className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] brightness-0 invert" />
            초대하기
          </Button>
        </div>
      </div>
      <table className="mt-[18px] w-full text-lg-regular text-gray-500 md:mt-[27px]">
        <thead className="text-lg-regular text-gray-400">
          <tr>
            <th className="pl-[16px] pb-[26px] font-normal text-left md:pl-[28px] md:pb-[1px]">
              이메일
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {invitations.map((item, index) => {
            const overallIndex = (currentPage - 1) * EMAIL_PER_PAGE + index + 1;
            const isPageEnd = overallIndex % EMAIL_PER_PAGE === 0;

            return (
              <tr
                key={item.id}
                className={`border-gray-200 border-b ${isPageEnd ? 'border-b-0' : ''}`}
              >
                <td
                  className="flex items-center gap-[8px] pl-[16px] py-[15px] 
                  font-normal text-left text-md-regular text-gray-700 
                  md:pl-[28px] md:py-[22px] md:gap-[12px] md:text-lg-regular"
                >
                  {item.invitee.email}
                </td>
                <td className="pr-[16px] text-right md:pr-[28px]">
                  <Button
                    variant="secondary"
                    size="delete_lg"
                    className="px-[14px] py-[7px] w-[52px] h-[32px] text-xs-medium
                    md:px-[20px] md:py-[4px] md:w-[84px] md:h-[32px] md:text-md-medium"
                    onClick={() => setSelectedInviterEmail(item.id)}
                  >
                    취소
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedInviterEmail !== null && (
        <ModalOverlay onClose={() => setSelectedInviterEmail(null)}>
          <ConfirmModal
            message="정말 초대를 취소하시겠습니까?"
            cancelText="아니요"
            confirmText="네"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setSelectedInviterEmail(null)}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
