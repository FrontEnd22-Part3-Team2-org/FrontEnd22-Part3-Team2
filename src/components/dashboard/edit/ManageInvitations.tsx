'use client';

import Button from '@/components/common/Button';
import AddBoxIcon from '@/components/common/Icon/AddBoxIcon';
import Pagination from '@/components/common/Pagination';
import { Member } from '@/types/dashboard';
import { useState } from 'react';

const EMAIL_PER_PAGE = 5;

interface EmailTableProps {
  data: Member[];
  dashboardId: string;
}

export default function ManageInvitations({ data }: EmailTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / EMAIL_PER_PAGE);

  const indexOfLastItem = currentPage * EMAIL_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - EMAIL_PER_PAGE;
  const currentEmail = data.slice(indexOfFirstItem, indexOfLastItem);

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
          {currentEmail.map((item, index) => {
            const overallIndex = indexOfFirstItem + index + 1;
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
                  {item.email}
                </td>
                <td className="pr-[16px] text-right md:pr-[28px]">
                  <Button
                    variant="secondary"
                    size="delete_lg"
                    className="px-[14px] py-[7px] w-[52px] h-[32px] text-xs-medium
                    md:px-[20px] md:py-[4px] md:w-[84px] md:h-[32px] md:text-md-medium"
                  >
                    취소
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
