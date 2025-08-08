-- Bảng User
CREATE TABLE User (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Role
CREATE TABLE Role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng UserRole
CREATE TABLE UserRole (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    roleId BIGINT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (roleId) REFERENCES Role(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng InstructorProfile
CREATE TABLE InstructorProfile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    bio TEXT,
    expertise TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    approvedBy BIGINT,
    approvedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (approvedBy) REFERENCES User(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng StudentProfile
CREATE TABLE StudentProfile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    dateOfBirth DATE,
    phoneNumber VARCHAR(20),
    address TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng UdemyPriceZone
CREATE TABLE UdemyPriceZone (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    minPrice DECIMAL(10,2) NOT NULL,
    maxPrice DECIMAL(10,2) NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Course
CREATE TABLE Course (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    level VARCHAR(20),
    status VARCHAR(20) DEFAULT 'DRAFT',
    instructorId BIGINT NOT NULL,
    allowUdemyDiscountPolicy BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructorId) REFERENCES User(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng CoursePriceZone
CREATE TABLE CoursePriceZone (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    courseId BIGINT NOT NULL,
    priceZoneId BIGINT NOT NULL,
    selectedPrice DECIMAL(10,2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (courseId) REFERENCES Course(id),
    FOREIGN KEY (priceZoneId) REFERENCES UdemyPriceZone(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Discount
CREATE TABLE Discount (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL, -- BEST_PRICE, CUSTOM
    status VARCHAR(20) DEFAULT 'ACTIVE',
    minPrice DECIMAL(10,2), -- cho BEST_PRICE
    maxPrice DECIMAL(10,2), -- cho CUSTOM
    customPrice DECIMAL(10,2), -- cho CUSTOM
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    maxUses INT,
    usedCount INT DEFAULT 0,
    createdById BIGINT NOT NULL,
    courseId BIGINT,
    isGlobal BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (createdById) REFERENCES User(id),
    FOREIGN KEY (courseId) REFERENCES Course(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng DiscountUsage
CREATE TABLE DiscountUsage (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    discountId BIGINT NOT NULL,
    courseId BIGINT NOT NULL,
    orderId BIGINT,
    usedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (discountId) REFERENCES Discount(id),
    FOREIGN KEY (courseId) REFERENCES Course(id)
    -- FOREIGN KEY (orderId) REFERENCES `Order`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Order
CREATE TABLE `Order` (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    courseId BIGINT NOT NULL,
    discountId BIGINT,
    pricePaid DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (courseId) REFERENCES Course(id),
    FOREIGN KEY (discountId) REFERENCES Discount(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu Discount do admin tạo, áp dụng toàn bộ khoá học
INSERT INTO Discount (code, type, status, minPrice, maxPrice, customPrice, startDate, endDate, maxUses, usedCount, createdById, courseId, isGlobal, createdAt, updatedAt)
VALUES ('UDEMYSALE', 'BEST_PRICE', 'ACTIVE', 9, NULL, NULL, '2024-06-01', '2024-06-10', 10000, 0, 1, NULL, TRUE, NOW(), NOW()); 