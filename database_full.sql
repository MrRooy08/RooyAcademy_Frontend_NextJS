-- ===================== BẢNG NGƯỜI DÙNG =====================
CREATE TABLE NGUOI_DUNG (
    MA_NGUOI_DUNG INT PRIMARY KEY,
    TEN_DANG_NHAP VARCHAR(255) UNIQUE NOT NULL,
    MAT_KHAU VARCHAR(255) NOT NULL,
    CON_HOAT_DONG TINYINT(1) DEFAULT 1,
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW()
);

-- ===================== BẢNG VAI TRÒ =====================
CREATE TABLE VAI_TRO (
    MA_VAI_TRO INT PRIMARY KEY AUTO_INCREMENT,
    TEN_VAI_TRO VARCHAR(50) NOT NULL,
    MO_TA TEXT
);

-- ===================== BẢNG QUYỀN =====================
CREATE TABLE QUYEN (
    MA_QUYEN INT PRIMARY KEY AUTO_INCREMENT,
    TEN_QUYEN VARCHAR(100) NOT NULL,
    MO_TA TEXT
);

-- ===================== BẢNG NGƯỜI DÙNG - VAI TRÒ =====================
CREATE TABLE VAI_TRO_NGUOI_DUNG_ (
    MA_NGUOI_DUNG INT NOT NULL,
    MA_VAI_TRO INT NOT NULL,
    PRIMARY KEY (MA_NGUOI_DUNG, MA_VAI_TRO),
    FOREIGN KEY (MA_NGUOI_DUNG) REFERENCES NGUOI_DUNG(MA_NGUOI_DUNG),
    FOREIGN KEY (MA_VAI_TRO) REFERENCES VAI_TRO(MA_VAI_TRO)
);

-- ===================== BẢNG VAI TRÒ - QUYỀN =====================
CREATE TABLE VAI_TRO_QUYEN (
    MA_VAI_TRO INT NOT NULL,
    MA_QUYEN INT NOT NULL,
    PRIMARY KEY (MA_VAI_TRO, MA_QUYEN),
    FOREIGN KEY (MA_VAI_TRO) REFERENCES VAI_TRO(MA_VAI_TRO),
    FOREIGN KEY (MA_QUYEN) REFERENCES QUYEN(MA_QUYEN)
);

-- ===================== BẢNG CHƯƠNG TRÌNH ĐÀO TẠO =====================
CREATE TABLE CHUONG_TRINH_DAO_TAO (
    MA_CHUONG_TRINH INT PRIMARY KEY AUTO_INCREMENT,
    TEN_CHUONG_TRINH VARCHAR(255) NOT NULL,
    MO_TA TEXT,
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW()
);

-- ===================== BẢNG DANH MỤC =====================
CREATE TABLE DANH_MUC (
    MA_DANH_MUC INT PRIMARY KEY AUTO_INCREMENT,
    TEN_DANH_MUC VARCHAR(255) NOT NULL,
    MO_TA TEXT,
    MA_DANH_MUC_CHA INT NULL,
    FOREIGN KEY (MA_DANH_MUC_CHA) REFERENCES DANH_MUC(MA_DANH_MUC)
);

-- ===================== BẢNG CHỦ ĐỀ HỌC =====================
CREATE TABLE CHU_DE_HOC (
    MA_CHU_DE INT PRIMARY KEY AUTO_INCREMENT,
    TEN_CHU_DE VARCHAR(255) NOT NULL,
    MO_TA TEXT
);

-- ===================== BẢNG TRÌNH ĐỘ =====================
CREATE TABLE TRINH_DO (
    MA_TRINH_DO INT PRIMARY KEY AUTO_INCREMENT,
    TEN_TRINH_DO VARCHAR(100) NOT NULL,
    MO_TA TEXT
);

