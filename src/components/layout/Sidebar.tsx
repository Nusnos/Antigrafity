'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, User, Settings } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'History', href: '/history', icon: History },
    ];

    return (
        <aside className="glass" style={{
            width: '260px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1.5rem',
            position: 'sticky',
            top: 0
        }}>
            <div style={{ marginBottom: '3rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em', fontWeight: 700 }}>
                    Meetings
                </h2>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius)',
                                background: isActive ? 'var(--accent)' : 'transparent',
                                color: isActive ? 'white' : 'var(--muted-foreground)',
                                fontWeight: isActive ? 600 : 400,
                                transition: 'all 0.2s ease',
                                textDecoration: 'none'
                            }}
                            className={!isActive ? 'card-hover' : ''}
                        >
                            <Icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        color: 'white',
                        fontWeight: 600
                    }}>
                        TS
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Twan Schraven</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Pro Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
