-- Asset Valet v2 - Full Schema + Rich Dummy Data
-- Run: psql -U postgres -d asset_valet -f db/schema.sql

DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================
-- TABLES
-- ============================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin','employee')),
  department VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(150),
  serial_number VARCHAR(150),
  status VARCHAR(50) NOT NULL DEFAULT 'available'
    CHECK (status IN ('available','assigned','damaged','in_repair','lost','retired')),
  purchase_date DATE,
  purchase_price NUMERIC(10,2),
  location VARCHAR(150),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by INTEGER REFERENCES users(id),
  notes TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  returned_at TIMESTAMPTZ
);

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  reported_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  condition VARCHAR(50) NOT NULL CHECK (condition IN ('damaged','in_repair','lost','other')),
  description TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved','pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_asgn_user ON assignments(user_id);
CREATE INDEX idx_asgn_asset ON assignments(asset_id);
CREATE INDEX idx_rep_asset ON reports(asset_id);
CREATE INDEX idx_rep_user ON reports(reported_by);

-- ============================
-- USERS
-- password for admin = Admin@123
-- password for employees = Pass@123
-- ============================

INSERT INTO users (username, full_name, email, password_hash, role, department) VALUES
('admin',         'Alex Morgan',    'admin@assetvalet.com',         '$2b$10$B6nIWW7kEacbZOiUk2BIxuZlNeZkWv7QmzlQApGQKngxFGVJkYKDW', 'admin',    'IT'),
('sara.khan',     'Sara Khan',      'sara.khan@company.com',        '$2b$10$tSPruztDP5xaKGKGjDJbO.nrMU2OxBNtBmB1oXnkQw0H4pm4dQCJ6', 'employee', 'Engineering'),
('john.doe',      'John Doe',       'john.doe@company.com',         '$2b$10$tSPruztDP5xaKGKGjDJbO.nrMU2OxBNtBmB1oXnkQw0H4pm4dQCJ6', 'employee', 'Design'),
('priya.sharma',  'Priya Sharma',   'priya.sharma@company.com',     '$2b$10$tSPruztDP5xaKGKGjDJbO.nrMU2OxBNtBmB1oXnkQw0H4pm4dQCJ6', 'employee', 'Marketing'),
('mike.chen',     'Mike Chen',      'mike.chen@company.com',        '$2b$10$tSPruztDP5xaKGKGjDJbO.nrMU2OxBNtBmB1oXnkQw0H4pm4dQCJ6', 'employee', 'Sales'),
('aisha.patel',   'Aisha Patel',    'aisha.patel@company.com',      '$2b$10$tSPruztDP5xaKGKGjDJbO.nrMU2OxBNtBmB1oXnkQw0H4pm4dQCJ6', 'employee', 'Engineering'),
('david.lee',     'David Lee',      'david.lee@company.com',        '$2b$10$tSPruztDP5xaKGKGjDJbO.nrMU2OxBNtBmB1oXnkQw0H4pm4dQCJ6', 'employee', 'HR'),
('fatima.ali',    'Fatima Ali',     'fatima.ali@company.com',       '$2b$10$tSPruztDP5xaKGKGjDJbO.nrMU2OxBNtBmB1oXnkQw0H4pm4dQCJ6', 'employee', 'Finance');

-- ============================
-- ASSETS (20 items)
-- ============================

