//모달 테스트용 페이지입니다.

'use client';

import { useState } from 'react';
import AlertModal from '@/components/Modal/AlertModal';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import FormModal from '@/components/Modal/FormModal';

type ModalType =
  | 'none'
  | 'alert'
  | 'confirm'
  | 'createColumn'
  | 'createColumnError'
  | 'manageColumn'
  | 'invite';

export default function ModalTestPage() {
  const [openModal, setOpenModal] = useState<ModalType>('none');
  const [columnName, setColumnName] = useState('새로운 프로젝트');
  const [duplicateName, setDuplicateName] = useState('To Do');
  const [manageName, setManageName] = useState('Done');
  const [email, setEmail] = useState('새로운 프로젝트');

  const closeModal = () => setOpenModal('none');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F5F5F5] px-4 py-10">
      <h1 className="text-[24px] font-bold text-[#222222]">Modal Test Page</h1>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setOpenModal('alert')}
          className="rounded-[12px] bg-[#5534DA] px-4 py-2 text-white"
        >
          원버튼 알림 모달
        </button>

        <button
          onClick={() => setOpenModal('confirm')}
          className="rounded-[12px] bg-[#5534DA] px-4 py-2 text-white"
        >
          투버튼 삭제 확인 모달
        </button>

        <button
          onClick={() => setOpenModal('createColumn')}
          className="rounded-[12px] bg-[#5534DA] px-4 py-2 text-white"
        >
          새 컬럼 생성 모달
        </button>

        <button
          onClick={() => setOpenModal('createColumnError')}
          className="rounded-[12px] bg-[#5534DA] px-4 py-2 text-white"
        >
          새 컬럼 생성 에러 모달
        </button>

        <button
          onClick={() => setOpenModal('manageColumn')}
          className="rounded-[12px] bg-[#5534DA] px-4 py-2 text-white"
        >
          컬럼 관리 모달
        </button>

        <button
          onClick={() => setOpenModal('invite')}
          className="rounded-[12px] bg-[#5534DA] px-4 py-2 text-white"
        >
          초대하기 모달
        </button>
      </div>

      {openModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          {openModal === 'alert' && (
            <AlertModal
              message="비밀번호가 일치하지 않습니다."
              buttonText="확인"
              onConfirm={closeModal}
            />
          )}

          {openModal === 'confirm' && (
            <ConfirmModal
              message="컬럼의 모든 카드가 삭제됩니다."
              cancelText="취소"
              confirmText="삭제"
              onCancel={closeModal}
              onConfirm={() => {
                console.log('컬럼 삭제');
                closeModal();
              }}
            />
          )}

          {openModal === 'createColumn' && (
            <FormModal
              title="새 컬럼 생성"
              label="이름"
              value={columnName}
              placeholder="새로운 프로젝트"
              cancelText="취소"
              confirmText="생성"
              onChange={setColumnName}
              onCancel={closeModal}
              onConfirm={() => {
                console.log('컬럼 생성:', columnName);
                closeModal();
              }}
            />
          )}

          {openModal === 'createColumnError' && (
            <FormModal
              title="새 컬럼 생성"
              label="이름"
              value={duplicateName}
              placeholder="새로운 프로젝트"
              cancelText="취소"
              confirmText="생성"
              errorText="중복된 컬럼 이름입니다."
              onChange={setDuplicateName}
              onCancel={closeModal}
              onConfirm={() => {
                console.log('중복 검사 후 생성 시도');
              }}
            />
          )}

          {openModal === 'manageColumn' && (
            <FormModal
              title="컬럼 관리"
              label="이름"
              value={manageName}
              cancelText="삭제"
              confirmText="변경"
              showCloseButton
              onChange={setManageName}
              onCancel={() => {
                console.log('컬럼 삭제');
                closeModal();
              }}
              onConfirm={() => {
                console.log('컬럼 변경:', manageName);
                closeModal();
              }}
              onClose={closeModal}
            />
          )}

          {openModal === 'invite' && (
            <FormModal
              title="초대하기"
              label="이메일"
              value={email}
              placeholder="새로운 프로젝트"
              cancelText="취소"
              confirmText="생성"
              showCloseButton
              onChange={setEmail}
              onCancel={closeModal}
              onConfirm={() => {
                console.log('초대:', email);
                closeModal();
              }}
              onClose={closeModal}
            />
          )}
        </div>
      )}
    </main>
  );
}
