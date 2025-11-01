import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

// Type definitions
interface EventItem {
  date: string;
  description: string;
}

interface HeatmapValue {
  date: string;
  count: number;
}

interface HeatmapProps {
  data: HeatmapValue[];
}

// Predefined important events
const predefinedEvents: EventItem[] = [
  { date: '2023-12-25', description: 'Christmas Holiday' },
  { date: '2024-01-01', description: 'New Year' },
];

const Heat: React.FC = () => {
  const [importantDates, setImportantDates] = useState<EventItem[]>([]);
  const [newDate, setNewDate] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [notifications, setNotifications] = useState<string[]>([]);

  const addDate = () => {
    if (newDate && newDescription) {
      setImportantDates([...importantDates, { date: newDate, description: newDescription }]);
      setNewDate('');
      setNewDescription('');
    }
  };

  // Notification checker
  useEffect(() => {
    const checkNotifications = () => {
      const today = new Date();
      const upcoming: string[] = [];

      importantDates.forEach((item) => {
        const date = new Date(item.date);
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 7) {
          upcoming.push(`Upcoming: ${item.description} on ${item.date}`);
        }
      });

      predefinedEvents.forEach((event) => {
        const date = new Date(event.date);
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 7) {
          upcoming.push(`Event: ${event.description} on ${event.date}`);
        }
      });

      setNotifications(upcoming);
    };

    checkNotifications();
  }, [importantDates]);

  // Prepare heatmap data
  const heatmapData: HeatmapValue[] = importantDates.reduce<HeatmapValue[]>((acc, item) => {
    const existing = acc.find((d) => d.date === item.date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date: item.date, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Student Notification Interface</h1>

      {/* Add Date Form */}
      <div>
        <h2>Add Important Date</h2>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description (e.g., Exam)"
        />
        <button onClick={addDate}>Add Date</button>
      </div>

      {/* Notifications */}
      <div>
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        ) : (
          <p>No upcoming notifications.</p>
        )}
      </div>

      {/* Heatmap */}
      <div>
        <h2>Student Date Heatmap</h2>
        <StudentDateHeatmap data={heatmapData} />
      </div>
    </div>
  );
};

const StudentDateHeatmap: React.FC<HeatmapProps> = ({ data }) => {
  return (
    <CalendarHeatmap
      startDate={new Date('2023-01-01')}
      endDate={new Date('2024-12-31')}
      values={data}
      classForValue={(value: HeatmapValue | null) => {
        if (!value) return 'color-empty';
        return `color-scale-${Math.min(value.count, 4)}`;
      }}
      tooltipDataAttrs={(value: HeatmapValue | null) => ({
        'data-tip': value?.date ? `${value.date}: ${value.count} important date(s)` : null,
      })}
      showWeekdayLabels
    />
  );
};

export default Heat;
