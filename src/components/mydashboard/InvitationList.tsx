import EmptyInvitation from './EmptyInvitation';
import InvitationTable from './InvitationTable';

export interface Invitation {
  id: number;
  dashboard: {
    title: string;
  };
  inviter: {
    name: string;
  };
}

export default function InvitationList() {
  const invitations: Invitation[] = [];

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
