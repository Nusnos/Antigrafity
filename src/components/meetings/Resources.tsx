'use client';

import { Link as LinkIcon, FileText, Plus, Trash2, ExternalLink } from 'lucide-react';
import { addResource, deleteResource } from '@/lib/actions';

interface ResourcesProps {
    meetingId: string;
    resources: any[];
}

export default function Resources({ meetingId, resources }: ResourcesProps) {
    const addResourceWithId = addResource.bind(null, meetingId);

    return (
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Meeting Resources</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {resources.length === 0 ? (
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>No resources attached yet.</p>
                ) : (
                    resources.map((res) => (
                        <div key={res.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                background: 'var(--secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'calc(var(--radius) / 2)',
                            }}>
                                {res.type === 'LINK' ? <LinkIcon size={16} style={{ color: 'var(--primary)' }} /> : <FileText size={16} style={{ color: 'var(--primary)' }} />}
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{res.title}</span>
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                    >
                                        {res.url} <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteResource(meetingId, res.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--destructive)', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <form action={addResourceWithId} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        name="title"
                        required
                        placeholder="Resource Title (e.g. Design Doc)"
                        style={{ flex: 1, background: 'var(--background)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: 'calc(var(--radius) / 2)', color: 'white', fontSize: '0.875rem' }}
                    />
                    <select
                        name="type"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: 'calc(var(--radius) / 2)', color: 'white', fontSize: '0.875rem' }}
                    >
                        <option value="LINK">Link</option>
                        <option value="FILE">File</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        name="url"
                        required
                        type="url"
                        placeholder="URL (https://...)"
                        style={{ flex: 1, background: 'var(--background)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: 'calc(var(--radius) / 2)', color: 'white', fontSize: '0.875rem' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> Add
                    </button>
                </div>
            </form>
        </div>
    );
}
