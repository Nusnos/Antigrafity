'use server'

import prisma from './db';
import { revalidatePath } from 'next/cache';
import { sendMeetingInvite, sendMeetingSummary } from './email';

// Import Status from Prisma Client
// (It will be available after prisma generate)

export async function getMeetings() {
    try {
        const meetings = await prisma.meeting.findMany({
            orderBy: {
                date: 'asc',
            },
            include: {
                participants: true,
                agenda: true,
                tags: true,
            },
        });
        return meetings;
    } catch (error) {
        console.error('Failed to fetch meetings:', error);
        return [];
    }
}

export async function createMeeting(formData: FormData) {
    const title = formData.get('title') as string;
    const dateStr = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const tagsStr = formData.get('tags') as string || '';
    const tagNames = tagsStr.split(',').map(t => t.trim()).filter(t => t !== '');

    const agendaItems = formData.getAll('agendaItems') as string[];
    const participantNames = formData.getAll('participantNames') as string[];
    const participantEmails = formData.getAll('participantEmails') as string[];

    const date = new Date(dateStr);
    // Combine date and time for a full DateTime that Prisma can slice for @db.Time
    const timeDate = new Date(`${dateStr}T${time}:00`);

    try {
        const meeting = await prisma.meeting.create({
            data: {
                title,
                date,
                time: timeDate,
                location,
                tags: {
                    connectOrCreate: tagNames.map(name => ({
                        where: { name },
                        create: { name }
                    }))
                },
                agenda: {
                    create: agendaItems.filter(item => item.trim() !== '').map(item => ({
                        title: item,
                    })),
                },
                participants: {
                    create: participantNames.map((name, idx) => ({
                        name,
                        email: participantEmails[idx],
                    })).filter(p => p.name.trim() !== '' || p.email.trim() !== ''),
                },
            },
            include: {
                participants: true,
            },
        });

        // Send invitations
        for (const p of meeting.participants) {
            await sendMeetingInvite(
                p.email,
                p.name || 'Participant',
                meeting.title,
                meeting.date.toLocaleDateString(),
                meeting.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                meeting.location
            );
        }

        revalidatePath('/');
    } catch (error) {
        console.error('Failed to create meeting:', error);
    }
}

export async function getMeetingById(id: string) {
    try {
        const meeting = await prisma.meeting.findUnique({
            where: { id },
            include: {
                participants: true,
                agenda: true,
                resources: true,
                tags: true,
                notes: true,
            },
        });
        return meeting;
    } catch (error) {
        console.error('Failed to fetch meeting:', error);
        return null;
    }
}

export async function toggleAgendaItem(id: string, completed: boolean) {
    try {
        await prisma.agendaItem.update({
            where: { id },
            data: { isDone: completed },
        });
        revalidatePath(`/meeting/${id}`);
    } catch (error) {
        console.error('Failed to toggle agenda item:', error);
    }
}

export async function toggleParticipantAttendance(meetingId: string, participantId: string, present: boolean) {
    try {
        await prisma.participant.update({
            where: { id: participantId },
            data: { isPresent: present },
        });
        revalidatePath(`/meeting/${meetingId}`);
    } catch (error) {
        console.error('Failed to toggle attendance:', error);
    }
}

export async function addAgendaItem(meetingId: string, formData: FormData) {
    const title = formData.get('title') as string;
    if (!title) return;

    try {
        await prisma.agendaItem.create({
            data: {
                meetingId,
                title,
            },
        });
        revalidatePath(`/meeting/${meetingId}`);
    } catch (error) {
        console.error('Failed to add agenda item:', error);
    }
}

export async function deleteAgendaItem(meetingId: string, id: string) {
    try {
        await prisma.agendaItem.delete({
            where: { id },
        });
        revalidatePath(`/meeting/${meetingId}`);
    } catch (error) {
        console.error('Failed to delete agenda item:', error);
    }
}

