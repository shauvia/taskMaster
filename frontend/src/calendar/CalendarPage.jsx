import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getTasks, getAssignedTasks } from "../api/apiTasks";

// Calendar — the actual visual calendar component
// dateFnsLocalizer — a bridge that tells react-big-calendar how to handle dates using date-fns
// format, parse, startOfWeek, getDay — date-fns tools the localizer needs internally (formatting labels, figuring out which day starts the week, etc.)
// enUS — English locale (month names, day names in English)
// The CSS import — without this the calendar renders with no styling at all

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

//once outside the component (not inside) so it doesn't get recreated on every render. Think of it as the calendar's "language settings".

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // State to track the selected task
  const [ownTasks, setOwnTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      const [ownTasks, assignedTasks] = await Promise.all([
        getTasks(),
        getAssignedTasks(),
      ]);
      // Promise.all fires both API calls at the same time
      // instead of waiting for one to finish before starting the other — faster.

      setOwnTasks(ownTasks);
      setAssignedTasks(assignedTasks);

      const allTasks = [...ownTasks, ...assignedTasks];

      const seen = new Set();
      const uniqueTasks = allTasks.filter((task) => {
        if (seen.has(task.id)) return false;
        seen.add(task.id);
        return true;
      });
      const calendarEvents = uniqueTasks
        .filter((task) => task.due_date)
        .map((task) => ({
          id: task.id,
          title: task.name, // text shown on the calendar block
          start: new Date(task.due_date), // when the event appears
          end: new Date(task.due_date), // same as start = single-day event
          resource: task, // full task object stored for later use
        }));
      setEvents(calendarEvents);
    }
    loadTasks();
  }, []);

  return (
    <div className="calendar-container">
      <h2>Task Calendar</h2>
      <div className="calendar-layout">
        {" "}
        {/* new flex row wrapper */}
        <div className="calendar-main">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor={"start"}
            endAccessor="end"
            onSelectEvent={(event) => {
              setSelectedTask(event.resource); // event.resource is the full task object you stored when mapping — resource: task
            }}
            drilldownView={null} // drilldownView is a separate prop that disables zooming into the day view when you click a date number.
            style={{ height: 600 }}
          />
        </div>
        <div className="calendar-sidebar">
          <h3>My Tasks</h3>
          {ownTasks.map((task) => (
            <div
              key={task.id}
              className="sidebar-task-item"
              onClick={() => setSelectedTask(task)}
            >
              <p>{task.name}</p>
              {task.due_date && (
                <p className="task-date">
                  {format(new Date(task.due_date), "MMMM dd")}
                </p>
              )}
            </div>
          ))}
          <h3>Assigned to Me</h3>
          {assignedTasks.map((task) => (
            <div
              key={task.id}
              className="sidebar-task-item"
              onClick={() => setSelectedTask(task)}
            >
              <p>{task.name}</p>
              {task.due_date && (
                <p className="task-date">
                  {format(new Date(task.due_date), "MMMM dd")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedTask && (
        <div className="task-detail-panel">
          <h3>{selectedTask.name}</h3>
          <p>{selectedTask.description}</p>
          <p>Due: {format(new Date(selectedTask.due_date), "MMMM dd, yyyy")}</p>
          <button onClick={() => setSelectedTask(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