-- ===================== BẢNG KHOÁ HỌC =====================
CREATE TABLE KHOA_HOC (
    MA_KHOA_HOC INT PRIMARY KEY AUTO_INCREMENT,
    MA_GIANG_VIEN INT NOT NULL,
    MA_DANH_MUC INT NOT NULL,
    MA_CHU_DE INT NOT NULL,
    MA_TRINH_DO INT NOT NULL,
    MA_CHUONG_TRINH INT,
    MA_GIA_GOC INT NOT NULL,
    TEN_KHOA_HOC VARCHAR(200) NOT NULL,
    MO_TA TEXT,
    HINH_ANH VARCHAR(255),
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    TRANG_THAI_KHOA_HOC TINYINT UNSIGNED DEFAULT 0,
    TRANG_THAI_DUYET TINYINT UNSIGNED DEFAULT NULL,
    NGUOI_DUYET INT NULL,
    NGAY_DUYET DATETIME NULL,
    THAM_GIA_UU_DAI TINYINT(1) DEFAULT 0,
    FOREIGN KEY (MA_GIANG_VIEN) REFERENCES NGUOI_DUNG(MA_NGUOI_DUNG),
    FOREIGN KEY (MA_CHUONG_TRINH) REFERENCES CHUONG_TRINH_DAO_TAO(MA_CHUONG_TRINH),
    FOREIGN KEY (MA_DANH_MUC) REFERENCES DANH_MUC(MA_DANH_MUC),
    FOREIGN KEY (MA_CHU_DE) REFERENCES CHU_DE_HOC(MA_CHU_DE),
    FOREIGN KEY (MA_TRINH_DO) REFERENCES TRINH_DO(MA_TRINH_DO),
    FOREIGN KEY (NGUOI_DUYET) REFERENCES NGUOI_DUNG(MA_NGUOI_DUNG), 
    FOREIGN KEY (MA_GIA_GOC) REFERENCES MUC_GIA(MA_MUC_GIA)
);

-- ===================== BẢNG MỨC GIÁ =====================
CREATE TABLE MUC_GIA (
    MA_MUC_GIA INT PRIMARY KEY AUTO_INCREMENT,
    MA_KHOA_HOC INT NOT NULL,
    GIA DECIMAL(10,2) NOT NULL,
    MO_TA TEXT,
    FOREIGN KEY (MA_KHOA_HOC) REFERENCES KHOA_HOC(MA_KHOA_HOC)
);

-- ===================== BẢNG PHẦN HỌC =====================
CREATE TABLE PHAN_HOC (
    MA_PHAN_HOC INT PRIMARY KEY AUTO_INCREMENT,
    MA_KHOA_HOC INT NOT NULL,
    TEN_PHAN_HOC VARCHAR(200) NOT NULL,
    MO_TA TEXT,
    THU_TU INT NOT NULL,
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    FOREIGN KEY (MA_KHOA_HOC) REFERENCES KHOA_HOC(MA_KHOA_HOC)
);

-- ===================== BẢNG BÀI GIẢNG =====================
CREATE TABLE BAI_GIANG (
    MA_BAI_GIANG INT PRIMARY KEY AUTO_INCREMENT,
    MA_PHAN_HOC INT NOT NULL,
    TEN_BAI_GIANG VARCHAR(200) NOT NULL,
    MO_TA TEXT,
    NOI_DUNG_URL VARCHAR(255),
    THOI_LUONG INT,
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    FOREIGN KEY (MA_PHAN_HOC) REFERENCES PHAN_HOC(MA_PHAN_HOC)
);

-- ===================== BẢNG BÀI TẬP =====================
CREATE TABLE BAI_TAP (
    MA_BAI_TAP INT PRIMARY KEY AUTO_INCREMENT,
    MA_BAI_GIANG INT NOT NULL,
    TEN_BAI_TAP VARCHAR(200) NOT NULL,
    MO_TA TEXT,
    LOAI_BAI_TAP VARCHAR(50),
    DIEM_TOI_DA INT,
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    FOREIGN KEY (MA_BAI_GIANG) REFERENCES BAI_GIANG(MA_BAI_GIANG)
);

-- ===================== BẢNG ĐĂNG KÝ KHOÁ HỌC =====================
CREATE TABLE THAM_GIA_KHOA_HOC (
    MA_DANG_KY INT PRIMARY KEY AUTO_INCREMENT,
    MA_NGUOI_DUNG INT,
    MA_KHOA_HOC INT,
    NGAY_DANG_KY DATETIME DEFAULT NOW(),
    TRANG_THAI_HOAN_THANH TINYINT(1) DEFAULT 0,
    NGAY_HOAN_THANH DATETIME DEFAULT NULL,
    UNIQUE (MA_NGUOI_DUNG, MA_KHOA_HOC),
    FOREIGN KEY (MA_NGUOI_DUNG) REFERENCES NGUOI_DUNG(MA_NGUOI_DUNG),
    FOREIGN KEY (MA_KHOA_HOC) REFERENCES KHOA_HOC(MA_KHOA_HOC)
);