INSERT INTO assets (name, type, brand, model, serial_number, status, purchase_date, purchase_price, location, notes) VALUES
('MacBook Pro 14"',          'Laptop',          'Apple',    'MacBook Pro M3',      'SN-MBP-001', 'assigned',   '2023-03-10', 2499.00, 'Office Floor 2', 'M3 Pro chip, 18GB RAM, 512GB SSD'),
('MacBook Air 13"',          'Laptop',          'Apple',    'MacBook Air M2',      'SN-MBA-002', 'assigned',   '2023-05-22', 1299.00, 'Office Floor 2', 'M2 chip, 8GB RAM, 256GB SSD'),
('ThinkPad X1 Carbon',       'Laptop',          'Lenovo',   'X1 Carbon Gen 11',   'SN-TPX-003', 'assigned',   '2022-08-05', 1899.00, 'Office Floor 1', 'Intel i7, 16GB RAM, 512GB SSD'),
('Dell XPS 15',              'Laptop',          'Dell',     'XPS 15 9530',        'SN-DXP-004', 'available',  '2023-09-14', 1799.00, 'IT Storage',     'i9 processor, 32GB RAM, OLED display'),
('HP EliteBook 840',         'Laptop',          'HP',       'EliteBook 840 G10',  'SN-HPE-005', 'available',  '2023-01-18', 1299.00, 'IT Storage',     'Business laptop, Windows 11 Pro'),
('Sony WH-1000XM5',          'Headphones',      'Sony',     'WH-1000XM5',         'SN-SNY-006', 'assigned',   '2023-01-15',  349.00, 'Office Floor 2', 'Noise-cancelling, Bluetooth 5.2'),
('Jabra Evolve2 85',         'Headphones',      'Jabra',    'Evolve2 85',         'SN-JBR-007', 'assigned',   '2023-06-10',  449.00, 'Office Floor 1', 'UC certified, ANC, all-day battery'),
('Bose QuietComfort 45',     'Headphones',      'Bose',     'QC45',               'SN-BSE-008', 'available',  '2022-11-20',  329.00, 'IT Storage',     'Wireless headphones'),
('Dell Monitor 27" 4K',      'Monitor',         'Dell',     'U2723D',             'SN-DLM-009', 'assigned',   '2023-02-20',  599.00, 'Office Floor 2', '4K IPS, USB-C 90W PD, pivot stand'),
('LG UltraWide 34"',         'Monitor',         'LG',       '34WN80C-B',          'SN-LGM-010', 'available',  '2023-04-05',  699.00, 'IT Storage',     '34" curved ultrawide, USB-C'),
('Samsung Galaxy S24 Ultra', 'Mobile Phone',    'Samsung',  'Galaxy S24 Ultra',   'SN-SGS-011', 'assigned',   '2024-02-10', 1299.00, 'Office Floor 1', '256GB, Titanium Black'),
('iPhone 15 Pro',            'Mobile Phone',    'Apple',    'iPhone 15 Pro',      'SN-IPH-012', 'assigned',   '2023-09-22',  999.00, 'Office Floor 2', '256GB, Natural Titanium'),
('iPad Air 5th Gen',         'Tablet',          'Apple',    'iPad Air M1',        'SN-IPA-013', 'available',  '2023-06-18',  749.00, 'IT Storage',     'WiFi + Cellular, 64GB'),
('Microsoft Surface Pro 9',  'Tablet',          'Microsoft','Surface Pro 9',      'SN-MSP-014', 'damaged',    '2022-10-30', 1299.00, 'Repair Shop',    'Screen cracked, sent to repair'),
('Logitech MX Keys',         'Keyboard',        'Logitech', 'MX Keys',            'SN-LGK-015', 'available',  '2023-04-05',  109.00, 'IT Storage',     'Wireless, multi-device, backlit'),
('Apple Magic Keyboard',     'Keyboard',        'Apple',    'Magic Keyboard',     'SN-AMK-016', 'assigned',   '2023-03-10',   99.00, 'Office Floor 2', 'Touch ID, USB-C, space gray'),
('Logitech C920 Pro',        'Webcam',          'Logitech', 'C920 Pro HD',        'SN-LGW-017', 'assigned',   '2023-05-12',   79.00, 'Office Floor 1', 'Full HD 1080p, stereo audio'),
('Elgato Facecam',           'Webcam',          'Elgato',   'Facecam Pro',        'SN-ELG-018', 'available',  '2023-08-22',  199.00, 'IT Storage',     '4K60 Ultra HD, DSLR quality'),
('HP LaserJet Pro M404n',    'Printer',         'HP',       'LaserJet M404n',     'SN-HPP-019', 'available',  '2022-11-30',  299.00, 'Office Floor 1', 'Mono laser, network, 38ppm'),
('Dell WD22TB4 Dock',        'Docking Station', 'Dell',     'WD22TB4',            'SN-DLD-020', 'in_repair',  '2023-01-20',  299.00, 'Repair Shop',    'Thunderbolt 4, USB-C, in repair');

