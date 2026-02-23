import { getMeetings } from '@/lib/actions';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Search, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const allMeetings = await getMeetings();
    const pastMeetings = allMeetings.filter(m => m.status === 'COMPLETED' || m.status === 'CANCELLED');

    return (
        <div className="animate-fade-in" style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Meeting History
                    </h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Review your past discussions and decisions.</p>
                </div>

                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                    <input
                        type="text"
                        placeholder="Search meetings..."
                        style={{
                            background: 'var(--secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '2rem',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            color: 'white',
                            width: '300px',
                            outline: 'none',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {pastMeetings.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 0', color: 'var(--muted-foreground)' }}>
                        <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p>No past meetings found.</p>
                    </div>
                ) : (
                    pastMeetings.map((meeting) => (
                        <div key={meeting.id} className="glass card-hover" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    background: meeting.status === 'COMPLETED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 64, 64, 0.2)',
                                    color: meeting.status === 'COMPLETED' ? '#4ade80' : '#f87171',
                                    border: `1px solid ${meeting.status === 'COMPLETED' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 64, 64, 0.3)'}`
                                }}>
                                    {meeting.status}
                                </span>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>{meeting.title}</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--muted-foreground)', fontSize: '0.875rem', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={14} />
                                    <span>{new Date(meeting.date).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={14} />
                                    <span>{new Date(meeting.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {meeting.location && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={14} />
                                        <span>{meeting.location}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{meeting.participants.length} participants</span>
                                <Link
                                    href={`/meeting/${meeting.id}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        color: 'var(--primary)',
                                        fontSize: '0.875rem',
                                        fontWeight: 500
                                    }}
                                >
                                    View Summary <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