-- ===================== BẢNG TIẾN ĐỘ BÀI GIẢNG =====================
CREATE TABLE TIEN_DO_BAI_GIANG (
    MA_DANG_KY INT,
    MA_BAI_GIANG INT,
    TRANG_THAI VARCHAR(20) DEFAULT 'chua_hoc',
    THOI_GIAN_XEM INT DEFAULT 0,
    VI_TRI_CUOI INT DEFAULT 0,
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    PRIMARY KEY (MA_DANG_KY, MA_BAI_GIANG),
    FOREIGN KEY (MA_DANG_KY) REFERENCES THAM_GIA_KHOA_HOC(MA_DANG_KY),
    FOREIGN KEY (MA_BAI_GIANG) REFERENCES BAI_GIANG(MA_BAI_GIANG)
);

-- ===================== BẢNG NỘP BÀI TẬP =====================
CREATE TABLE NOP_BAI_TAP (
    MA_DANG_KY INT,
    MA_BAI_TAP INT,
    NOI_DUNG_NOP TEXT,
    DIEM DECIMAL(5,2),
    PHAN_HOI TEXT,
    TRANG_THAI VARCHAR(20) DEFAULT 'da_nop',
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    PRIMARY KEY (MA_DANG_KY, MA_BAI_TAP),
    FOREIGN KEY (MA_DANG_KY) REFERENCES THAM_GIA_KHOA_HOC(MA_DANG_KY),
    FOREIGN KEY (MA_BAI_TAP) REFERENCES BAI_TAP(MA_BAI_TAP)
);

-- ===================== BẢNG GIỎ HÀNG =====================
CREATE TABLE GIO_HANG (
    MA_GIO_HANG INT PRIMARY KEY AUTO_INCREMENT,
    MA_NGUOI_DUNG INT NOT NULL,
    TONG_TIEN DECIMAL(10,2) NOT NULL,
    TRANG_THAI VARCHAR(20) DEFAULT 'cho_thanh_toan',
    PHUONG_THUC_THANH_TOAN VARCHAR(50),
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    FOREIGN KEY (MA_NGUOI_DUNG) REFERENCES NGUOI_DUNG(MA_NGUOI_DUNG)
);

-- ===================== BẢNG CHI TIẾT GIỎ HÀNG =====================
CREATE TABLE CHI_TIET_GIO_HANG (
    MA_GIO_HANG INT NOT NULL,
    MA_KHOA_HOC INT NOT NULL,
    GIA_GOC DECIMAL(10,2) NOT NULL,
    GIA_SAU_GIAM DECIMAL(10,2) NOT NULL,
    MA_GIAM_GIA VARCHAR(50),
    NGAY_THEM DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    PRIMARY KEY (MA_GIO_HANG, MA_KHOA_HOC),
    FOREIGN KEY (MA_GIO_HANG) REFERENCES GIO_HANG(MA_GIO_HANG),
    FOREIGN KEY (MA_KHOA_HOC) REFERENCES KHOA_HOC(MA_KHOA_HOC),
    FOREIGN KEY (MA_GIAM_GIA) REFERENCES GIAM_GIA(MA_CODE)
);

-- ===================== BẢNG ĐƠN HÀNG =====================
CREATE TABLE DON_HANG (
    MA_DON_HANG INT PRIMARY KEY AUTO_INCREMENT,
    MA_NGUOI_DUNG INT NOT NULL,
    TONG_TIEN DECIMAL(10,2) NOT NULL,
    TRANG_THAI VARCHAR(20) DEFAULT 'cho_thanh_toan',
    PHUONG_THUC_THANH_TOAN VARCHAR(50),
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    FOREIGN KEY (MA_NGUOI_DUNG) REFERENCES NGUOI_DUNG(MA_NGUOI_DUNG)
);

-- ===================== BẢNG CHI TIẾT ĐƠN HÀNG =====================
CREATE TABLE CHI_TIET_DON_HANG (
    MA_DON_HANG INT NOT NULL,
    MA_KHOA_HOC INT NOT NULL,
    GIA_GOC DECIMAL(10,2) NOT NULL,
    GIA_SAU_GIAM DECIMAL(10,2) NOT NULL,
    MA_GIAM_GIA VARCHAR(50),
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    PRIMARY KEY (MA_DON_HANG, MA_KHOA_HOC),
    FOREIGN KEY (MA_DON_HANG) REFERENCES DON_HANG(MA_DON_HANG),
    FOREIGN KEY (MA_KHOA_HOC) REFERENCES KHOA_HOC(MA_KHOA_HOC),
    FOREIGN KEY (MA_GIAM_GIA) REFERENCES GIAM_GIA(MA_CODE)
);

