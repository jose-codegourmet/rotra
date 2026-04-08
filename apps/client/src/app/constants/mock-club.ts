export const MOCK_CLUB = {
  id: '1',
  name: 'Sunrise Badminton Club',
  location: 'Quezon City',
  status: 'Active',
  founded: 'January 2024',
  description:
    "We're a competitive-social club focused on doubles rotational badminton. Open to all levels. We run weekly sessions with structured queuing managed by dedicated Que Masters.",
  stats: {
    members: 24,
    queMasters: 3,
    sessions: 12,
  },
  members: ['A', 'M', 'J', 'R', 'C'],
  totalMembers: 24,
  upcomingSessions: [
    { id: 's1', date: 'Saturday, Apr 12', time: '8:00 AM', venue: 'Hall B', slots: 12, total: 16 },
    { id: 's2', date: 'Saturday, Apr 19', time: '8:00 AM', venue: 'Hall B', slots: 8, total: 16 },
  ],
  owner: { name: 'Jose Buctuanon', initials: 'JB' },
  membershipStatus: 'owner',
}
