// 이 파일의 모든 내용은 주석 사용 예시를 위함입니다! 편히 수정하셔요

/**
 * @file SideMenu.tsx
 * @description 서비스 좌측에 고정되는 네비게이션 사이드바 컴포넌트입니다.
 * 내 대시보드 목록을 보여주고, 현재 위치한 페이지의 탭을 하이라이트 처리합니다.
 * @author
 * * @notes
 * - 현재 경로(pathname)를 감지하기 위해 'use client'가 선언되어 있습니다.
 */

'use client';
// ...
// SideMenu.tsx

const boards = [
  { id: 1, name: '비브리지', color: 'bg-lime-400', crown: true, active: true },
  { id: 2, name: '코드X', color: 'bg-violet-500', crown: true, active: false },
  { id: 3, name: '3분기 계획', color: 'bg-amber-400', active: false },
  { id: 4, name: '회의록', color: 'bg-sky-400', active: false },
  { id: 5, name: '중요 문서함', color: 'bg-pink-400', active: false },
  { id: 6, name: '비브리지', color: 'bg-lime-400', crown: true, active: false },
  { id: 7, name: '코드X', color: 'bg-violet-500', crown: true, active: false },
  { id: 8, name: '3분기 계획', color: 'bg-amber-400', active: false },
  { id: 9, name: '회의록', color: 'bg-sky-400', active: false },
  { id: 10, name: '중요 문서함', color: 'bg-pink-400', active: false },
  {
    id: 11,
    name: '비브리지',
    color: 'bg-lime-400',
    crown: true,
    active: false,
  },
  { id: 12, name: '코드X', color: 'bg-violet-500', crown: true, active: false },
  { id: 13, name: '3분기 계획', color: 'bg-amber-400', active: false },
  { id: 14, name: '회의록', color: 'bg-sky-400', active: false },
  { id: 15, name: '중요 문서함', color: 'bg-pink-400', active: false },
];

export default function SideMenu() {
  return (
    <aside className="flex min-h-screen w-[300px] px-2 py-5 shrink-0 flex-col bg-white">
      <h1 className="text-xl font-bold text-violet-600">Taskify</h1>

      <div className="mt-8 flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold text-gray-400">Dash Boards</p>
          <button className="flex h-5 w-5 items-center justify-center border border-gray-200 text-xs text-gray-400">
            +
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-[6px]">
            {boards.map((board) => (
              <li key={board.id}>
                <button
                  className={`flex h-[50px] w-full items-center gap-[10px] px-3 py-3 text-left text-[16px] font-medium transition ${
                    board.active
                      ? 'bg-[#F1EFFD] text-gray-900'
                      : 'text-[#787486] hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${board.color}`} />
                  <span className="flex-1 truncate">{board.name}</span>
                  {board.crown && <span className="text-xs">👑</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <div className="flex h-[40px] w-[80px] overflow-hidden rounded-md border border-gray-200 bg-white">
            <button className="flex h-full w-[40px] items-center justify-center text-gray-400 hover:bg-gray-50">
              ←
            </button>
            <button className="flex h-full w-[40px] items-center justify-center border-l border-gray-200 text-gray-400 hover:bg-gray-50">
              →
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
