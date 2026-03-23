import Button from '@/components/common/Button';

export default function DashboardList() {
  return (
    <div className="pt-[40px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <Button variant="secondary" size="add_board">
        새로운 대시보드 +
      </Button>
    </div>
  );
}
