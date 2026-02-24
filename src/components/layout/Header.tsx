'use client';

import { useState } from 'react';
import NewMeetingModal from '../modals/NewMeetingModal';

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <header style={{
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--glass-border)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem' }}>Welcome back!</h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                        Manage your meetings and agenda items efficiently.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="glass" style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.875rem'
                    }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <button
                        className="btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        + New Meeting
                    </button>
                </div>
            </header>
            <NewMeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
