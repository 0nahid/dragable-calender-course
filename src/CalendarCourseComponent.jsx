import { Calendar, Card } from "antd";
import React, { useState } from "react";
import "./DragAndDropCalendar.css";

const DragAndDropCalendar = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: "Math 101" },
    { id: 2, name: "History 201" },
  ]);
  const [calendarEvents, setCalendarEvents] = useState({});

  const handleDateCellRender = (value) => {
    const dateString = value.format("YYYY-MM-DD");
    return (
      <div
        className="droppable-area"
        onDrop={(e) => handleDrop(e, dateString)}
        onDragOver={(e) => e.preventDefault()}
      >
        {calendarEvents[dateString]?.map((course, index) => (
          <Card key={index} size="small">
            {course.name}
          </Card>
        ))}
      </div>
    );
  };

  const handleDrop = (e, dateString) => {
    e.preventDefault();
    const courseId = parseInt(e.dataTransfer.getData("courseId"));
    const course = courses.find((c) => c.id === courseId);

    if (course) {
      setCalendarEvents((prevEvents) => ({
        ...prevEvents,
        [dateString]: [...(prevEvents[dateString] || []), course],
      }));
    }
  };

  return (
    <div className="container">
      <div className="src-column">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="draggable-course"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("courseId", course.id.toString())
            }
          >
            {course.name}
          </Card>
        ))}
      </div>
      <div className="playground-column">
        <Calendar dateCellRender={handleDateCellRender} />
      </div>
    </div>
  );
};

export default DragAndDropCalendar;
