'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, Circle, User, Mail, Plus, Trash2, ArrowLeft, Play, CheckCheck, Ban, Save, Tag as TagIcon, Users } from 'lucide-react';
import {
    toggleAgendaItem,
    toggleParticipantAttendance,
    addAgendaItem,
    deleteAgendaItem,
    addParticipant,
    deleteParticipant,
    updateMeetingStatus,
    updateNotes,
    sendSummaryEmail,
    updateMeetingTags
} from '@/lib/actions';
import Link from 'next/link';
import Resources from './Resources';
import TagEditor from './TagEditor';

interface MeetingDetailsClientProps {
    meeting: any;
}

export default function MeetingDetailsClient({ meeting }: MeetingDetailsClientProps) {
    const [notes, setNotes] = useState(meeting.notes?.[0]?.content || '');
    const [isSaving, setIsSaving] = useState(false);

    // Debounced auto-save for notes
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (notes !== (meeting.notes?.[0]?.content || '')) {
                setIsSaving(true);
                await updateNotes(meeting.id, notes);
                setIsSaving(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [notes, meeting.id, meeting.notes]);

    const addAgendaWithId = addAgendaItem.bind(null, meeting.id);
    const addParticipantWithId = addParticipant.bind(null, meeting.id);

    const getStatusColor = () => {
        switch (meeting.status) {
            case 'ACTIVE': return '#4ade80';
            case 'COMPLETED': return '#6366f1';
            case 'CANCELLED': return '#f87171';
            default: return 'var(--muted-foreground)';
        }
    };

    return (
        <div className="animate-fade-in" style={{ padding: '1rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', marginBottom: '2rem', fontSize: '0.875rem', textDecoration: 'none' }}>
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {meeting.title}
                        </h1>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            background: `${getStatusColor()}20`,
                            color: getStatusColor(),
                            border: `1px solid ${getStatusColor()}40`,
                            fontWeight: 600
                        }}>
                            {meeting.status}
                        </span>

                        {/* Real-time Presence Mockup */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '1rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} className="animate-pulse" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Users size={12} /> 3 viewing
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', color: 'var(--muted-foreground)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={18} />
                            <span>{new Date(meeting.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={18} />
                            <span>{new Date(meeting.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {meeting.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={18} />
                                <span>{meeting.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Control Panel */}
                <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius)', display: 'flex', gap: '0.75rem' }}>
                    {meeting.status === 'UPCOMING' && (
                        <button
                            onClick={() => updateMeetingStatus(meeting.id, 'ACTIVE')}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem' }}
                        >
                            <Play size={16} fill="white" /> Start Meeting
                        </button>
                    )}
                    {meeting.status === 'ACTIVE' && (
                        <button
                            onClick={async () => {
                                await updateMeetingStatus(meeting.id, 'COMPLETED');
                                await sendSummaryEmail(meeting.id);
                            }}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: '#4ade80', border: 'none' }}
                        >
                            <CheckCheck size={16} /> Complete Meeting
                        </button>
                    )}
                    {(meeting.status === 'UPCOMING' || meeting.status === 'ACTIVE') && (
                        <button
                            onClick={() => updateMeetingStatus(meeting.id, 'CANCELLED')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'rgba(239, 64, 64, 0.1)', color: '#f87171', border: '1px solid rgba(239, 64, 64, 0.2)', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                        >
                            <Ban size={16} /> Cancel
                        </button>
                    )}
                    {(meeting.status === 'COMPLETED' || meeting.status === 'CANCELLED') && (
                        <button
                            onClick={() => updateMeetingStatus(meeting.id, 'UPCOMING')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'var(--secondary)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                        >
                            Re-open Meeting
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Note-taking Section */}
                    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Meeting Notes</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>
                                {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save size={12} /> Saved</>}
                            </div>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Capture decisions, action items, and discussion points..."
                            style={{
                                flex: 1,
                                width: '100%',
                                minHeight: '300px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'calc(var(--radius) / 2)',
                                padding: '1.5rem',
                                color: 'white',
                                lineHeight: '1.6',
                                resize: 'none',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Agenda Section */}
                    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Agenda Items</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {meeting.agenda.length === 0 ? (
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>No agenda items listed.</p>
                            ) : (
                                meeting.agenda.map((item: any) => (
                                    <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <button
                                                onClick={() => toggleAgendaItem(item.id, !item.isDone)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    padding: '0.75rem 1rem',
                                                    background: 'var(--secondary)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: 'calc(var(--radius) / 2)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                {item.isDone ? (
                                                    <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                                                ) : (
                                                    <Circle size={18} style={{ color: 'var(--muted-foreground)' }} />
                                                )}
                                                <span style={{
                                                    flex: 1,
                                                    color: item.isDone ? 'var(--muted-foreground)' : 'white',
                                                    textDecoration: item.isDone ? 'line-through' : 'none',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {item.title}
                                                </span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => deleteAgendaItem(meeting.id, item.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--destructive)', cursor: 'pointer', padding: '0.5rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <form action={addAgendaWithId} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                name="title"
                                required
                                placeholder="Add new agenda item..."
                                style={{
                                    flex: 1,
                                    background: 'var(--background)',
                                    border: '1px solid var(--border)',
                                    padding: '0.6rem 0.8rem',
                                    borderRadius: 'calc(var(--radius) / 2)',
                                    color: 'white',
                                    fontSize: '0.875rem'
                                }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '0.6rem' }}><Plus size={18} /></button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Participants, Resources, Tags */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Participants Section */}
                    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Participants & Attendance</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {meeting.participants.length === 0 ? (
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>No participants invited yet.</p>
                            ) : (
                                meeting.participants.map((p: any) => (
                                    <div key={p.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <button
                                                onClick={() => toggleParticipantAttendance(meeting.id, p.id, !p.isPresent)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.75rem 1rem',
                                                    background: 'var(--secondary)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: 'calc(var(--radius) / 2)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.name}</span>
                                                        <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{p.email}</span>
                                                    </div>
                                                </div>
                                                <div style={{
                                                    padding: '0.15rem 0.5rem',
                                                    borderRadius: '1rem',
                                                    fontSize: '0.7rem',
                                                    background: p.isPresent ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                                    color: p.isPresent ? 'var(--primary)' : 'var(--muted-foreground)',
                                                    border: p.isPresent ? '1px solid var(--primary)' : '1px solid var(--glass-border)'
                                                }}>
                                                    {p.isPresent ? 'Present' : 'Absent'}
                                                </div>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => deleteParticipant(meeting.id, p.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--destructive)', cursor: 'pointer', padding: '0.5rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <form action={addParticipantWithId} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input name="name" required placeholder="Name" style={{ flex: 1, background: 'var(--background)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: 'calc(var(--radius) / 2)', color: 'white', fontSize: '0.875rem' }} />
                                <input name="email" type="email" required placeholder="Email" style={{ flex: 1, background: 'var(--background)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: 'calc(var(--radius) / 2)', color: 'white', fontSize: '0.875rem' }} />
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '0.6rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Plus size={18} /> Add Participant
                            </button>
                        </form>
                    </div>

                    {/* Tags Section */}
                    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <TagIcon size={18} />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Categorization</h2>
                        </div>
                        <TagEditor meetingId={meeting.id} initialTags={meeting.tags || []} />
                    </div>

                    {/* Resources Section */}
                    <Resources meetingId={meeting.id} resources={meeting.resources || []} />
                </div>
            </div>
        </div>
    );
}
