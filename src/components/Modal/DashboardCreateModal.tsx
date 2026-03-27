'use client';

import { useRouter } from 'next/navigation';
import FormModal from './FormModal';
import { useState } from 'react';
import ColorChip, { COLORS } from '../common/Chip/ColorChip';
import api from '@/api/axios';

interface DashboardCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardCreateModal({
  isOpen,
  onClose,
}: DashboardCreateModalProps) {
  const router = useRouter();
  const [dashboardName, setDashboardName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!dashboardName.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const response = await api.post('/dashboards', {
        title: dashboardName,
        color: selectedColor,
      });

      const createdData = response.data;

      if (createdData?.id) {
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
          disabled={!dashboardName.trim() || isLoading}
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
