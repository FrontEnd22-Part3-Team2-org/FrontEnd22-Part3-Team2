import Image from 'next/image';
import Link from 'next/link';

export default function LandingHeader() {
  return (
    <header className="flex h-[70px] w-full shrink-0 items-center justify-between bg-gray-900 px-4 md:px-10 lg:px-20">
      <Link
        href="/"
        className="flex items-center gap-2"
        aria-label="Taskify 홈"
      >
        <Image
          src="/logo-taskify-icon-sm.svg"
          alt=""
          width={24}
          height={28}
          className="size-7 brightness-0 invert"
          priority
        />
        <span className="text-xl font-bold text-whiteㅅ">Taskify</span>
      </Link>
      <nav className="flex items-center gap-5 text-sm text-white md:gap-6 md:text-base">
        <Link href="/login" className="hover:opacity-80">
          로그인
        </Link>
        <Link href="/signup" className="hover:opacity-80">
          회원가입
        </Link>
      </nav>
    </header>
  );
}
