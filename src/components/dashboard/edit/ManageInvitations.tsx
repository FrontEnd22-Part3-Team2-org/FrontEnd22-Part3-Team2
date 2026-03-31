'use client';

import {
  deleteInvitation,
  getInvitations,
  inviteMember,
} from '@/api/dashboard';
import Button from '@/components/common/Button';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';
import Pagination from '@/components/common/Pagination';
import FormModal from '@/components/Modal/FormModal';
import { ConfirmModal } from '@/components/Modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_PER_PAGE = 5;

interface EmailTableProps {
  dashboardId: string;
}

export default function ManageInvitations({ dashboardId }: EmailTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInviterEmail, setSelectedInviterEmail] = useState<
    number | null
  >(null);

  // 초대하기 모달용 state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const inviteMutation = useMutation({
    mutationFn: (inviteeEmail: string) =>
      inviteMember(Number(dashboardId), inviteeEmail),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['invitations', dashboardId],
      });
      setCurrentPage(1);
      closeInviteModal();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (message === '이미 대시보드에 초대된 멤버입니다.') {
          setErrorText('이미 대시보드에 초대된 멤버입니다.');
          return;
        }

        if (message === '이메일 형식이 올바르지 않습니다') {
          setErrorText('이메일 형식으로 작성해 주세요.');
          return;
        }

        if (message === '대시보드 초대 권한이 없습니다.') {
          setErrorText('초대 권한이 없습니다.');
          return;
        }

        if (message === '대시보드가 존재하지 않습니다.') {
          setErrorText('대시보드를 찾을 수 없습니다.');
          return;
        }
      }

      setErrorText('초대에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  const invitations = data?.invitations ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / EMAIL_PER_PAGE) || 1;

  if (isLoading) return <div>초대 내역 로딩 중...</div>;
  if (isError) return <div>데이터를 불러오는 중 에러가 발생했습니다.</div>;

  const resetInviteModal = () => {
    setEmail('');
    setErrorText('');
    setIsSubmitting(false);
  };

  const closeInviteModal = () => {
    resetInviteModal();
    setIsInviteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedInviterEmail) {
      deleteMutation.mutate(selectedInviterEmail);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value.trim()) {
      setErrorText('');
      return;
    }

    if (!emailRegex.test(value.trim())) {
      setErrorText('이메일 형식으로 작성해 주세요.');
      return;
    }

    setErrorText('');
  };

  const handleInviteConfirm = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) return;

    if (!emailRegex.test(trimmedEmail)) {
      setErrorText('이메일 형식으로 작성해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorText('');

      await inviteMutation.mutateAsync(trimmedEmail);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInviteButtonDisabled = !email.trim() || !!errorText || isSubmitting;

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
            onClick={() => setIsInviteModalOpen(true)}
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

      {isInviteModalOpen && (
        <ModalOverlay onClose={closeInviteModal}>
          <FormModal
            title="멤버 초대"
            label="이메일"
            value={email}
            placeholder="이메일을 입력해 주세요"
            cancelText="취소"
            confirmText="초대"
            errorText={errorText}
            showCloseButton
            disabled={isInviteButtonDisabled}
            onChange={handleEmailChange}
            onCancel={closeInviteModal}
            onClose={closeInviteModal}
            onConfirm={handleInviteConfirm}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
