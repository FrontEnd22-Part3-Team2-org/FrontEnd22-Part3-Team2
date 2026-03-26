import ModalBase from '@/components/common/ModalBase';
import ModalOverlay from '@/components/common/ModalBase/ModalOverlay';

export default function Skeleton({
  onModalClose,
}: {
  onModalClose: () => void;
}) {
  return (
    <ModalOverlay onClose={onModalClose}>
      <ModalBase className="relative w-full md:w-[730px] max-h-[calc(100vh-110px)] overflow-y-auto flex flex-col-reverse md:flex-row md:gap-[14px] gap-4 text-gray-700 rounded-lg px-[30px] py-6 mx-6 md:m-0">
        {/* 좌측 영역 */}
        <div className="flex flex-col md:max-w-[450px] md:min-w-[450px] animate-pulse">
          {/* 제목 */}
          <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-6" />

          {/* 진행 상태 및 태그 */}
          <div className="flex items-center gap-5 mb-4">
            <div className="h-6 bg-gray-200 rounded-full w-20" />
            <div className="w-[1px] h-5 bg-gray-300" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-14" />
              <div className="h-6 bg-gray-200 rounded-full w-14" />
            </div>
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-2 mb-8">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>

          {/* 이미지 */}
          <div className="w-full h-[160px] md:h-[200px] bg-gray-200 rounded-md mb-6" />

          {/* 댓글 */}
          <div className="flex flex-col gap-3">
            <div className="h-5 bg-gray-200 rounded w-12" />
            <div className="h-24 bg-gray-200 rounded-md w-full" />
          </div>
        </div>

        {/* 우측 영역 */}
        <div className="flex flex-col items-end gap-6 min-w-[200px] w-full animate-pulse">
          {/* 메뉴, 닫기 버튼 */}
          <div className="flex gap-6">
            <div className="w-7 h-7 bg-gray-200 rounded" />
            <div className="w-7 h-7 bg-gray-200 rounded" />
          </div>

          {/* 담당자 */}
          <div className="hidden md:flex flex-col gap-3 w-full">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-16 mt-2" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </ModalBase>
    </ModalOverlay>
  );
}
