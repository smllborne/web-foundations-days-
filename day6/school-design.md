# School database design

## Tables and relationships

- **students** stores each student's name and unique email address. `student_id` is its primary key.
- **courses** stores each course's name. `course_id` is its primary key.
- **enrolments** records a student's enrolment in a course and the grade earned. Its primary key is `enrolment_id`; `student_id` and `course_id` are foreign keys to the other tables. The pair is unique so the same student cannot enrol on the same course more than once.

Each student can have many enrolments, and each course can have many enrolments, so both students-to-enrolments and courses-to-enrolments are one-to-many relationships. Together, students and courses have a many-to-many relationship: a student can take many courses, and a course can have many students. The enrolments join table represents each link between a student and a course and stores relationship-specific data, such as the grade.

I would add an index on `enrolments(course_id)` to speed up queries that find all students on a course and to help SQLite check course foreign-key references. The uniqueness constraint on `(student_id, course_id)` already provides an index starting with `student_id`, but it does not efficiently serve searches by `course_id` alone.

I would choose SQL for this system. Students, courses, and enrolments have clear relationships, and relational constraints can enforce unique emails, valid references, and one enrolment per student-course pair. SQL joins make reports such as course rosters and enrolment counts straightforward. A NoSQL database could work, but it would require more application-level effort to preserve these relationships and constraints.
