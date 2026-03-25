'use client';

import { useState } from 'react';
import EmptyInvitation from './EmptyInvitation';
import InvitationTable from './InvitationTable';
import { Dashboard } from '@/types/dashboard';

export default function InvitationList() {
  const [invitations, setInvitations] = useState<Dashboard[]>([]);

  return (
    <section>
      {invitations.length > 0 ? (
        <InvitationTable data={invitations} />
      ) : (
        <EmptyInvitation />
      )}
    </section>
  );
}