-- ===================== BẢNG LOẠI GIẢM =====================
CREATE TABLE LOAI_GIAM (
    MA_LOAI_GIAM INT PRIMARY KEY AUTO_INCREMENT,
    TEN_LOAI_GIAM VARCHAR(100) NOT NULL,
    MO_TA TEXT, 
    GIOI_HAN_NGUOI_THAM_GIA INT,
    THOI_GIAN_SU_DUNG INT, 
    GIA_THAP_NHAT DECIMAL(10,2),
    GIA_TOT_NHAT DECIMAL(10,2),
    GIA_CAO_NHAT DECIMAL(10,2),
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW()
);

-- ===================== BẢNG GIẢM GIÁ =====================
CREATE TABLE GIAM_GIA (
    MA_CODE VARCHAR(50),
    MA_NGUOI_TAO INT,
    MA_LOAI_GIAM INT NOT NULL,
    MA_KHOA_HOC INT,
    MO_TA TEXT,
    GIA_TRI DECIMAL(10,2) NOT NULL,
    NGAY_BAT_DAU DATETIME NOT NULL,
    NGAY_KET_THUC DATETIME NOT NULL,
    SO_LAN_SU_DUNG_TOI_DA INT,
    SO_TIEN_TOI_THIEU DECIMAL(10,2),
    TRANG_THAI TINYINT(1) DEFAULT 0,
    AP_DUNG_TOAN_BO TINYINT(1) DEFAULT 0,
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    PRIMARY KEY (MA_CODE, MA_NGUOI_TAO),
    FOREIGN KEY (MA_LOAI_GIAM) REFERENCES LOAI_GIAM(MA_LOAI_GIAM),
    FOREIGN KEY (MA_KHOA_HOC) REFERENCES KHOA_HOC(MA_KHOA_HOC),
    FOREIGN KEY (MA_NGUOI_TAO) REFERENCES NGUOI_DUNG(MA_NGUOI_DUNG)
);

-- ===================== BẢNG SỬ DỤNG MÃ GIẢM GIÁ =====================
CREATE TABLE MA_GIAM_GIA_DA_SU_DUNG (
    MA_GIAM_GIA INT,
    MA_DON_HANG INT,
    TONG_TIEN_GOC DECIMAL(10,2) NOT NULL,
    TONG_TIEN_SAU_GIAM DECIMAL(10,2) NOT NULL,
    NGAY_SU_DUNG DATETIME DEFAULT NOW(),
    PRIMARY KEY (MA_GIAM_GIA, MA_DON_HANG),
    FOREIGN KEY (MA_GIAM_GIA) REFERENCES GIAM_GIA(MA_GIAM_GIA),
    FOREIGN KEY (MA_DON_HANG) REFERENCES DON_HANG(MA_DON_HANG)
);

-- ===================== BẢNG HỒ SƠ GIẢNG VIÊN =====================
CREATE TABLE HO_SO_GIANG_VIEN (
    MA_HO_SO INT PRIMARY KEY AUTO_INCREMENT,
    MA_NGUOI_DUNG INT NOT NULL,
    KINH_NGHIEM TEXT,
    BANG_CAP TEXT,
    TIEU_SU TEXT,
    TRANG_THAI VARCHAR(20) DEFAULT 'cho_duyet',
    NGAY_TAO DATETIME DEFAULT NOW(),
    NGAY_CAP_NHAT DATETIME DEFAULT NOW(),
    FOREIGN KEY (MA_NGUOI_DUNG) REFERENCES NGUOI_DUNG(MA_NGUOI_DUNG)
);

-- ===================== BẢNG TRUNG GIAN: GIANG_VIEN_KHOA_HOC =====================
CREATE TABLE GIANG_VIEN_KHOA_HOC (
    MA_KHOA_HOC INT NOT NULL,
    MA_NGUOI_DUNG INT NOT NULL,
    LA_CHU_KHOA_HOC TINYINT(1) DEFAULT 0,
    QUYEN VARCHAR(50),
    NGAY_THAM_GIA DATETIME DEFAULT NOW(),
    TRANG_THAI VARCHAR(20) DEFAULT 'active',
    PRIMARY KEY (MA_KHOA_HOC, MA_NGUOI_DUNG),
    FOREIGN KEY (MA_KHOA_HOC) REFERENCES KHOA_HOC(MA_KHOA_HOC),
    FOREIGN KEY (MA_NGUOI_DUNG) REFERENCES NGUOI_DUNG(MA_NGUOI_DUNG)
);

