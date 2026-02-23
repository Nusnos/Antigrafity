'use client';

import { useState } from 'react';
import { updateMeetingTags } from '@/lib/actions';
import { X, Plus } from 'lucide-react';

interface TagEditorProps {
    meetingId: string;
    initialTags: any[];
}

export default function TagEditor({ meetingId, initialTags }: TagEditorProps) {
    const [tags, setTags] = useState(initialTags.map(t => t.name));
    const [newTag, setNewTag] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAddTag = async () => {
        if (!newTag.trim() || tags.includes(newTag.trim())) return;

        const updatedTags = [...tags, newTag.trim()];
        setTags(updatedTags);
        setNewTag('');

        setIsSaving(true);
        await updateMeetingTags(meetingId, updatedTags);
        setIsSaving(false);
    };

    const handleRemoveTag = async (tagName: string) => {
        const updatedTags = tags.filter(t => t !== tagName);
        setTags(updatedTags);

        setIsSaving(true);
        await updateMeetingTags(meetingId, updatedTags);
        setIsSaving(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {tags.length === 0 && <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>No tags assigned.</p>}
                {tags.map((tag) => (
                    <span
                        key={tag}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.3rem 0.6rem',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: 'var(--primary)',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        {tag}
                        <button
                            onClick={() => handleRemoveTag(tag)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, display: 'flex', opacity: 0.7 }}
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add category (e.g. Sales)..."
                    style={{ flex: 1, background: 'var(--background)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: 'calc(var(--radius) / 2)', color: 'white', fontSize: '0.875rem' }}
                />
                <button
                    onClick={handleAddTag}
                    disabled={isSaving}
                    className="btn-primary"
                    style={{ padding: '0.6rem' }}
                >
                    <Plus size={18} />
                </button>
            </div>
            {isSaving && <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>Syncing tags...</p>}
        </div>
    );
}
