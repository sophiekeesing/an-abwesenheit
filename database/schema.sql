-- PostgreSQL Database Schema for Attendance Management System
-- Creates tables for teachers, students, absences with all required fields

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Classes table with specific options
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(10) NOT NULL CHECK (name IN ('IT4L', 'IT4O', 'IT4K')),
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students table with all required fields
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birthday DATE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    company_name VARCHAR(255),
    ausbilder_email VARCHAR(255),
    total_absences INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Absences table
CREATE TABLE absences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    days_count INTEGER NOT NULL,
    working_days_count INTEGER NOT NULL, -- Excludes weekends
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure end date is not before start date
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Email logs for tracking and bounce detection
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    absence_id UUID REFERENCES absences(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    bounced_at TIMESTAMP WITH TIME ZONE,
    bounce_reason TEXT,
    follow_up_sent BOOLEAN DEFAULT false,
    follow_up_sent_at TIMESTAMP WITH TIME ZONE
);

-- Function to check if student is of age
CREATE OR REPLACE FUNCTION is_student_of_age(birthday DATE)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(CURRENT_DATE, birthday)) >= 18;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate working days between two dates (excluding weekends)
CREATE OR REPLACE FUNCTION calculate_working_days(start_date DATE, end_date DATE)
RETURNS INTEGER AS $$
DECLARE
    current_date DATE := start_date;
    working_days INTEGER := 0;
BEGIN
    WHILE current_date <= end_date LOOP
        -- Check if it's not a weekend (1 = Sunday, 7 = Saturday in PostgreSQL)
        IF EXTRACT(DOW FROM current_date) NOT IN (0, 6) THEN
            working_days := working_days + 1;
        END IF;
        current_date := current_date + INTERVAL '1 day';
    END LOOP;
    
    RETURN working_days;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate total days between dates
CREATE OR REPLACE FUNCTION calculate_total_days(start_date DATE, end_date DATE) 
RETURNS INTEGER AS $$
BEGIN
    RETURN (end_date - start_date) + 1;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate days when inserting/updating absences
CREATE OR REPLACE FUNCTION update_absence_days()
RETURNS TRIGGER AS $$
BEGIN
    NEW.days_count := calculate_total_days(NEW.start_date, NEW.end_date);
    NEW.working_days_count := calculate_working_days(NEW.start_date, NEW.end_date);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_absence_days
    BEFORE INSERT OR UPDATE ON absences
    FOR EACH ROW
    EXECUTE FUNCTION update_absence_days();

-- Trigger to update total_absences in students table
CREATE OR REPLACE FUNCTION update_student_absence_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the student's total absence count
    UPDATE students 
    SET total_absences = (
        SELECT COALESCE(SUM(working_days_count), 0) 
        FROM absences 
        WHERE student_id = NEW.student_id 
        AND status = 'approved'
    )
    WHERE id = NEW.student_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_absence_count
    AFTER INSERT OR UPDATE ON absences
    FOR EACH ROW
    EXECUTE FUNCTION update_student_absence_count();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_absences_updated_at BEFORE UPDATE ON absences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default classes
INSERT INTO classes (name, description) VALUES 
('IT4L', 'IT Klasse 4L'),
('IT4O', 'IT Klasse 4O'),
('IT4K', 'IT Klasse 4K');

-- Create indexes for better performance
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_ausbilder_email ON students(ausbilder_email);
CREATE INDEX idx_absences_student_id ON absences(student_id);
CREATE INDEX idx_absences_status ON absences(status);
CREATE INDEX idx_absences_date_range ON absences(start_date, end_date);
CREATE INDEX idx_email_logs_absence_id ON email_logs(absence_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- View for student overview with calculated fields
CREATE VIEW student_overview AS
SELECT 
    s.id,
    s.first_name,
    s.last_name,
    s.birthday,
    is_student_of_age(s.birthday) as is_of_age,
    c.name as class_name,
    s.company_name,
    s.ausbilder_email,
    COALESCE(SUM(a.working_days_count), 0) as total_absence_days,
    COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_absences,
    s.is_active,
    s.created_at,
    s.updated_at
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN absences a ON s.id = a.student_id AND a.status = 'approved'
WHERE s.is_active = true
GROUP BY s.id, s.first_name, s.last_name, s.birthday, c.name, s.company_name, s.ausbilder_email, s.is_active, s.created_at, s.updated_at
ORDER BY c.name, s.last_name, s.first_name;