-- ============================
-- ASSIGNMENTS
-- ============================

-- Active assignments
INSERT INTO assignments (asset_id, user_id, assigned_by, notes, assigned_at) VALUES
(1,  2, 1, 'Primary work laptop', '2023-03-15 09:00:00'),   -- MacBook Pro -> Sara
(3,  3, 1, 'Developer laptop', '2022-08-10 10:00:00'),      -- ThinkPad -> John
(6,  2, 1, 'For video calls and focus work', '2023-01-20 11:00:00'), -- Sony Headphones -> Sara
(7,  4, 1, 'Marketing team headset', '2023-06-15 09:30:00'), -- Jabra -> Priya
(9,  2, 1, 'External display', '2023-02-25 08:00:00'),      -- Dell Monitor -> Sara
(11, 5, 1, 'Sales team phone', '2024-02-12 09:00:00'),      -- Samsung -> Mike
(12, 4, 1, 'Marketing phone', '2023-09-25 10:30:00'),       -- iPhone -> Priya
(16, 3, 1, 'Keyboard for laptop setup', '2023-03-15 09:00:00'), -- Magic Keyboard -> John
(17, 6, 1, 'Webcam for remote meetings', '2023-05-15 10:00:00'), -- Webcam -> Aisha
(2,  6, 1, 'Secondary laptop', '2023-05-25 09:00:00');      -- MacBook Air -> Aisha

-- Returned assignments (history)
INSERT INTO assignments (asset_id, user_id, assigned_by, notes, assigned_at, returned_at) VALUES
(4, 7, 1, 'Temporary use', '2023-09-20 09:00:00', '2023-12-01 17:00:00'),
(8, 7, 1, 'Noise cancellation needed', '2022-12-01 09:00:00', '2023-03-15 17:00:00'),
(13, 3, 1, 'For client presentations', '2023-06-20 10:00:00', '2023-08-30 17:00:00');

-- Update asset statuses to match
UPDATE assets SET status='assigned' WHERE id IN (1,2,3,6,7,9,11,12,16,17);

-- ============================
-- REPORTS (rich data)
-- ============================

INSERT INTO reports (asset_id, reported_by, condition, description, status, created_at) VALUES
(14, 4, 'damaged',   'Screen has a large crack from top-right corner. Happened during transport in bag. Device still powers on but display is unusable.', 'open',     '2024-01-15 10:30:00'),
(20, 5, 'in_repair', 'Thunderbolt dock stopped working suddenly. IT department has taken it for diagnostics. Ports not detecting connected devices.', 'pending',  '2024-01-18 14:00:00'),
(3,  3, 'other',     'Battery drains from 100% to 0% in about 3 hours. Used to last 8+ hours. Might need battery replacement.', 'open',     '2024-01-20 09:15:00'),
(11, 5, 'other',     'Phone overheats when charging wirelessly. Gets too hot to hold after 15 minutes of charging. Wired charging works fine.', 'pending',  '2024-01-22 16:45:00'),
(9,  2, 'damaged',   'USB-C port on the monitor is loose. Cable keeps falling out. Charging stopped working through monitor.', 'resolved', '2024-01-10 11:00:00'),
(6,  2, 'in_repair', 'Left ear cushion is coming off. The adhesive has worn out. Still functions but uncomfortable.', 'resolved', '2023-12-20 13:30:00'),
(12, 4, 'lost',      'Phone was lost during the company offsite event last weekend. Have retraced steps but cannot locate it. Filed report with security.', 'open',     '2024-01-25 08:00:00'),
(7,  4, 'damaged',   'Headset boom microphone broke off at the hinge. Cannot be repositioned. Audio still works via the boom but it is at a fixed angle.', 'pending',  '2024-01-28 10:00:00');
