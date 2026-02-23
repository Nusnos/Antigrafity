'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import { createMeeting } from '@/lib/actions';

interface NewMeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewMeetingModal({ isOpen, onClose }: NewMeetingModalProps) {
    const [agendaItems, setAgendaItems] = useState<string[]>(['']);
    const [participants, setParticipants] = useState<{ name: string; email: string }[]>([
        { name: '', email: '' }
    ]);

    const addAgendaItem = () => setAgendaItems([...agendaItems, '']);
    const removeAgendaItem = (index: number) => setAgendaItems(agendaItems.filter((_, i) => i !== index));

    const addParticipant = () => setParticipants([...participants, { name: '', email: '' }]);
    const removeParticipant = (index: number) => setParticipants(participants.filter((_, i) => i !== index));

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(4px)'
                    }}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        background: 'var(--card)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 1) 0.5'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Schedule Meeting</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>

                    <form action={async (formData) => {
                        await createMeeting(formData);
                        onClose();
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Title</label>
                            <input name="title" required placeholder="Strategic Planning Sync" style={{
                                background: 'var(--background)',
                                border: '1px solid var(--border)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'calc(var(--radius) / 2)',
                                color: 'white',
                                outline: 'none'
                            }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                    <input name="date" type="date" required style={{
                                        width: '100%',
                                        background: 'var(--background)',
                                        border: '1px solid var(--border)',
                                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                                        borderRadius: 'calc(var(--radius) / 2)',
                                        color: 'white',
                                        outline: 'none'
                                    }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Time</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                    <input name="time" type="time" required style={{
                                        width: '100%',
                                        background: 'var(--background)',
                                        border: '1px solid var(--border)',
                                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                                        borderRadius: 'calc(var(--radius) / 2)',
                                        color: 'white',
                                        outline: 'none'
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Location</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                <input name="location" placeholder="Google Meet" style={{
                                    width: '100%',
                                    background: 'var(--background)',
                                    border: '1px solid var(--border)',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: 'calc(var(--radius) / 2)',
                                    color: 'white',
                                    outline: 'none'
                                }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Tags / Categories</label>
                            <input name="tags" placeholder="Engineering, Project X, Quick Sync (comma separated)" style={{
                                background: 'var(--background)',
                                border: '1px solid var(--border)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'calc(var(--radius) / 2)',
                                color: 'white',
                                outline: 'none'
                            }} />
                        </div>

                        {/* Hidden inputs for agenda items */}
                        {agendaItems.map((item, idx) => (
                            <input key={`agenda-hidden-${idx}`} type="hidden" name="agendaItems" value={item} />
                        ))}

                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Agenda Items</label>
                                <button type="button" onClick={addAgendaItem} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                                    <Plus size={14} /> Add Item
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {agendaItems.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            placeholder={`Agenda item #${idx + 1}`}
                                            value={item}
                                            onChange={(e) => {
                                                const newItems = [...agendaItems];
                                                newItems[idx] = e.target.value;
                                                setAgendaItems(newItems);
                                            }}
                                            style={{
                                                flex: 1,
                                                background: 'var(--background)',
                                                border: '1px solid var(--border)',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: 'calc(var(--radius) / 4)',
                                                color: 'white',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                        {agendaItems.length > 1 && (
                                            <button type="button" onClick={() => removeAgendaItem(idx)} style={{ background: 'none', border: 'none', color: 'var(--destructive)', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Participants Section */}
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Participants</label>
                                <button type="button" onClick={addParticipant} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                                    <Plus size={14} /> Add Participant
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {participants.map((p, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <input
                                                placeholder="Name"
                                                value={p.name}
                                                onChange={(e) => {
                                                    const newP = [...participants];
                                                    newP[idx].name = e.target.value;
                                                    setParticipants(newP);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    background: 'var(--background)',
                                                    border: '1px solid var(--border)',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: 'calc(var(--radius) / 4)',
                                                    color: 'white',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            />
                                            <input
                                                placeholder="Email"
                                                value={p.email}
                                                onChange={(e) => {
                                                    const newP = [...participants];
                                                    newP[idx].email = e.target.value;
                                                    setParticipants(newP);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    background: 'var(--background)',
                                                    border: '1px solid var(--border)',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: 'calc(var(--radius) / 4)',
                                                    color: 'white',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            />
                                            <input type="hidden" name="participantNames" value={p.name} />
                                            <input type="hidden" name="participantEmails" value={p.email} />
                                        </div>
                                        {participants.length > 1 && (
                                            <button type="button" onClick={() => removeParticipant(idx)} style={{ background: 'none', border: 'none', color: 'var(--destructive)', cursor: 'pointer', alignSelf: 'center' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
                            Create Meeting
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
