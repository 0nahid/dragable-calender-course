import { Button, Calendar, Card, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import "./DragAndDropCalendar.css";

const DragAndDropCalendar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedCourse, setSelectedCourse] = useState(null);
const [editedCourseName, setEditedCourseName] = useState("");

const showModal = (course) => {
  setSelectedCourse(course);
  setEditedCourseName(course.name);
  setIsModalVisible(true);
};
const handleUpdateCourse = () => {
  const updatedCourses = courses.map((course) => {
    if (course.id === selectedCourse.id) {
      return { ...course, name: editedCourseName };
    }
    return course;
  });
  setCourses(updatedCourses);
  setIsModalVisible(false);
};


const handleCancel = () => {
  setIsModalVisible(false);
};

  const [courseName, setCourseName] = useState("");
  const addCourse = () => {
    console.log(courseName);
    const newCourse = { id: Date.now(), name: courseName };
    setCourses([...courses, newCourse]);
    setCourseName("");
  };
  const [courses, setCourses] = useState([
    // { id: 1, name: "Math 101" },
    // { id: 2, name: "History 201" },
  ]);
  const [calendarEvents, setCalendarEvents] = useState({});
  const cardStyle = {
    margin: "10px",
    // cursor: "move",
    
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
          <Card
          key={course.id}
          className="draggable-course"
          draggable
          style={cardStyle}
          onDragStart={(e) =>
            e.dataTransfer.setData("courseId", course.id.toString())
          }
        >
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
      <Form onFinish={addCourse}>
          <Form.Item>
            <Input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter course name"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Course
            </Button>
          </Form.Item>
        </Form>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin:"20px",
          // height: "100%",
        }}>
        {courses.map((course) => (
         <Card
         key={course.id}
         className="draggable-course"
         style={cardStyle}
         draggable
         onDragStart={(e) =>
           e.dataTransfer.setData("courseId", course.id.toString())
         }
         onClick={() => showModal(course)}
       >
         {course.name}
       </Card>
       
        ))}
        </div>
      </div>
      <div className="playground-column">
        <Calendar cellRender={handleDateCellRender} />
      </div>
      <Modal
      title="Edit Course Details"
      visible={isModalVisible}
      onCancel={handleCancel}
      onOk={handleUpdateCourse}
    >
      <Form>
        <Form.Item label="Course Name">
          <Input
            value={editedCourseName}
            onChange={(e) => setEditedCourseName(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>


    </div>
  );
};

export default DragAndDropCalendar;
