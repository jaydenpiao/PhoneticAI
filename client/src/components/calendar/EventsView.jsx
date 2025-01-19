import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import Calendar from "./Calendar";
import axios from "axios";

const EventsView = () => {
  const [events, setEvents] = useState([]);
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
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/events");
        console.log(response.data);
        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          name: event.name,
          type: event.type,
          start_time: event.start_time,
          end_time: event.end_time,
          description: `${event.type}`,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    setTagStates([
      { state: true, text: STATUS_TYPES.MEETING, colour: "#0d47a1" },
      { state: true, text: STATUS_TYPES.FOLLOW_UP, colour: "#ffa300" },
      { state: true, text: STATUS_TYPES.TASK, colour: "#238636" },
      { state: true, text: STATUS_TYPES.DEMO, colour: "#673ab7" },
      { state: true, text: STATUS_TYPES.DEADLINE, colour: "#f44336" },
      { state: true, text: STATUS_TYPES.SUPPORT, colour: "#009688" },
    ]);
  }, []);

  const renderTags = (date, currentYear, currentMonth, tagTypeStates) => {
    return events
      .filter((event) => {
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);

        const tagState = tagTypeStates.find(
          (tag) => tag.text === event.type && tag.state
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

        return tagState && isStartDateBefore && isEndDateAfter;
      })
      .map((event, index) => {
        const tagState = tagTypeStates.find((tag) => tag.text === event.type);
        const color = tagState ? tagState.colour : "#ccc";

        return (
          <Popover
            key={index}
            overlayStyle={{ width: "300px" }}
            content={
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {event.name}
                </h3>
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
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {event.siteType}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Description:</strong> {event.description}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tasks:</strong> {event.numTasks} task(s)
                </p>
              </div>
            }
          >
            <div
              className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700 font-medium cursor-pointer hover:bg-gray-300"
              style={{
                backgroundColor: color,
                color: "#fff",
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {event.name}
            </div>
          </Popover>
        );
      });
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-md min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      <Calendar renderTags={renderTags} tagTypeStates={tagStates} />
    </div>
  );
};

export default EventsView;