-- Thêm dữ liệu mẫu cho bảng LOAI_GIAM
INSERT INTO LOAI_GIAM (TEN_LOAI_GIAM, MO_TA, GIOI_HAN_NGUOI_THAM_GIA, THOI_GIAN_SU_DUNG, GIA_THAP_NHAT, GIA_TOT_NHAT, GIA_CAO_NHAT)
VALUES 
('Tự chọn giá', 'Cho phép giảng viên đề đưa ra 1 mức giá trong phạm vi 15 - 20 đô trong vòng 31 ngày', NULL, 31, 15, 20, 20),
('Giá tốt nhất', 'Cho phép giảng viên tạo giá tốt nhất hiện tại là 10 đô trong vòng 5 ngày', NULL, 5, 10, 10, 10);

-- Thêm dữ liệu mẫu cho bảng MUC_GIA
INSERT INTO MUC_GIA (MA_KHOA_HOC, GIA, MO_TA)
VALUES 
(1, 225000, 'Mức giá cơ bản - 9 USD'),
(1, 250000, 'Mức giá tiêu chuẩn - 10 USD'),
(1, 275000, 'Mức giá nâng cao - 11 USD'),
(1, 300000, 'Mức giá premium - 12 USD'),
(1, 325000, 'Mức giá premium+ - 13 USD'),
(1, 350000, 'Mức giá premium++ - 14 USD'),
(1, 375000, 'Mức giá premium+++ - 15 USD'),
(1, 400000, 'Mức giá premium++++ - 16 USD'),
(1, 425000, 'Mức giá premium+++++ - 17 USD'),
(1, 450000, 'Mức giá premium++++++ - 18 USD'),
(1, 475000, 'Mức giá premium+++++++ - 19 USD'),
(1, 500000, 'Mức giá premium++++++++ - 20 USD');

-- Thêm dữ liệu mẫu cho bảng NGUOI_DUNG
INSERT INTO NGUOI_DUNG (MA_NGUOI_DUNG, TEN_DANG_NHAP, MAT_KHAU, CON_HOAT_DONG)
VALUES 
(1, 'admin', 'admin123', 1),
(2, 'giangvien1', 'gv123', 1),
(3, 'hocvien1', 'hv123', 1),
(4, 'giangvien2', 'gv456', 1),
(5, 'hocvien2', 'hv456', 1);

-- Thêm dữ liệu mẫu cho bảng VAI_TRO
INSERT INTO VAI_TRO (TEN_VAI_TRO, MO_TA)
VALUES 
('Admin', 'Quản trị viên hệ thống'),
('GiangVien', 'Giảng viên'),
('HocVien', 'Học viên');

-- Thêm dữ liệu mẫu cho bảng QUYEN
INSERT INTO QUYEN (TEN_QUYEN, MO_TA)
VALUES 
('QuanLyHeThong', 'Quản lý toàn bộ hệ thống'),
('QuanLyKhoaHoc', 'Quản lý khóa học'),
('DangKyKhoaHoc', 'Đăng ký khóa học'),
('XemKhoaHoc', 'Xem nội dung khóa học');

-- Thêm dữ liệu mẫu cho bảng VAI_TRO_NGUOI_DUNG_
INSERT INTO VAI_TRO_NGUOI_DUNG_ (MA_NGUOI_DUNG, MA_VAI_TRO)
VALUES 
(1, 1), -- Admin
(2, 2), -- Giảng viên 1
(3, 3), -- Học viên 1
(4, 2), -- Giảng viên 2
(5, 3); -- Học viên 2

-- Thêm dữ liệu mẫu cho bảng VAI_TRO_QUYEN
INSERT INTO VAI_TRO_QUYEN (MA_VAI_TRO, MA_QUYEN)
VALUES 
(1, 1), -- Admin có quyền QuanLyHeThong
(2, 2), -- Giảng viên có quyền QuanLyKhoaHoc
(3, 3), -- Học viên có quyền DangKyKhoaHoc
(3, 4); -- Học viên có quyền XemKhoaHoc

