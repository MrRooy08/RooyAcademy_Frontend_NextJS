-- Tạo bảng Users để lưu thông tin người dùng
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'student', -- 'student', 'teacher', 'admin'
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng TeacherApplications để lưu thông tin đăng ký làm giảng viên
CREATE TABLE TeacherApplications (
    application_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    experience NVARCHAR(MAX),
    qualifications NVARCHAR(MAX),
    bio NVARCHAR(MAX),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Courses để lưu thông tin khóa học
CREATE TABLE Courses (
    course_id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    teacher_id INT FOREIGN KEY REFERENCES Users(user_id),
    price DECIMAL(10,2),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Sections để lưu thông tin các phần học
CREATE TABLE Sections (
    section_id INT PRIMARY KEY IDENTITY(1,1),
    course_id INT FOREIGN KEY REFERENCES Courses(course_id),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    order_number INT NOT NULL, -- Thứ tự của phần học trong khóa học
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Lectures để lưu thông tin bài giảng
CREATE TABLE Lectures (
    lecture_id INT PRIMARY KEY IDENTITY(1,1),
    section_id INT FOREIGN KEY REFERENCES Sections(section_id),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    content_url VARCHAR(255), -- URL đến nội dung bài giảng (video, tài liệu)
    duration INT, -- Thời lượng bài giảng (tính bằng phút)
    order_number INT NOT NULL, -- Thứ tự của bài giảng trong phần học
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Exercises để lưu thông tin bài tập
CREATE TABLE Exercises (
    exercise_id INT PRIMARY KEY IDENTITY(1,1),
    lecture_id INT FOREIGN KEY REFERENCES Lectures(lecture_id),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    exercise_type VARCHAR(50), -- 'quiz', 'assignment', 'project'
    max_score INT,
    order_number INT NOT NULL, -- Thứ tự của bài tập trong bài giảng
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Enrollments để lưu thông tin đăng ký khóa học
CREATE TABLE Enrollments (
    enrollment_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    course_id INT FOREIGN KEY REFERENCES Courses(course_id),
    enrollment_date DATETIME DEFAULT GETDATE(),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    UNIQUE(user_id, course_id)
);

-- Tạo bảng LectureProgress để theo dõi tiến độ của từng bài giảng
CREATE TABLE LectureProgress (
    progress_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    lecture_id INT FOREIGN KEY REFERENCES Lectures(lecture_id),
    status VARCHAR(20) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    watch_time INT DEFAULT 0, -- Thời gian xem (tính bằng giây)
    last_position INT DEFAULT 0, -- Vị trí xem cuối cùng (tính bằng giây)
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    UNIQUE(user_id, lecture_id)
);

-- Tạo bảng ExerciseSubmissions để lưu thông tin bài nộp bài tập
CREATE TABLE ExerciseSubmissions (
    submission_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    exercise_id INT FOREIGN KEY REFERENCES Exercises(exercise_id),
    submission_content NVARCHAR(MAX),
    score DECIMAL(5,2),
    feedback NVARCHAR(MAX),
    status VARCHAR(20) DEFAULT 'submitted', -- 'submitted', 'graded', 'returned'
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Orders để lưu thông tin đơn hàng
CREATE TABLE Orders (
    order_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
    payment_method VARCHAR(50),
    payment_status VARCHAR(20),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng OrderItems để lưu chi tiết đơn hàng
CREATE TABLE OrderItems (
    item_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT FOREIGN KEY REFERENCES Orders(order_id),
    course_id INT FOREIGN KEY REFERENCES Courses(course_id),
    discount_id INT FOREIGN KEY REFERENCES Discounts(discount_id), -- Mã giảm giá áp dụng cho khóa học này
    original_price DECIMAL(10,2) NOT NULL, -- Giá gốc của khóa học
    discounted_price DECIMAL(10,2) NOT NULL, -- Giá sau khi giảm
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Discounts để lưu thông tin mã giảm giá
CREATE TABLE Discounts (
    discount_id INT PRIMARY KEY IDENTITY(1,1),
    code VARCHAR(50) UNIQUE NOT NULL,
    description NVARCHAR(MAX),
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' hoặc 'fixed_amount'
    discount_value DECIMAL(10,2) NOT NULL, -- Giá trị giảm giá (phần trăm hoặc số tiền cố định)
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    max_uses INT, -- Số lần sử dụng tối đa
    min_purchase_amount DECIMAL(10,2), -- Số tiền mua tối thiểu để áp dụng
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Tạo bảng DiscountUsage để lưu thông tin sử dụng mã giảm giá
CREATE TABLE DiscountUsage (
    usage_id INT PRIMARY KEY IDENTITY(1,1),
    discount_id INT FOREIGN KEY REFERENCES Discounts(discount_id),
    order_id INT FOREIGN KEY REFERENCES Orders(order_id),
    total_original_amount DECIMAL(10,2) NOT NULL, -- Tổng tiền gốc của đơn hàng
    total_discounted_amount DECIMAL(10,2) NOT NULL, -- Tổng tiền sau khi giảm
    used_at DATETIME DEFAULT GETDATE(),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
); 