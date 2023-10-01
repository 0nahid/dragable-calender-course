import { Button, Calendar, Card, Form, Input, Modal, TimePicker } from "antd";
import moment from "moment/moment";
import React, { useState } from "react";
import "./DragAndDropCalendar.css";
const myDate = moment(); // Create a Moment.js object
myDate.locale("en"); // Correct
const DragAndDropCalendar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editedCourseName, setEditedCourseName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseTime, setCourseTime] = useState([]);
  const [courseAmount, setCourseAmount] = useState(0);
  const [courseTags, setCourseTags] = useState([]);

  const [editedCourseTitle, setEditedCourseTitle] = useState("");
  const [editedCourseDescription, setEditedCourseDescription] = useState("");
  const [editedCourseTime, setEditedCourseTime] = useState([]);

  const [editedCourseAmount, setEditedCourseAmount] = useState(0);
  const [editedCourseTags, setEditedCourseTags] = useState([]);
  const showModal = (course) => {

    if (course) {
      const { name, title, description, time, amount, tags } = course;
      if (typeof time === 'string') {
        setSelectedCourse(course);
        setEditedCourseName(name);
        setEditedCourseTitle(title);
        setEditedCourseDescription(description);
        
       const formatTime = time.split(" - ").map((t) => moment(t, "hh:mm A"));
        console.log("Format time:", formatTime);
  
        setEditedCourseTime(formatTime);
        setEditedCourseAmount(amount);
        setEditedCourseTags(tags);
      }
      
    } else {
      console.warn("Undefined or null course object received"); // Debug line
    }

    setIsModalVisible(true);
  };

  const handleUpdateCourse = () => {
    const updatedCourses = courses.map((course) => {
      if (course.id === selectedCourse.id) {
        return {
          ...course,
          name: editedCourseName,
          title: editedCourseTitle,
          description: editedCourseDescription,
          time: editedCourseTime,
          amount: editedCourseAmount,
          tags: editedCourseTags,
        };
      }
      return course;
    });
    setCourses(updatedCourses);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Math 101",
      title: "Advanced Math",
      description: "Algebra and Geometry",
      time: "10:00 AM - 12:00 AM",
      amount: 100,
      tags: ["math", "algebra"],
    },
    // ... other courses
  ]);

  const addCourse = () => {
    const formatTime = `${courseTime[0].format(
      "hh:mm A"
    )} - ${courseTime[1].format("hh:mm A")}`;

    const newCourse = {
      id: Date.now(),
      name: courseName,
      title: courseTitle,
      description: courseDescription,
      time: formatTime,
      amount: courseAmount,
      tags: courseTags,
    };
    // console.log("New course:", newCourse);
    setCourses([...courses, newCourse]);
    setCourseName("");
    setCourseTitle("");
    setCourseDescription("");
    setCourseTime([]);
    setCourseAmount(0);
    setCourseTags([]);
  };

  const [calendarEvents, setCalendarEvents] = useState({});
  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "3px",
    margin: "3px",
    padding: "3px",
  };

  const handleDateCellRender = (value) => {
    const dateString = value.format("YYYY-MM-DD");

    return (
      <div
        className="droppable-area"
        onDrop={(e) => handleDrop(e, dateString)}
        onDragOver={(e) => e.preventDefault()}
      >
        {calendarEvents[dateString]?.map((course, index) => (
          <div
            key={course.id}
            className="draggable-course"
            draggable
            style={cardStyle}
            onDragStart={(e) => {
              e.dataTransfer.setData("courseId", course.id.toString());
              e.dataTransfer.setData("eventDate", dateString); // Make sure dateString is in scope
            }}
          >
            {course.name}
          </div>
        ))}
      </div>
    );
  };

  const handleDrop = (e, dateString) => {
    e.preventDefault();
    const courseId = parseInt(e.dataTransfer.getData("courseId"));
    const courseIndex = courses.findIndex((c) => c.id === courseId);

    if (courseIndex !== -1) {
      const course = courses[courseIndex];
      setCourses(courses.filter((c, index) => index !== courseIndex));

      setCalendarEvents((prevEvents) => ({
        ...prevEvents,
        [dateString]: [...(prevEvents[dateString] || []), course],
      }));
    }
  };
  // New handleSourceDrop function
  const handleSourceDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const courseId = parseInt(e.dataTransfer.getData("courseId"), 10);
    const dateString = e.dataTransfer.getData("eventDate");

    console.log(`Dropped course ID: ${courseId}, Date: ${dateString}`);

    // Remove the course from calendarEvents
    const newCalendarEvents = { ...calendarEvents };
    const coursesOnDate = newCalendarEvents[dateString] || [];
    const updatedCoursesOnDate = coursesOnDate.filter(
      (course) => course.id !== courseId
    );

    if (updatedCoursesOnDate.length > 0) {
      newCalendarEvents[dateString] = updatedCoursesOnDate;
    } else {
      delete newCalendarEvents[dateString];
    }

    // Add the course back to the source (courses)
    const courseToAddBack = coursesOnDate.find(
      (course) => course.id === courseId
    );
    if (courseToAddBack) {
      setCourses([...courses, courseToAddBack]);
    }

    setCalendarEvents(newCalendarEvents);
  };

  return (
    <div className="container">
      <div
        className="src-column"
        onDrop={handleSourceDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          backgroundColor: "#f0f2f5",
          borderRadius: "10px",
          margin: "20px",
        }}
      >
        <Form onFinish={addCourse}>
          <Form.Item
            label="Course Name"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
          >
            <Input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Course Title"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
          >
            <Input
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
          >
            <Input
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Time"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              value={courseTime}
              onChange={(time) => {
                setCourseTime(time);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Amount"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
          >
            <Input
              type="number"
              value={courseAmount}
              onChange={(e) => setCourseAmount(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Tags"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
          >
            <Input
              value={courseTags.join(", ")}
              onChange={(e) => setCourseTags(e.target.value.split(", "))}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 3, span: 18 }}>
            <Button type="primary" htmlType="submit" block>
              Add Course
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            borderTop: "1px solid #ccc",
            padding: "10px",
          }}
        >
          {courses.map((course, index) => (
            <div
              key={course.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px",
              }}
            >
              <span
                style={{
                  marginRight: "10px",
                }}
              >
                {index + 1}
              </span>
              <Card
                key={course.id}
                className="draggable-course"
                style={{
                  cursor: "move",
                  width: "100%",
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("courseId", course.id.toString());
                  e.dataTransfer.setData("eventDate", course.date); // assuming each course has a date field
                }}
                onClick={() => showModal(course)}
              >
                {course.name}
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="playground-column">
        <Calendar cellRender={handleDateCellRender} />
      </div>
      <Modal
    title="Edit Course Details"
    open={isModalVisible}
    onCancel={handleCancel}
    onOk={handleUpdateCourse}
>
    <Form layout="horizontal">
        <Form.Item
            label="Course Name"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
        >
            <Input
                value={editedCourseName}
                onChange={(e) => setEditedCourseName(e.target.value)}
            />
        </Form.Item>
        <Form.Item
            label="Course Title"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
        >
            <Input
                value={editedCourseTitle}
                onChange={(e) => setEditedCourseTitle(e.target.value)}
            />
        </Form.Item>
        <Form.Item
            label="Description"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
        >
            <Input
                value={editedCourseDescription}
                onChange={(e) => setEditedCourseDescription(e.target.value)}
            />
        </Form.Item>
        <Form.Item
            label="Time"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
        >
            <TimePicker.RangePicker
                format="HH:mm"
                value={editedCourseTime}
                onChange={(time) => setEditedCourseTime(time)}
            />
        </Form.Item>
        <Form.Item
            label="Amount"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
        >
            <Input
                type="number"
                value={editedCourseAmount}
                onChange={(e) => setEditedCourseAmount(e.target.value)}
            />
        </Form.Item>
        <Form.Item
            label="Tags"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14, offset: 4 }}
        >
            <Input
                value={editedCourseTags.join(", ")}
                onChange={(e) => setEditedCourseTags(e.target.value.split(", "))}
            />
        </Form.Item>
    </Form>
</Modal>

    </div>
  );
};

export default DragAndDropCalendar;