-- Thêm dữ liệu mẫu cho bảng CHUONG_TRINH_DAO_TAO
INSERT INTO CHUONG_TRINH_DAO_TAO (TEN_CHUONG_TRINH, MO_TA)
VALUES 
('Lập trình Web', 'Chương trình đào tạo lập trình web cơ bản đến nâng cao'),
('Lập trình Mobile', 'Chương trình đào tạo lập trình ứng dụng di động'),
('Lập trình Backend', 'Chương trình đào tạo lập trình backend');

-- Thêm dữ liệu mẫu cho bảng DANH_MUC
INSERT INTO DANH_MUC (TEN_DANH_MUC, MO_TA, MA_DANH_MUC_CHA)
VALUES 
('Lập trình', 'Các khóa học về lập trình', NULL),
('Web Development', 'Khóa học về phát triển web', 1),
('Mobile Development', 'Khóa học về phát triển mobile', 1),
('Backend Development', 'Khóa học về phát triển backend', 1);

-- Thêm dữ liệu mẫu cho bảng CHU_DE_HOC
INSERT INTO CHU_DE_HOC (TEN_CHU_DE, MO_TA)
VALUES 
('HTML/CSS', 'Cơ bản về HTML và CSS'),
('JavaScript', 'Ngôn ngữ lập trình JavaScript'),
('React', 'Thư viện JavaScript cho UI'),
('Node.js', 'Môi trường thực thi JavaScript');

-- Thêm dữ liệu mẫu cho bảng TRINH_DO
INSERT INTO TRINH_DO (TEN_TRINH_DO, MO_TA)
VALUES 
('Cơ bản', 'Dành cho người mới bắt đầu'),
('Trung cấp', 'Dành cho người đã có kiến thức cơ bản'),
('Nâng cao', 'Dành cho người đã có kinh nghiệm');

-- Thêm dữ liệu mẫu cho bảng KHOA_HOC
INSERT INTO KHOA_HOC (MA_GIANG_VIEN, MA_DANH_MUC, MA_CHU_DE, MA_TRINH_DO, MA_CHUONG_TRINH, MA_GIA_GOC, TEN_KHOA_HOC, MO_TA, HINH_ANH, TRANG_THAI_KHOA_HOC, TRANG_THAI_DUYET, NGUOI_DUYET, NGAY_DUYET, THAM_GIA_UU_DAI)
VALUES 
(2, 2, 1, 1, 1, 1, 'HTML/CSS Cơ bản', 'Khóa học HTML/CSS dành cho người mới bắt đầu', 'html-css-basic.jpg', 1, 1, 1, NOW(), 0),
(2, 2, 2, 2, 1, 3, 'JavaScript Nâng cao', 'Khóa học JavaScript dành cho người đã có kiến thức cơ bản', 'js-advanced.jpg', 1, 1, 1, NOW(), 0),
(4, 3, 3, 3, 2, 7, 'React Masterclass', 'Khóa học React dành cho người đã có kinh nghiệm', 'react-master.jpg', 1, 1, 1, NOW(), 0);

-- Thêm dữ liệu mẫu cho bảng PHAN_HOC
INSERT INTO PHAN_HOC (MA_KHOA_HOC, TEN_PHAN_HOC, MO_TA, THU_TU)
VALUES 
(1, 'Giới thiệu HTML', 'Tổng quan về HTML', 1),
(1, 'Các thẻ HTML cơ bản', 'Học về các thẻ HTML thường dùng', 2),
(2, 'JavaScript ES6', 'Tính năng mới trong ES6', 1),
(2, 'Async/Await', 'Xử lý bất đồng bộ trong JavaScript', 2);

-- Thêm dữ liệu mẫu cho bảng BAI_GIANG
INSERT INTO BAI_GIANG (MA_PHAN_HOC, TEN_BAI_GIANG, MO_TA, NOI_DUNG_URL, THOI_LUONG)
VALUES 
(1, 'HTML là gì?', 'Giới thiệu về HTML', 'https://example.com/html-intro', 30),
(1, 'Cấu trúc HTML', 'Cấu trúc cơ bản của một trang HTML', 'https://example.com/html-structure', 45),
(2, 'Thẻ div và span', 'Học về thẻ div và span', 'https://example.com/div-span', 40);

