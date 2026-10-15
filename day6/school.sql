CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade INTEGER NOT NULL CHECK (grade BETWEEN 0 AND 100),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)
);

INSERT INTO students (student_id, name, email) VALUES
    (1, 'Alice Morgan', 'alice@example.com'),
    (2, 'Ben Carter', 'ben@example.com'),
    (3, 'Casey Nguyen', 'casey@example.com'),
    (4, 'Drew Patel', 'drew@example.com');

INSERT INTO courses (course_id, course_name) VALUES
    (1, 'Mathematics'),
    (2, 'History'),
    (3, 'Biology');

INSERT INTO enrolments (enrolment_id, student_id, course_id, grade) VALUES
    (1, 1, 1, 92),
    (2, 1, 3, 88),
    (3, 2, 1, 85),
    (4, 2, 2, 91),
    (5, 3, 3, 79);

-- All courses taken by one student.
SELECT c.course_name, e.grade
FROM students AS s
JOIN enrolments AS e ON e.student_id = s.student_id
JOIN courses AS c ON c.course_id = e.course_id
WHERE s.name = 'Alice Morgan'
ORDER BY c.course_name;

-- All students enrolled on one course.
SELECT s.name, s.email, e.grade
FROM courses AS c
JOIN enrolments AS e ON e.course_id = c.course_id
JOIN students AS s ON s.student_id = e.student_id
WHERE c.course_name = 'Mathematics'
ORDER BY s.name;

-- Number of students per course, including courses with no enrolments.
SELECT c.course_name, COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e ON e.course_id = c.course_id
GROUP BY c.course_id, c.course_name
ORDER BY c.course_name;

-- Students who have no enrolments.
SELECT s.student_id, s.name, s.email
FROM students AS s
LEFT JOIN enrolments AS e ON e.student_id = s.student_id
WHERE e.student_id IS NULL
ORDER BY s.name;

-- Update Alice Morgan's Mathematics grade.
UPDATE enrolments
SET grade = 95
WHERE student_id = 1 AND course_id = 1;