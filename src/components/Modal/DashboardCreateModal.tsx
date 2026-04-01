'use client';

import { useRouter } from 'next/navigation';
import FormModal from './FormModal';
import { useMemo, useState } from 'react';
import ColorChip, { COLORS } from '../common/Chip/ColorChip';
import api from '@/api/axios';
import { Dashboard } from '@/types/dashboard';
import { validateDashboardName } from '@/utils/validate';

interface DashboardCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboards: Dashboard[];
  onSuccess?: (newId: number) => void;
}

function isDuplicateDashboard(
  existingDashboards: Dashboard[],
  newTitle: string,
  newColor: string,
): boolean {
  return existingDashboards.some(
    (db) =>
      db.createdByMe && db.title === newTitle.trim() && db.color === newColor,
  );
}

export default function DashboardCreateModal({
  isOpen,
  onClose,
  dashboards,
  onSuccess,
}: DashboardCreateModalProps) {
  const router = useRouter();
  const [dashboardName, setDashboardName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [isLoading, setIsLoading] = useState(false);

  const isDuplicate = useMemo(() => {
    return isDuplicateDashboard(dashboards, dashboardName, selectedColor);
  }, [dashboards, dashboardName, selectedColor]);

  const isTitleValid = validateDashboardName(dashboardName);
  const isSubmitDisabled = !isTitleValid || isLoading || isDuplicate;

  const handleCreate = async () => {
    if (!isTitleValid) return;
    setIsLoading(true);

    try {
      const response = await api.post('/dashboards', {
        title: dashboardName,
        color: selectedColor,
      });

      const createdData = response.data;

      if (createdData?.id) {
        onSuccess?.(createdData.id);
        router.push(`/dashboard/${createdData.id}`);
        router.refresh();
        onClose();
      }
    } catch {
      alert('대시보드 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDashboardName('');
    setSelectedColor(COLORS[0].hex);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70"
      onClick={handleClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <FormModal
          title="새로운 대시보드"
          label="대시보드 이름"
          placeholder="뉴 프로젝트"
          confirmText="생성"
          value={dashboardName}
          onChange={setDashboardName}
          onConfirm={handleCreate}
          onCancel={handleClose}
          errorText={
            !isTitleValid
              ? '대시보드 이름은 2자 이상의 완성된 한글, 영문, 숫자여야 합니다.'
              : ''
          }
          disabled={isSubmitDisabled}
        >
          <ColorChip
            onSelectedColor={(hex) => setSelectedColor(hex)}
            defaultColor={selectedColor}
          />
        </FormModal>
      </div>
    </div>
  );
}
