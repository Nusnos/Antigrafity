export default function Header() {
    return (
        <header style={{
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)'
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
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    + New Meeting
                </button>
            </div>
        </header>
    );
}