-- Thêm dữ liệu mẫu cho bảng BAI_TAP
INSERT INTO BAI_TAP (MA_BAI_GIANG, TEN_BAI_TAP, MO_TA, LOAI_BAI_TAP, DIEM_TOI_DA)
VALUES 
(1, 'Bài tập HTML cơ bản', 'Tạo trang web đơn giản', 'Thực hành', 10),
(2, 'Bài tập cấu trúc HTML', 'Tạo cấu trúc HTML cho blog', 'Thực hành', 15);

-- Thêm dữ liệu mẫu cho bảng THAM_GIA_KHOA_HOC
INSERT INTO THAM_GIA_KHOA_HOC (MA_NGUOI_DUNG, MA_KHOA_HOC, TRANG_THAI_HOAN_THANH)
VALUES 
(3, 1, 0),
(5, 2, 0);

-- Thêm dữ liệu mẫu cho bảng TIEN_DO_BAI_GIANG
INSERT INTO TIEN_DO_BAI_GIANG (MA_DANG_KY, MA_BAI_GIANG, TRANG_THAI, THOI_GIAN_XEM)
VALUES 
(1, 1, 'dang_hoc', 15),
(1, 2, 'chua_hoc', 0);

-- Thêm dữ liệu mẫu cho bảng NOP_BAI_TAP
INSERT INTO NOP_BAI_TAP (MA_DANG_KY, MA_BAI_TAP, NOI_DUNG_NOP, DIEM, TRANG_THAI)
VALUES 
(1, 1, 'Bài làm của học viên', 8.5, 'da_nop');

-- Thêm dữ liệu mẫu cho bảng GIO_HANG
INSERT INTO GIO_HANG (MA_NGUOI_DUNG, TONG_TIEN, TRANG_THAI)
VALUES 
(3, 225000, 'cho_thanh_toan'),
(5, 275000, 'cho_thanh_toan');

-- Thêm dữ liệu mẫu cho bảng CHI_TIET_GIO_HANG
INSERT INTO CHI_TIET_GIO_HANG (MA_GIO_HANG, MA_KHOA_HOC, GIA_GOC, GIA_SAU_GIAM)
VALUES 
(1, 1, 225000, 225000),
(2, 2, 275000, 275000);

-- Thêm dữ liệu mẫu cho bảng DON_HANG
INSERT INTO DON_HANG (MA_NGUOI_DUNG, TONG_TIEN, TRANG_THAI)
VALUES 
(3, 225000, 'hoan_thanh'),
(5, 275000, 'hoan_thanh');

-- Thêm dữ liệu mẫu cho bảng CHI_TIET_DON_HANG với mã giảm giá
INSERT INTO CHI_TIET_DON_HANG (MA_DON_HANG, MA_KHOA_HOC, GIA, MA_GIAM_GIA, SO_TIEN_GIAM)
VALUES 
(1, 1, 225000, 3, 33750),  -- Sử dụng mã HTML15 (15% giảm)
(1, 2, 275000, 4, 55000),  -- Sử dụng mã JS20 (20% giảm)
(2, 3, 375000, 5, 93750),  -- Sử dụng mã REACT25 (25% giảm)
(3, 1, 225000, 1, 22500);  -- Sử dụng mã WELCOME10 (10% giảm)

-- Thêm dữ liệu mẫu cho bảng HO_SO_GIANG_VIEN
INSERT INTO HO_SO_GIANG_VIEN (MA_NGUOI_DUNG, KINH_NGHIEM, BANG_CAP, TIEU_SU, TRANG_THAI)
VALUES 
(2, '5 năm kinh nghiệm giảng dạy', 'Thạc sĩ Công nghệ thông tin', 'Giảng viên tại nhiều trường đại học', 'da_duyet'),
(4, '3 năm kinh nghiệm giảng dạy', 'Cử nhân Công nghệ thông tin', 'Freelancer và giảng viên', 'da_duyet');

-- Thêm dữ liệu mẫu cho bảng GIANG_VIEN_KHOA_HOC
INSERT INTO GIANG_VIEN_KHOA_HOC (MA_KHOA_HOC, MA_NGUOI_DUNG, LA_CHU_KHOA_HOC, QUYEN)
VALUES 
(1, 2, 1, 'edit'),
(2, 2, 1, 'edit'),
(3, 4, 1, 'edit');

