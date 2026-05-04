import { sendEmail } from "#utils/mailer";
import {
  getTasksDueSoonForReminder,
  markReminderSent,
} from "#db/queries/qTasks";

// return number of reminders sent

export async function runTaskReminders() {
  const tasks = await getTasksDueSoonForReminder();
  for (let task of tasks) {
    const due = new Date(task.due_date).toDateString();
    await sendEmail({
      to: task.reminder_email,
      subject: `Task due soon: ${task.name}`,
      text: `Hi ${task.reminder_username}, your task "${task.name}" is due on ${due}`,
      html: `<p>Hi, ${task.reminder_username}, </p>
      <p>Your task <strong>${task.name}</strong> is due on <strong>${due}</strong>.</p>`,
    });
    await markReminderSent(task.id);
  }
  return tasks.length;
}
