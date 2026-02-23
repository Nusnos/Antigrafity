'use server'

import prisma from './db';
import { revalidatePath } from 'next/cache';

export async function getMeetings() {
    try {
        const meetings = await prisma.meeting.findMany({
            orderBy: {
                date: 'asc',
            },
            include: {
                participants: true,
                agenda: true,
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
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;

    try {
        await prisma.meeting.create({
            data: {
                title,
                date: new Date(date),
                time,
                location,
            },
        });
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to create meeting:', error);
    }
}
