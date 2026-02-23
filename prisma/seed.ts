import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Cleaning up database...');
    await prisma.resource.deleteMany();
    await prisma.note.deleteMany();
    await prisma.agendaItem.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.meeting.deleteMany();
    await prisma.tag.deleteMany();

    console.log('Seeding data...');

    // Create Tags
    const engineeringTag = await prisma.tag.create({ data: { name: 'Engineering' } });
    const productTag = await prisma.tag.create({ data: { name: 'Product' } });
    const designTag = await prisma.tag.create({ data: { name: 'Design' } });

    // 1. ACTIVE Meeting (In progress)
    const activeMeeting = await prisma.meeting.create({
        data: {
            title: 'Daily Standup - Engineering',
            status: 'ACTIVE',
            date: new Date(),
            time: new Date(),
            location: 'Zoom / Office Room 101',
            tags: { connect: [{ id: engineeringTag.id }] },
            agenda: {
                create: [
                    { title: 'Morning Highlights', isDone: true },
                    { title: 'Blockers Check', isDone: false },
                    { title: 'Deployment Plan', isDone: false },
                ],
            },
            participants: {
                create: [
                    { name: 'Alice Smith', email: 'alice@example.com', isPresent: true },
                    { name: 'Bob Johnson', email: 'bob@example.com', isPresent: true },
                    { name: 'Charlie Brown', email: 'charlie@example.com', isPresent: false },
                ],
            },
            notes: {
                create: [
                    { content: 'We decided to push the release to Wednesday to allow for more testing on the payment gateway.' },
                ],
            },
            resources: {
                create: [
                    { title: 'Deployment Roadmap', url: 'https://docs.google.com/roadmap', type: 'LINK' },
                    { title: 'Sprint Backlog', url: 'https://jira.com/project-123', type: 'LINK' },
                ],
            },
        },
    });

    // 2. UPCOMING Meeting
    const upcomingMeeting = await prisma.meeting.create({
        data: {
            title: 'Product Roadmap Review - Q3',
            status: 'UPCOMING',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            time: new Date(),
            location: 'Conference Hall',
            tags: { connect: [{ id: productTag.id }, { id: designTag.id }] },
            agenda: {
                create: [
                    { title: 'Review Q2 Achievements', isDone: false },
                    { title: 'Prioritize Feature Requests', isDone: false },
                    { title: 'Resource Allocation', isDone: false },
                ],
            },
            participants: {
                create: [
                    { name: 'Alice Smith', email: 'alice@example.com' },
                    { name: 'Eve White', email: 'eve@example.com' },
                ],
            },
        },
    });

    // 3. COMPLETED Meeting
    const completedMeeting = await prisma.meeting.create({
        data: {
            title: 'Mobile App UX Sync',
            status: 'COMPLETED',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            time: new Date(),
            location: 'Miro Board',
            tags: { connect: [{ id: designTag.id }] },
            agenda: {
                create: [
                    { title: 'Onboarding Flow Review', isDone: true },
                    { title: 'Review Iconography', isDone: true },
                ],
            },
            participants: {
                create: [
                    { name: 'Charlie Brown', email: 'charlie@example.com', isPresent: true },
                    { name: 'David Wilson', email: 'david@example.com', isPresent: true },
                ],
            },
            notes: {
                create: [
                    { content: 'All onboarding screens approved. David to finalize the vector files.' },
                ],
            },
        },
    });

    console.log(`Seeding complete: Created ${await prisma.meeting.count()} meetings.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
