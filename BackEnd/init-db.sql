-- --------------------------------------------------------
-- Database Creation and Privileges
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS blog_db;
CREATE DATABASE IF NOT EXISTS booking_db;
CREATE DATABASE IF NOT EXISTS review_db;
CREATE DATABASE IF NOT EXISTS user_db;

GRANT ALL PRIVILEGES ON blog_db.* TO 'root'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON booking_db.* TO 'root'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON review_db.* TO 'root'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON user_db.* TO 'root'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;

-- --------------------------------------------------------
-- User Database Setup
-- --------------------------------------------------------

USE user_db;

-- Create tables for user_db
CREATE TABLE IF NOT EXISTS roles (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     description VARCHAR(255),
    role_name VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     create_at DATETIME(6),
    email VARCHAR(255),
    full_name VARCHAR(255),
    gender INT,
    is_active BIT(1),
    pass_word VARCHAR(255),
    phone_number VARCHAR(255),
    update_at DATETIME(6),
    user_name VARCHAR(255),
    role_id BIGINT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert data into user_db
INSERT INTO roles (id, description, role_name) VALUES
                                                   (1, NULL, 'ADMIN'),
                                                   (2, NULL, 'USER');

INSERT INTO users (id, create_at, email, full_name, gender, is_active, pass_word, phone_number, update_at, user_name, role_id) VALUES
                                                                                                                                   (1, '2025-04-11 12:59:32.789005', 'admin@example.com', 'Admin User', 0, b'1', '$2a$10$qR.cNy.zsY3IGF4jIxoyS.vKqNg6ejeOBA3C7T2.Fsmc3OHKHLIzW', '0909999999', '2025-04-11 12:59:32.789005', 'user', 2),
                                                                                                                                   (2, '2025-04-12 01:04:15.289770', 'nguyentruongan0610@gmail.com', 'Nguyen Truong An', NULL, b'1', '$2a$10$qR.cNy.zsY3IGF4jIxoyS.vKqNg6ejeOBA3C7T2.Fsmc3OHKHLIzW', '1234167890', NULL, 'admin', 1),
                                                                                                                                   (3, '2025-04-15 23:32:59.986945', 'nguyenthaibao9a1tg2017@gmail.com', 'Nguyen Thai Bao', NULL, b'1', '$2a$10$1OGe4oVss7qs8cWQiDTOO.hz0eo81HVTMhLs5gerQYYAFMxhVpw2e', '1234567899', NULL, 'annguyen0', 2),
                                                                                                                                   (4, '2025-04-15 23:33:58.266983', 'annguyen1@gmail.com', 'Nguyen Truong An', NULL, b'1', '$2a$10$BcQjwUXoRQY.lk/pxfYJL.IdK..n8ygzWevRC6XTok3/qK.jphI9y', '1234567899', NULL, 'annguyen1', 2),
                                                                                                                                   (5, '2025-04-15 23:34:22.277436', 'annguyen2@gmail.com', 'Nguyen Truong An', NULL, b'1', '$2a$10$.wpL2kN1KLaIGSqOK3yTsuQhAxo6rmKRSsMlEGlXFXovJOujxYXU6', '1234567899', NULL, 'annguyen2', 2),
                                                                                                                                   (6, '2025-04-17 22:59:20.644566', 'annguyen2@gmail.com', 'Nguyen Truong An', NULL, b'1', '$2a$10$drT0UVFqUYJ6T11aeWxE8OrOzS.dEXZkRDNPnpNRdwVGSrGxJSy1y', '1234567899', NULL, 'annguyen3', 2),
                                                                                                                                   (7, '2025-04-18 15:05:03.092754', 'nguyenan@gmail.com', NULL, NULL, b'1', '$2a$10$2Gftp.jlqWhBdl2dH.aC7etqQk8YsVVe1dEnXPn1BHjVpT2HabI4S', '1234567890', NULL, 'andeptrai1', 1);

-- --------------------------------------------------------
-- Booking Database Setup
-- --------------------------------------------------------

-- --------------------------------------------------------
-- Review Database Setup
-- --------------------------------------------------------

USE review_db;

-- Create tables for review_db
CREATE TABLE IF NOT EXISTS reviews (
                                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                       comment TEXT,
                                       created_at DATETIME(6),
    rating INT,
    status VARCHAR(50),
    tour_id BIGINT,
    updated_at DATETIME(6),
    user_id BIGINT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS review_images (
                                             review_id BIGINT,
                                             image_url VARCHAR(255),
    FOREIGN KEY (review_id) REFERENCES reviews(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample review data
INSERT INTO reviews (id, comment, created_at, rating, status, tour_id, updated_at, user_id) VALUES
                                                                                                (1, 'Tour tuyệt vời! Hướng dẫn viên rất nhiệt tình.', '2025-03-30 11:43:55.000000', 5, 'APPROVED', 1, '2025-03-30 11:43:55.000000', 101),
                                                                                                (2, 'Cảnh đẹp nhưng thời tiết hơi nóng.', '2025-03-30 11:43:55.000000', 4, 'PENDING', 2, '2025-03-30 11:43:55.000000', 102),
                                                                                                (3, 'Dịch vụ ổn nhưng cần cải thiện về ăn uống.', '2025-03-30 11:43:55.000000', 3, 'REJECTED', 3, '2025-03-30 11:43:55.000000', 103);

INSERT INTO review_images (review_id, image_url) VALUES
                                                     (1, 'review1_img1.jpg'),
                                                     (1, 'review1_img2.jpg'),
                                                     (2, 'review2_img1.jpg'),
                                                     (3, 'review3_img1.jpg'),
                                                     (3, 'review3_img2.jpg'),
                                                     (3, 'review3_img3.jpg');

-- --------------------------------------------------------
-- Catalog Database Setup (assuming this is your booking_db)
-- --------------------------------------------------------

USE catalog_db;

-- Additional tables for tour management
CREATE TABLE IF NOT EXISTS activity_types (
                                              id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                              created_at DATETIME(6),
    is_active BIT(1),
    updated_at DATETIME(6),
    name VARCHAR(255),
    active BIT(1)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS locations (
                                         id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                         created_at DATETIME(6),
    is_active BIT(1),
    updated_at DATETIME(6),
    description TEXT,
    image_url VARCHAR(255),
    name VARCHAR(255),
    type VARCHAR(255),
    active BIT(1)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tour_types (
                                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                          created_at DATETIME(6),
    is_active BIT(1),
    updated_at DATETIME(6),
    description TEXT,
    name VARCHAR(255),
    active BIT(1)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tours (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     created_at DATETIME(6),
    is_active BIT(1),
    updated_at DATETIME(6),
    current_participants INT,
    description TEXT,
    discount INT,
    duration VARCHAR(255),
    end_date DATE,
    highlights TEXT,
    is_activity_tour BIT(1),
    max_participants INT,
    place_of_departure VARCHAR(255),
    price DECIMAL(19,2),
    start_date DATE,
    thumbnail VARCHAR(255),
    title VARCHAR(255),
    tour_code VARCHAR(255),
    location_id BIGINT,
    tour_type_id BIGINT,
    active BIT(1),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (tour_type_id) REFERENCES tour_types(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tour_activity (
                                             tour_id BIGINT,
                                             activity_type_id BIGINT,
                                             PRIMARY KEY (tour_id, activity_type_id),
    FOREIGN KEY (tour_id) REFERENCES tours(id),
    FOREIGN KEY (activity_type_id) REFERENCES activity_types(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tour_images (
                                           tour_id BIGINT,
                                           image_url VARCHAR(255),
    FOREIGN KEY (tour_id) REFERENCES tours(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert catalog data
INSERT INTO activity_types (id, created_at, is_active, updated_at, name, active) VALUES
                                                                                     (1, NULL, 0, NULL, 'Hidden Gems', 1),
                                                                                     (2, NULL, 0, NULL, 'Shopping', 1),
                                                                                     (3, NULL, 0, NULL, 'History Sites', 1),
                                                                                     (4, NULL, 0, NULL, 'Nightlife', 1),
                                                                                     (5, NULL, 0, NULL, 'Adventure', 1),
                                                                                     (6, NULL, 0, NULL, 'Local Culture', 1);

INSERT INTO locations (id, created_at, is_active, updated_at, description, image_url, name, type, active) VALUES
                                                                                                              (1, NULL, 0, NULL, NULL, 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Việt Nam', NULL, 1),
                                                                                                              (2, NULL, 0, NULL, NULL, 'https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?q=80&w=2008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Colombia', NULL, 1),
                                                                                                              (3, NULL, 0, NULL, NULL, 'https://plus.unsplash.com/premium_photo-1683120751032-41fdd5226ab6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Paris', NULL, 1),
                                                                                                              (4, NULL, 0, NULL, NULL, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Tokyo', NULL, 1),
                                                                                                              (5, NULL, 0, NULL, 'An iconic symbol of France located in Paris.', 'https://images.unsplash.com/photo-1611907671216-7ec6ef949163?q=80&w=2034&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Yemen', NULL, 1),
                                                                                                              (6, NULL, 0, NULL, 'A historic wall stretching across northern China.', 'https://images.unsplash.com/photo-1533682805518-48d1f5b8cd3a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Hongkong', NULL, 1),
                                                                                                              (7, NULL, 0, NULL, 'A symbol of freedom located in New York City.', 'https://images.unsplash.com/photo-1532454971774-3990903f4c6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'United State', NULL, 1),
                                                                                                              (8, NULL, 0, NULL, 'An ancient Incan city located in the Andes Mountains.', 'https://plus.unsplash.com/premium_photo-1664301183877-85b1070c12b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'India', NULL, 1),
                                                                                                              (9, NULL, 0, NULL, 'A multi-venue performing arts center in Sydney.', 'https://plus.unsplash.com/premium_photo-1661963468634-71b9482a3efe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Korea', NULL, 1),
                                                                                                              (41, NULL, 0, NULL, 'A white marble mausoleum in Agra, India.', 'https://plus.unsplash.com/premium_photo-1678303397238-76250a5ebf73?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Malaysia', NULL, 1);

INSERT INTO tour_types (id, created_at, is_active, updated_at, description, name, active) VALUES
                                                                                              (1, NULL, 0, NULL, 'Tours that involve exciting and potentially risky activities.', 'Adventure', 1),
                                                                                              (2, NULL, 0, NULL, 'Tours that focus on the culture and heritage of a destination.', 'Cultural', 1),
                                                                                              (3, NULL, 0, NULL, 'Tours that explore historical sites and landmarks.', 'Historical', 1),
                                                                                              (4, NULL, 0, NULL, 'Tours that focus on natural landscapes and wildlife.', 'Nature', 1),
                                                                                              (5, NULL, 0, NULL, 'High-end tours with premium services and accommodations.', 'Luxury', 1),
                                                                                              (6, NULL, 0, NULL, 'Tours designed for families with activities suitable for all ages.', 'Family', 1),
                                                                                              (7, NULL, 0, NULL, 'Tours designed for couples looking for a romantic getaway.', 'Romantic', 1),
                                                                                              (8, NULL, 0, NULL, 'Tours that involve traveling on a cruise ship.', 'Cruise', 1),
                                                                                              (9, NULL, 0, NULL, 'Tours that focus on culinary experiences and wine tasting.', 'Food & Wine', 1),
                                                                                              (10, NULL, 0, NULL, 'Tours that focus on health, wellness, and relaxation.', 'Experience', 1);

INSERT INTO tours (id, created_at, is_active, updated_at, current_participants, description, discount, duration, end_date, highlights, is_activity_tour, max_participants, place_of_departure, price, start_date, thumbnail, title, tour_code, location_id, tour_type_id, active) VALUES
                                                                                                                                                                                                                                                                                      (1, NULL, 1, '2025-04-18 16:00:32.410726', 3, 'Khám phá phố cổ Hà Nội', 0, '3 ngày 2 đêm', '2025-08-12', '<p>This is a <strong>bold</strong> text with a <em>line break</em>.<br/>Here is a new line.</p>', b'0', 20, 'Ben Thanh Market', 300, '2025-08-10 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339822/booking/photo-1639806413641-7fee4d566b69_xuketl.avif', 'Hanoi Fall', 'TVN100425', 1, 1, 1),
                                                                                                                                                                                                                                                                                      (2, NULL, 1, NULL, 1, 'Tận hưởng biển xanh cát trắng', 0, '4 ngày 3 đêm', '2025-08-04', NULL, b'0', 15, '', 400, '2025-08-01 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339912/booking/photo-1603852452378-a4e8d84324a2_cbi2l4.avif', 'Ba Na Hill', NULL, 2, 2, 1),
                                                                                                                                                                                                                                                                                      (6, NULL, 1, NULL, 20, 'Explore the beautiful city of Paris.', 10, '7 days', '2024-08-08', NULL, b'0', 20, 'New York', 1500, '2024-08-01 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339379/booking/photo-1671883017596-3d418ace8c4c_gkbamw.avif', 'Paris Adventure', 'T001', 1, 1, 1),
                                                                                                                                                                                                                                                                                      (7, NULL, 1, NULL, 0, 'Walk along the historic Great Wall of China.', 15, '5 days', '2024-06-15', NULL, b'0', 15, 'Beijing', 866, '2024-06-10 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744338975/booking/photo-1608037521244-f1c6c7635194_ifd1fc.avif', 'Great Wall Experience', 'T002', 2, 2, 1),
                                                                                                                                                                                                                                                                                      (8, NULL, 1, NULL, 20, 'Discover the landmarks of New York City.', 5, '4 days', '2024-07-24', NULL, b'0', 25, 'Los Angeles', 1200, '2024-07-20 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339315/booking/photo-1602940659805-770d1b3b9911_s9ezvi.avif', 'New York City Tour', 'T003', 3, 3, 1),
                                                                                                                                                                                                                                                                                      (10, NULL, 1, NULL, 25, 'Visit the iconic Sydney Opera House.', 10, '3 days', '2024-09-08', NULL, b'0', 30, 'Sydney', 800, '2024-09-05 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339424/booking/photo-1719402715882-46a5120d491c_hy0fvr.avif', 'Sydney Opera House Tour', 'T005', 1, 5, 1),
                                                                                                                                                                                                                                                                                      (12, NULL, 1, NULL, 40, 'See the magnificent Taj Mahal in Agra.', 8, '2 days', '2024-11-03', NULL, b'1', 50, 'Delhi', 1400, '2024-11-01 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339521/booking/photo-1548013146-72479768bada_o0fdfq.avif', 'Taj Mahal Visit', 'T007', 3, 7, 1),
                                                                                                                                                                                                                                                                                      (13, NULL, 1, NULL, 18, 'Experience the vibrant city of Rio de Janeiro.', 10, '4 days', '2024-12-09', NULL, b'1', 20, 'Rio de Janeiro', 400, '2024-12-05 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339565/booking/photo-1544989164-31dc3c645987_agybqv.avif', 'Rio de Janeiro Highlights', 'T008', 4, 8, 1),
                                                                                                                                                                                                                                                                                      (14, NULL, 1, NULL, 0, 'Climb the highest peak in Japan.', 15, '3 days', '2025-01-13', NULL, b'1', 15, 'Tokyo', 1900, '2025-01-10 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339612/booking/photo-1578271887552-5ac3a72752bc_a2tbgp.avif', 'Mount Fuji Climb', 'T009', 2, 9, 1),
                                                                                                                                                                                                                                                                                      (15, NULL, 1, '2025-04-16 02:42:49.506680', 0, 'Relax on the beautiful island of Santorini.', 20, '5 days', '2025-08-25', NULL, b'1', 10, 'Athens', 2100, '2025-08-20 00:00:00.000000', 'https://res.cloudinary.com/dzwjgfd7t/image/upload/v1744339672/booking/photo-1739310754891-ffcd7c0a7064_seumlp.avif', 'Santorini Getaway', 'T010', 4, 10, 1);

INSERT INTO tour_activity (tour_id, activity_type_id) VALUES
                                                          (14, 1),
                                                          (15, 1),
                                                          (14, 2),
                                                          (12, 4),
                                                          (13, 4),
                                                          (13, 6),
                                                          (14, 6),
                                                          (15, 6);

INSERT INTO tour_images (tour_id, image_url) VALUES
                                                 (1, 'https://picsum.photos/282'),
                                                 (1, 'https://picsum.photos/362'),
                                                 (1, 'https://picsum.photos/622'),
                                                 (1, 'https://picsum.photos/298'),
                                                 (1, 'https://picsum.photos/230');

-- --------------------------------------------------------
-- Blog Database Setup (minimal example)
-- --------------------------------------------------------
