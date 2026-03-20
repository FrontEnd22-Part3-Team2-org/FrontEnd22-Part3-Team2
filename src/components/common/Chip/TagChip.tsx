/**
 * @file TagChip.tsx
 * @description
 *
 * @author 수경
 */

// TODO : [수경] 드롭다운 컴포넌트와 props 연결

interface TagChipProps {
  label: string;
  color: string;
  children: string;
}

export default function TagChip({ children }: TagChipProps) {
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium`}>
      {children}
    </span>
  );
}
