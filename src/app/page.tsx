import { getMeetings, getAnalytics } from '@/lib/actions';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Play, TrendingUp, BarChart3, Users2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Meeting {
  id: string;
  title: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  date: Date;
  time: Date;
  location: string | null;
  participants: { id: string, name: string, email: string }[];
}

export default async function Home(props: { searchParams: Promise<{ tag?: string }> }) {
  const searchParams = await props.searchParams;
  const filterTag = searchParams.tag;

  const allMeetings = (await getMeetings()) as unknown as Meeting[];
  const analytics = await getAnalytics();

  // Extract unique tags for filtering
  const allTags = Array.from(new Set(allMeetings.flatMap(m => (m as any).tags?.map((t: any) => t.name) || []))).sort();

  const filteredMeetings = filterTag
    ? allMeetings.filter(m => (m as any).tags?.some((t: any) => t.name === filterTag))
    : allMeetings;

  const activeMeetings = filteredMeetings.filter((m: Meeting) => m.status === 'ACTIVE');
  const upcomingMeetings = filteredMeetings.filter((m: Meeting) => m.status === 'UPCOMING');

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      {/* System Insights - Priority Top */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden', borderLeft: '3px solid #4ade80' }}>
            <h4 style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Efficiency</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{analytics.efficiency}%</div>
            <p style={{ fontSize: '0.65rem', color: '#4ade80', marginTop: '0.25rem' }}>Agenda items done</p>
          </div>

          <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden', borderLeft: '3px solid #6366f1' }}>
            <h4 style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Time Invested</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{analytics.totalHours}h</div>
            <p style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>Across total schedule</p>
          </div>

          <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden', borderLeft: '3px solid #f8fafc' }}>
            <h4 style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Collaborators</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{analytics.collaborators}</div>
            <p style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>Unique participants</p>
          </div>
        </div>
      </section>

      {/* Tag Filtering Row */}
      <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            padding: '0.4rem 1rem',
            borderRadius: '2rem',
            background: !filterTag ? 'var(--primary)' : 'var(--secondary)',
            color: !filterTag ? 'white' : 'var(--muted-foreground)',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid var(--glass-border)'
          }}
        >
          All Meetings
        </Link>
        {allTags.map(tag => (
          <Link
            key={tag}
            href={`/?tag=${tag}`}
            style={{
              textDecoration: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '2rem',
              background: filterTag === tag ? 'var(--primary)' : 'rgba(99, 102, 241, 0.1)',
              color: filterTag === tag ? 'white' : 'var(--primary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* Active Meetings Section */}
      {activeMeetings.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }} className="animate-pulse" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Active Meetings</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {activeMeetings.map((meeting: Meeting) => (
              <div key={meeting.id} className="glass" style={{
                padding: '2rem',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                background: 'rgba(20, 20, 23, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#4ade80' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{meeting.title}</h3>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {(meeting as any).tags?.map((t: any) => (
                        <span key={t.id} style={{ fontSize: '0.6rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '0.4rem' }}>#{t.name}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', fontSize: '0.75rem', fontWeight: 600 }}>
                    IN PROGRESS
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', display: 'flex', gap: '1.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> Today</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> Started {formatTime(meeting.time)}</span>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem' }}>{meeting.participants.length} participants</span>
                  <Link
                    href={`/meeting/${meeting.id}`}
                    className="btn-primary"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none'
                    }}
                  >
                    Join Meeting <Play size={14} fill="white" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Meetings Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Upcoming Meetings</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            Showing {upcomingMeetings.length} meetings
          </span>
        </div>

        {upcomingMeetings.length === 0 && activeMeetings.length === 0 ? (
          <div className="glass" style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            background: 'var(--glass)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              border: '1px solid var(--glass-border)'
            }}>
              📅
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No meetings found</h3>
              <p style={{ color: 'var(--muted-foreground)', maxWidth: '400px', margin: '0 auto' }}>
                {filterTag ? `No meetings tagged with "${filterTag}".` : "Your schedule is clear! Use the **+ New Meeting** button in the header to organize your next discussion."}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {upcomingMeetings.map((meeting: Meeting) => (
              <div key={meeting.id} className="glass card-hover" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{meeting.title}</h3>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {(meeting as any).tags?.map((t: any) => (
                        <span key={t.id} style={{ fontSize: '0.6rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '0.4rem' }}>#{t.name}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '0.25rem 0.6rem', borderRadius: '0.5rem', background: 'var(--secondary)', fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                    {meeting.location || 'Remote'}
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} />
                    <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} />
                    <span>{formatTime(meeting.time)}</span>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', marginLeft: '0.25rem' }}>
                      {meeting.participants.slice(0, 3).map((p: any, i: number) => (
                        <div key={p.id} style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--background)',
                          border: '2px solid var(--card)',
                          marginLeft: i === 0 ? 0 : '-8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6rem',
                          fontWeight: 700
                        }}>
                          {p.name.charAt(0)}
                        </div>
                      ))}
                      {meeting.participants.length > 3 && (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--secondary)',
                          border: '2px solid var(--card)',
                          marginLeft: '-8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6rem'
                        }}>
                          +{meeting.participants.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link href={`/meeting/${meeting.id}`} style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>Details →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
