import { useState } from 'react';
type User = { id: number; name: string; active: boolean };
type Props = { user: User; onSelect: (id: number) => void };

export function UserCard({ user, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="user-card">
      <button onClick={() => setExpanded(!expanded)}>
        {user.name}
      </button>
      {expanded && <UserDetails user={user} onSelect={onSelect} />}
    </article>
  );
}
function UserDetails({ user, onSelect }: Props) {
  return <button onClick={() => onSelect(user.id)}>Select user</button>;
}
