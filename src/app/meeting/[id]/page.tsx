import { getMeetingById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import MeetingDetailsClient from '@/components/meetings/MeetingDetailsClient';

interface MeetingPageProps {
    params: Promise<{ id: string }>;
}

export default async function MeetingPage({ params }: MeetingPageProps) {
    const { id } = await params;
    const meeting = await getMeetingById(id);

    if (!meeting) {
        notFound();
    }

    // Cast or pass directly - our client component will handle the props
    return <MeetingDetailsClient meeting={meeting} />;
}
