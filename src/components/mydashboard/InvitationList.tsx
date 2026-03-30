'use client';

import { getMyInvitations } from '@/api/dashboard';
import EmptyInvitation from './EmptyInvitation';
import InvitationTable from './InvitationTable';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export default function InvitationList() {
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['myInvitations'],
      queryFn: ({ pageParam }) => getMyInvitations(10, pageParam),
      initialPageParam: null as number | null,
      getNextPageParam: (lastPage) => lastPage.cursorId ?? null,
    });

  const invitations = data?.pages.flatMap((page) => page.invitations) || [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0, rootMargin: '0px 0px 80px 0px' },
    );

    const el = observerRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, invitations.length]);

  return (
    <div>
      {invitations.length > 0 ? (
        <div>
          <InvitationTable data={invitations} observerRef={observerRef} />
        </div>
      ) : (
        <EmptyInvitation />
      )}
    </div>
  );
}
