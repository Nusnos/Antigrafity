import { getMeetings, createMeeting } from '@/lib/actions';

export const dynamic = 'force-dynamic';

interface Meeting {
  id: string;
  title: string;
  date: Date | string;
  time: Date | string;
  location: string | null;
  participants: any[];
}

export default async function Home() {
  const meetings: Meeting[] = await getMeetings();

  return (
    <div>
      <section style={{ marginBottom: '4rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Schedule New Meeting</h2>
          <form action={createMeeting} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Title</label>
              <input name="title" required placeholder="Project Sync" style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Date</label>
              <input name="date" type="date" required style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Time</label>
              <input name="time" type="time" required style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Location</label>
              <input name="location" placeholder="Google Meet" style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Schedule Meeting</button>
            </div>
          </form>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Upcoming Meetings</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            Showing {meetings.length} meetings
          </span>
        </div>

        {meetings.length === 0 ? (
          <div className="glass" style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              📅
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>No meetings scheduled</h3>
              <p style={{ color: 'var(--muted-foreground)', maxWidth: '300px' }}>
                You haven't added any meetings yet. Use the form above to get started.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {meetings.map((meeting) => (
              <div key={meeting.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.125rem' }}>{meeting.title}</h3>
                  <div style={{ padding: '0.25rem 0.5rem', borderRadius: '0.5rem', background: 'var(--secondary)', fontSize: '0.75rem' }}>
                    {meeting.location || 'Remote'}
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', display: 'flex', gap: '1rem' }}>
                  <span>📅 {new Date(meeting.date).toLocaleDateString()}</span>
                  <span>⏰ {new Date(meeting.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem' }}>{meeting.participants.length} participants</span>
                  <button style={{ color: 'var(--primary)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>View Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Activity</h2>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            No recent activity to show.
          </p>
        </div>
      </section>
    </div>
  );
}