-- Thêm dữ liệu mẫu cho bảng MA_GIAM_GIA_DA_SU_DUNG
INSERT INTO MA_GIAM_GIA_DA_SU_DUNG (MA_NGUOI_DUNG, MA_MA_GIAM_GIA, NGAY_SU_DUNG)
VALUES 
(3, 1, NOW()),
(4, 2, NOW()),
(5, 3, NOW());

-- Thêm dữ liệu mẫu cho bảng MA_GIAM_GIA
INSERT INTO MA_GIAM_GIA (MA_LOAI_GIAM, MA_KHOA_HOC, MA_NGUOI_DUNG, MA_DON_HANG, MA_GIAM_GIA, NGAY_BAT_DAU, NGAY_KET_THUC, TRANG_THAI)
VALUES 
(1, NULL, NULL, NULL, 'WELCOME10', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1),
(1, NULL, NULL, NULL, 'SUMMER20', NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 1),
(2, 1, NULL, NULL, 'HTML15', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
(2, 2, NULL, NULL, 'JS20', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
(2, 3, NULL, NULL, 'REACT25', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
(3, NULL, 3, NULL, 'VIP10', NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 1),
(3, NULL, 4, NULL, 'VIP15', NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 1),
(4, NULL, NULL, 1, 'FIRST10', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 1);

DELIMITER //

CREATE TRIGGER TRG_CHI_TIET_GIO_HANG_INSERT
BEFORE INSERT ON CHI_TIET_GIO_HANG
FOR EACH ROW
BEGIN
    -- Biến lưu thông tin từ bảng GIAM_GIA
    DECLARE ma_khoa_hoc_ma_giam INT;  -- MA_KHOA_HOC trong bảng GIAM_GIA là INT
    DECLARE ap_dung_toan_bo TINYINT(1);
    DECLARE ngay_bat_dau DATETIME;
    DECLARE ngay_ket_thuc DATETIME;
    DECLARE trang_thai TINYINT(1);
    DECLARE gia_tri DECIMAL(10,2);
    DECLARE so_lan_su_dung INT;
    DECLARE so_lan_da_su_dung INT;
    
    -- Lấy thông tin mã giảm giá từ bảng GIAM_GIA
    SELECT MA_KHOA_HOC, AP_DUNG_TOAN_BO, NGAY_BAT_DAU, NGAY_KET_THUC, TRANG_THAI, GIA_TRI, SO_LAN_SU_DUNG_TOI_DA
    INTO ma_khoa_hoc_ma_giam, ap_dung_toan_bo, ngay_bat_dau, ngay_ket_thuc, trang_thai, gia_tri, so_lan_su_dung
    FROM GIAM_GIA 
    WHERE MA_CODE = NEW.MA_GIAM_GIA;  -- MA_GIAM_GIA trong CHI_TIET_GIO_HANG là VARCHAR(50)
    
    -- Kiểm tra mã giảm giá có tồn tại không
    IF NEW.MA_GIAM_GIA IS NOT NULL AND ma_khoa_hoc_ma_giam IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Mã giảm giá không tồn tại';
    END IF;
    
    -- Kiểm tra các điều kiện
    IF trang_thai = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Mã giảm giá không còn hiệu lực';
    END IF;
    
    IF NOW() < ngay_bat_dau OR NOW() > ngay_ket_thuc THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Mã giảm giá không còn trong thời gian áp dụng';
    END IF;
    
    -- Kiểm tra số lần sử dụng
    IF so_lan_su_dung IS NOT NULL THEN
        SELECT COUNT(*) INTO so_lan_da_su_dung
        FROM MA_GIAM_GIA_DA_SU_DUNG
        WHERE MA_GIAM_GIA = NEW.MA_GIAM_GIA;  -- MA_GIAM_GIA trong MA_GIAM_GIA_DA_SU_DUNG là VARCHAR(50)
        
        IF so_lan_da_su_dung >= so_lan_su_dung THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Mã giảm giá đã hết số lần sử dụng';
        END IF;
    END IF;
    
    -- Kiểm tra mã giảm giá có áp dụng được cho khóa học không
    IF ap_dung_toan_bo = 0 AND ma_khoa_hoc_ma_giam IS NOT NULL AND ma_khoa_hoc_ma_giam != NEW.MA_KHOA_HOC THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Mã giảm giá không áp dụng được cho khóa học này';
    END IF;
    
    -- Cập nhật giá sau giảm
    SET NEW.GIA_SAU_GIAM = NEW.GIA_GOC * (1 - gia_tri / 100);
END //

DELIMITER ;

