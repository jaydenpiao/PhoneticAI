import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import Calendar from "./Calendar";

const EventsView = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState(null);
  const [tagStates, setTagStates] = useState([]);

  const STATUS_TYPES = {
    MEETING: "Meeting",
    TASK: "Task",
    FOLLOW_UP: "Follow-up",
    DEMO: "Demo",
    DEADLINE: "Deadline",
    SUPPORT: "Support",
  };

  useEffect(() => {
    // Simulate fetching events data
    const fetchEvents = async () => {
      // Replace with actual API call if needed
      const mockData = [
        {
          id: 1,
          name: "Team Meeting",
          type: STATUS_TYPES.MEETING,
          start_time: "2025-01-01T10:00:00",
          end_time: "2025-01-01T11:00:00",
          description: "Discuss project updates.",
          referenceNo: "REF001",
          numTasks: 3,
          siteType: "Remote",
        },
        {
          id: 2,
          name: "Customer Follow-Up",
          type: STATUS_TYPES.FOLLOW_UP,
          start_time: "2025-01-02T14:00:00",
          end_time: "2025-01-02T15:00:00",
          description: "Follow up with the client.",
          referenceNo: "REF002",
          numTasks: 1,
          siteType: "On-Site",
        },
      ];
      setEvents(mockData);
    };
    fetchEvents();
  }, [search]);

  useEffect(() => {
    setTagStates([
      {
        state: true,
        text: STATUS_TYPES.MEETING,
        colour: "#0d47a1",
      },
      {
        state: true,
        text: STATUS_TYPES.FOLLOW_UP,
        colour: "#ffa300",
      },
      {
        state: true,
        text: STATUS_TYPES.TASK,
        colour: "#238636",
      },
    ]);
  }, []);

  const renderTags = (date, currentYear, currentMonth) => {
    return events
      .filter((event) => {
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);

        const shouldShowTag = tagStates.find(
          (tagState) => tagState.state && tagState.text === event.type
        );

        const isStartDateBefore =
          startDate.getFullYear() < currentYear ||
          (startDate.getFullYear() === currentYear &&
            (startDate.getMonth() < currentMonth ||
              (startDate.getMonth() === currentMonth &&
                startDate.getDate() <= date)));

        const isEndDateAfter =
          endDate.getFullYear() > currentYear ||
          (endDate.getFullYear() === currentYear &&
            (endDate.getMonth() > currentMonth ||
              (endDate.getMonth() === currentMonth &&
                endDate.getDate() >= date)));

        return shouldShowTag && isStartDateBefore && isEndDateAfter;
      })
      .map((event, index) => (
        <Popover
          key={index}
          content={
            <div className="flex flex-col space-y-3 max-w-sm">
              {/* Event Title */}
              <h3 className="text-base font-bold text-blue-900">
                {event.name}
              </h3>

              {/* Date and Time */}
              <p className="text-sm text-gray-600">
                <strong>Start:</strong>{" "}
                {new Date(event.start_time).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">
                <strong>End:</strong>{" "}
                {new Date(event.end_time).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>

              {/* Event Description */}
              <div className="text-sm text-gray-700">
                <strong>Description:</strong>
                <p>{event.description}</p>
              </div>

              {/* Location */}
              <div className="text-sm text-gray-700">
                <strong>Location:</strong>
                <p>{event.siteType}</p>
              </div>

              {/* Number of Tasks */}
              <div className="text-sm text-gray-700">
                <strong>Tasks:</strong>
                <p>{event.numTasks} task(s)</p>
              </div>
            </div>
          }
        >
          <div className="flex items-center text-xs text-blue-900 cursor-pointer hover:underline">
            {event.name}
          </div>
        </Popover>
      ));
  };

  return (
    <div className="">
      <h2 className="m-4 text-3xl tracking-tight font-bold">Events</h2>
      <div className="p-8">
        <Calendar renderTags={renderTags} tagTypeStates={tagStates} />
      </div>
    </div>
  );
};

export default EventsView;
