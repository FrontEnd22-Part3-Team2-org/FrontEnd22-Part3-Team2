'use client';

import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import { Member } from '@/types/dashboard';
import Image from 'next/image';
import { useState } from 'react';

const ITEM_PER_PAGE = 4;

interface MembersTableProps {
  data: Member[];
  dashboardId: string;
}

export default function ManageMembers({ data }: MembersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / ITEM_PER_PAGE);

  const indexOfLastItem = currentPage * ITEM_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEM_PER_PAGE;
  const currentMembers = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="pt-[22px] md:pt-[26px]">
      <div className="flex items-center justify-between">
        <span className="pl-[16px] text-xl-bold md:pl-[28px] md:text-2xl-bold">
          구성원
        </span>
        <div className="pr-[16px] flex justify-end items-center gap-[16px] md:pr-[28px]">
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
      </div>
      <table className="mt-[18px] w-full text-lg-regular text-gray-500 md:mt-[27px]">
        <thead className="text-lg-regular text-gray-400">
          <tr>
            <th className="pl-[16px] font-normal text-left md:pl-[28px]">
              이름
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {currentMembers.map((item, index) => {
            const overallIndex = indexOfFirstItem + index + 1;
            const isPageEnd = overallIndex % ITEM_PER_PAGE === 0;

            return (
              <tr
                key={item.id}
                className={`border-gray-200 border-b ${isPageEnd ? 'border-b-0' : ''}`}
              >
                <td
                  className="flex items-center gap-[8px] pl-[16px] py-[12px] 
                  font-normal text-left text-md-regular text-gray-700 
                  md:pl-[28px] md:py-[16px] md:gap-[12px] md:text-lg-regular"
                >
                  <div className="w-[34px] h-[34px] md:w-[38px] md:h-[38px] rounded-full overflow-hidden">
                    {item.profileImageUrl ? (
                      <Image
                        src={item.profileImageUrl}
                        alt={item.nickname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green text-white">
                        {item.nickname[0]}
                      </div>
                    )}
                  </div>
                  {item.nickname}
                </td>
                <td className="pr-[16px] text-right md:pr-[28px]">
                  <Button variant="secondary" size="delete_lg">
                    삭제
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
