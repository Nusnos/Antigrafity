import Link from 'next/link';

export default function Sidebar() {
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
                <h2 className="gradient-text" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
                    Meetings
                </h2>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/" style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius)',
                    background: 'var(--accent)',
                    color: 'white',
                    fontWeight: 600
                }}>
                    Dashboard
                </Link>
                <Link href="/history" style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius)',
                    color: 'var(--muted-foreground)',
                    transition: 'all 0.2s ease'
                }}>
                    History
                </Link>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)'
                    }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>My Account</span>
                </div>
            </div>
        </aside>
    );
}
