-- Sample data for testing the attendance management system

-- Insert sample teachers
INSERT INTO teachers (first_name, last_name, email) VALUES
('Hans', 'Müller', 'hans.mueller@school.de'),
('Anna', 'Schmidt', 'anna.schmidt@school.de'),
('Klaus', 'Weber', 'klaus.weber@school.de'),
('Maria', 'Fischer', 'maria.fischer@school.de');

-- Insert sample students with realistic data
INSERT INTO students (first_name, last_name, birthday, class_id, company_name, ausbilder_email) VALUES
-- IT4L students (mix of ages)
('Max', 'Mustermann', '2005-03-15', (SELECT id FROM classes WHERE name = 'IT4L'), 'TechCorp GmbH', 'supervisor@techcorp.de'),
('Anna', 'Weber', '2004-11-22', (SELECT id FROM classes WHERE name = 'IT4L'), 'InnoSoft AG', 'training@innosoft.de'),
('Tim', 'Fischer', '2006-07-08', (SELECT id FROM classes WHERE name = 'IT4L'), 'DataSys Ltd', 'mentor@datasys.com'),
('Lisa', 'Schmidt', '2003-12-03', (SELECT id FROM classes WHERE name = 'IT4L'), 'CloudTech GmbH', 'ausbildung@cloudtech.de'),

-- IT4O students
('Paul', 'Meyer', '2005-04-17', (SELECT id FROM classes WHERE name = 'IT4O'), 'WebDev Solutions', 'trainer@webdev.de'),
('Sarah', 'Bauer', '2004-09-12', (SELECT id FROM classes WHERE name = 'IT4O'), 'Digital Dreams', 'coach@digitaldreams.de'),
('David', 'Hoffman', '2006-01-28', (SELECT id FROM classes WHERE name = 'IT4O'), 'Software AG', 'mentor@software-ag.de'),
('Emma', 'Richter', '2005-06-19', (SELECT id FROM classes WHERE name = 'IT4O'), 'App Factory', 'training@appfactory.de'),

-- IT4K students
('Leon', 'Wagner', '2004-10-05', (SELECT id FROM classes WHERE name = 'IT4K'), 'CyberSec Pro', 'ausbilder@cybersec.de'),
('Julia', 'Klein', '2005-08-14', (SELECT id FROM classes WHERE name = 'IT4K'), 'Network Solutions', 'supervisor@network.de'),
('Ben', 'Schulz', '2006-02-20', (SELECT id FROM classes WHERE name = 'IT4K'), 'IT Consulting', 'trainer@itconsult.de'),
('Lena', 'Braun', '2004-05-30', (SELECT id FROM classes WHERE name = 'IT4K'), 'Tech Innovations', 'mentor@techinno.de');

-- Insert sample absences for testing
INSERT INTO absences (student_id, start_date, end_date, reason, status) VALUES
-- Recent absences
((SELECT id FROM students WHERE first_name = 'Max' AND last_name = 'Mustermann'), '2025-10-07', '2025-10-09', 'Grippe', 'approved'),
((SELECT id FROM students WHERE first_name = 'Anna' AND last_name = 'Weber'), '2025-10-08', '2025-10-08', 'Arzttermin', 'approved'),
((SELECT id FROM students WHERE first_name = 'Tim' AND last_name = 'Fischer'), '2025-10-05', '2025-10-06', 'Familiennotfall', 'pending'),

-- Older absences for statistics
((SELECT id FROM students WHERE first_name = 'Lisa' AND last_name = 'Schmidt'), '2025-09-15', '2025-09-17', 'Krankheit', 'approved'),
((SELECT id FROM students WHERE first_name = 'Paul' AND last_name = 'Meyer'), '2025-09-20', '2025-09-20', 'Zahnarzt', 'approved'),
((SELECT id FROM students WHERE first_name = 'Sarah' AND last_name = 'Bauer'), '2025-09-25', '2025-09-27', 'Urlaub', 'approved'),

-- Mix of statuses
((SELECT id FROM students WHERE first_name = 'David' AND last_name = 'Hoffman'), '2025-10-01', '2025-10-02', 'Erkältung', 'denied'),
((SELECT id FROM students WHERE first_name = 'Emma' AND last_name = 'Richter'), '2025-10-10', '2025-10-12', 'Familienfeier', 'pending');

-- Sample email logs
INSERT INTO email_logs (absence_id, recipient_email, subject, body, status) VALUES
((SELECT id FROM absences WHERE student_id = (SELECT id FROM students WHERE first_name = 'Max' AND last_name = 'Mustermann') AND start_date = '2025-10-07'),
 'supervisor@techcorp.de',
 'Abwesenheitsmeldung: Max Mustermann (07.10. - 09.10.2025)',
 'Sehr geehrte Damen und Herren, hiermit melde ich die Abwesenheit von Max Mustermann vom 07.10. bis 09.10.2025 aufgrund von Grippe.',
 'sent'),

((SELECT id FROM absences WHERE student_id = (SELECT id FROM students WHERE first_name = 'Anna' AND last_name = 'Weber') AND start_date = '2025-10-08'),
 'training@innosoft.de',
 'Abwesenheitsmeldung: Anna Weber (08.10.2025)',
 'Sehr geehrte Damen und Herren, hiermit melde ich die Abwesenheit von Anna Weber am 08.10.2025 aufgrund eines Arzttermins.',
 'delivered'),

((SELECT id FROM absences WHERE student_id = (SELECT id FROM students WHERE first_name = 'Tim' AND last_name = 'Fischer') AND start_date = '2025-10-05'),
 'mentor@datasys.com',
 'Abwesenheitsmeldung: Tim Fischer (05.10. - 06.10.2025)',
 'Sehr geehrte Damen und Herren, hiermit melde ich die Abwesenheit von Tim Fischer vom 05.10. bis 06.10.2025 aufgrund eines Familiennotfalls.',
 'sent');