export async function addParticipant(meetingId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    if (!name || !email) return;

    try {
        await prisma.participant.create({
            data: {
                meetingId,
                name,
                email,
            },
        });
        revalidatePath(`/meeting/${meetingId}`);
    } catch (error) {
        console.error('Failed to add participant:', error);
    }
}

export async function deleteParticipant(meetingId: string, id: string) {
    try {
        await prisma.participant.delete({
            where: { id },
        });
        revalidatePath(`/meeting/${meetingId}`);
    } catch (error) {
        console.error('Failed to delete participant:', error);
    }
}

export async function updateMeetingStatus(id: string, status: any) {
    try {
        await prisma.meeting.update({
            where: { id },
            data: { status },
        });
        revalidatePath(`/meeting/${id}`);
        revalidatePath('/');
        revalidatePath('/history');
    } catch (error) {
        console.error('Failed to update meeting status:', error);
    }
}

export async function updateNotes(meetingId: string, content: string) {
    try {
        const existingNote = await prisma.note.findFirst({ where: { meetingId } });
        if (existingNote) {
            await prisma.note.update({
                where: { id: existingNote.id },
                data: { content },
            });
        } else {
            await prisma.note.create({
                data: { meetingId, content },
            });
        }
    } catch (error) {
        console.error('Failed to update notes:', error);
    }
}

export async function sendSummaryEmail(meetingId: string) {
    try {
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: {
                participants: true,
                agenda: true,
                notes: true,
            },
        });

        if (!meeting) return;

        const notesContent = meeting.notes?.[0]?.content || '';

        for (const p of meeting.participants) {
            await sendMeetingSummary(
                p.email,
                p.name,
                meeting.title,
                meeting.agenda,
                notesContent
            );
        }
    } catch (error) {
        console.error('Failed to send summary emails:', error);
    }
}

export async function addResource(meetingId: string, formData: FormData) {
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string || 'LINK';

    try {
        await prisma.resource.create({
            data: {
                meetingId,
                title,
                url,
                type,
            },
        });
        revalidatePath(`/meeting/${meetingId}`);
    } catch (error) {
        console.error('Failed to add resource:', error);
    }
}

export async function deleteResource(meetingId: string, id: string) {
    try {
        await prisma.resource.delete({
            where: { id },
        });
        revalidatePath(`/meeting/${meetingId}`);
    } catch (error) {
        console.error('Failed to delete resource:', error);
    }
}

export async function updateMeetingTags(meetingId: string, tagNames: string[]) {
    try {
        // First disconnect all current tags
        await prisma.meeting.update({
            where: { id: meetingId },
            data: {
                tags: { set: [] }
            }
        });

        // Upsert each tag and connect it
        for (const name of tagNames) {
            if (!name.trim()) continue;
            await prisma.meeting.update({
                where: { id: meetingId },
                data: {
                    tags: {
                        connectOrCreate: {
                            where: { name: name.trim() },
                            create: { name: name.trim() }
                        }
                    }
                }
            });
        }
        revalidatePath(`/meeting/${meetingId}`);
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to update tags:', error);
    }
}

export async function getAnalytics() {
    try {
        const meetings = await prisma.meeting.findMany({
            include: {
                agenda: true,
                participants: true,
            },
        });

        const totalAgendaItems = meetings.reduce((acc: number, m: any) => acc + m.agenda.length, 0);
        const completedAgendaItems = meetings.reduce((acc: number, m: any) => acc + m.agenda.filter((a: any) => a.isDone).length, 0);

        const efficiency = totalAgendaItems > 0
            ? Math.round((completedAgendaItems / totalAgendaItems) * 100)
            : 0;

        const totalMeetings = meetings.length;
        const totalHours = totalMeetings * 1; // Assuming 1h per meeting for simplicity

        const allParticipantsCount = await prisma.participant.count();

        return {
            efficiency,
            totalHours,
            collaborators: allParticipantsCount,
        };
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
        return { efficiency: 0, totalHours: 0, collaborators: 0 };
    }
}
