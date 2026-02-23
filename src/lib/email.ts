import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMeetingInvite(email: string, participantName: string, meetingTitle: string, date: string, time: string, location: string | null) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Meeting Tool <onboarding@resend.dev>',
      to: email,
      subject: `Invitation: ${meetingTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0c; color: #f8fafc; padding: 2rem; border-radius: 0.75rem;">
          <h1 style="color: #6366f1;">New Meeting Invitation</h1>
          <p>Hi ${participantName},</p>
          <p>You've been invited to a new meeting: <strong>${meetingTitle}</strong></p>
          
          <div style="background-color: #141417; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0; border: 1px solid #27272a;">
            <p style="margin: 0.5rem 0;">📅 <strong>Date:</strong> ${date}</p>
            <p style="margin: 0.5rem 0;">⏰ <strong>Time:</strong> ${time}</p>
            <p style="margin: 0.5rem 0;">📍 <strong>Location:</strong> ${location || 'Remote'}</p>
          </div>
          
          <p>We look forward to seeing you there!</p>
          <hr style="border: none; border-top: 1px solid #27272a; margin: 2rem 0;">
          <p style="font-size: 0.875rem; color: #94a3b8;">This is an automated notification from your Meeting Management Tool.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendMeetingSummary(email: string, participantName: string, meetingTitle: string, agenda: any[], notes: string) {
  try {
    const completedItems = agenda.filter(item => item.isDone).length;
    const totalItems = agenda.length;

    const { data, error } = await resend.emails.send({
      from: 'Meeting Tool <onboarding@resend.dev>',
      to: email,
      subject: `Meeting Summary: ${meetingTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0c; color: #f8fafc; padding: 2rem; border-radius: 0.75rem;">
          <h1 style="color: #6366f1;">Meeting Summary</h1>
          <p>Hi ${participantName},</p>
          <p>Here is the summary for the meeting: <strong>${meetingTitle}</strong></p>
          
          <div style="background-color: #141417; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0; border: 1px solid #27272a;">
            <h3 style="color: #94a3b8; margin-top: 0;">Captured Notes</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${notes || 'No notes were recorded during this meeting.'}</p>
          </div>

          <div style="background-color: #141417; padding: 1.5rem; border-radius: 0.5rem; margin: 2rem 0; border: 1px solid #27272a;">
            <h3 style="color: #94a3b8; margin-top: 0;">Agenda Completion</h3>
            <p>${completedItems} of ${totalItems} items completed.</p>
            <ul style="padding-left: 1.25rem;">
              ${agenda.map(item => `
                <li style="margin-bottom: 0.5rem; color: ${item.isDone ? '#4ade80' : '#94a3b8'};">
                  ${item.isDone ? '✓' : '○'} ${item.title}
                </li>
              `).join('')}
            </ul>
          </div>
          
          <p style="font-size: 0.875rem; color: #94a3b8; margin-top: 3rem;">Review all meeting details in your dashboard.</p>
        </div>
      `,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
