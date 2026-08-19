-- =========================================================================
-- PROJECT DNA: SUPABASE SEED DATA
-- Pre-populated Faculties, Departments, Projects, DNA Cards, Lineages & Challenges
-- Kasetsart University Chalermphrakiat Sakon Nakhon Campus (KU CSC)
-- =========================================================================

-- 1. Insert Faculties (4 คณะของ มก.ฉกส.)
INSERT INTO faculties (id, name_th, name_en, short_name, color_hex) VALUES
('fac-kuse', 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์', 'Faculty of Science and Engineering', 'KUSE', '#2563EB'),
('fac-fam', 'คณะศิลปศาสตร์และวิทยาการจัดการ', 'Faculty of Liberal Arts and Management Science', 'FAM', '#F59E0B'),
('fac-fnra', 'คณะทรัพยากรธรรมชาติและอุตสาหกรรมเกษตร', 'Faculty of Natural Resources and Agro-Industry', 'FNRA', '#10B981'),
('fac-fph', 'คณะสาธารณสุขศาสตร์', 'Faculty of Public Health', 'FPH', '#EC4899')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Departments (ทุกสาขาวิชาใน มก.ฉกส.)
INSERT INTO departments (id, faculty_id, code, name_th, name_en) VALUES
-- คณะวิทยาศาสตร์และวิศวกรรมศาสตร์ (KUSE)
('dept-cpe', 'fac-kuse', 'CPE', 'วิศวกรรมคอมพิวเตอร์', 'Computer Engineering'),
('dept-cs', 'fac-kuse', 'CS', 'วิทยาการคอมพิวเตอร์', 'Computer Science'),
('dept-it', 'fac-kuse', 'IT', 'เทคโนโลยีสารสนเทศ', 'Information Technology'),
('dept-me', 'fac-kuse', 'ME', 'วิศวกรรมเครื่องกลและการผลิต', 'Mechanical & Manufacturing Engineering'),
('dept-ee', 'fac-kuse', 'EE', 'วิศวกรรมไฟฟ้า', 'Electrical Engineering'),
('dept-ce', 'fac-kuse', 'CE', 'วิศวกรรมโยธาและสิ่งแวดล้อม', 'Civil & Environmental Engineering'),
('dept-ie', 'fac-kuse', 'IE', 'วิศวกรรมอุตสาหการและโลจิสติกส์', 'Industrial Engineering and Logistics'),
('dept-ac', 'fac-kuse', 'AC', 'เคมีประยุกต์', 'Applied Chemistry'),

-- คณะศิลปศาสตร์และวิทยาการจัดการ (FAM)
('dept-mgt', 'fac-fam', 'MGT', 'การจัดการ', 'Management'),
('dept-mkt', 'fac-fam', 'MKT', 'การตลาด', 'Marketing'),
('dept-fin', 'fac-fam', 'FIN', 'การเงิน', 'Finance'),
('dept-acc', 'fac-fam', 'ACC', 'การบัญชี', 'Accounting'),
('dept-htm', 'fac-fam', 'HTM', 'การจัดการโรงแรมและท่องเที่ยว', 'Hospitality and Tourism Management'),
('dept-ebc', 'fac-fam', 'EBC', 'ภาษาอังกฤษเพื่อการสื่อสารธุรกิจ', 'English for Business Communication'),
('dept-pa', 'fac-fam', 'PA', 'รัฐประศาสนศาสตร์', 'Public Administration'),

-- คณะทรัพยากรธรรมชาติและอุตสาหกรรมเกษตร (FNRA)
('dept-as', 'fac-fnra', 'AS', 'สัตวศาสตร์', 'Animal Science'),
('dept-ps', 'fac-fnra', 'PS', 'พืชศาสตร์', 'Plant Science'),
('dept-fish', 'fac-fnra', 'FISH', 'ประมง', 'Fisheries'),
('dept-fst', 'fac-fnra', 'FST', 'วิทยาศาสตร์และเทคโนโลยีการอาหาร', 'Food Science and Technology'),
('dept-arm', 'fac-fnra', 'ARM', 'ทรัพยากรเกษตรและการจัดการการผลิต', 'Agricultural Resources Management'),

-- คณะสาธารณสุขศาสตร์ (FPH)
('dept-ph', 'fac-fph', 'PH', 'สาธารณสุขศาสตร์', 'Public Health'),
('dept-eh', 'fac-fph', 'EH', 'อนามัยสิ่งแวดล้อม', 'Environmental Health'),
('dept-ohs', 'fac-fph', 'OHS', 'อาชีวอนามัยและความปลอดภัย', 'Occupational Health and Safety')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Projects
INSERT INTO projects (id, title_th, title_en, abstract_th, abstract_en, academic_year, status, department_id, cover_image_url, rating_score, view_count, fork_count) VALUES
('proj-1', 
 'ระบบควบคุมอุณหภูมิและความชื้นในกระบวนการหมักครามธรรมชาติด้วย IoT', 
 'IoT Temperature and Humidity Monitoring for Natural Indigo Fermentation',
 'พัฒนากล่องเซ็นเซอร์ IoT เพื่อตรวจวัดค่า pH อุณหภูมิ และความชื้นในการหมักครามพื้นเมืองสกลนคร เพื่อควบคุมคุณภาพสีครามให้สม่ำเสมอ ลดความเสียหายจากการเน่าเสียของเนื้อคราม',
 'An IoT sensor unit monitoring pH, temp, and moisture in traditional Sakon Nakhon indigo fermentation vats.',
 2566, 'completed', 'dept-me', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', 4.9, 1420, 18),

('proj-2',
 'ระบบประเมินเกรดสีครามและตรวจจับข้อบกพร่องผ้าย้อมครามด้วย Computer Vision',
 'Computer Vision-based Indigo Dye Quality Grading and Defect Inspection',
 'ต่อยอดจากระบบ IoT หมักคราม (รุ่นพี่ 2566) โดยนำกล้องอุตสาหกรรมและโมเดล YOLOv8 มาจำแนกเกรดเฉดสีคราม 5 ระดับ และตรวจจับรอยด่างบนผืนผ้าอัตโนมัติ พร้อมส่งออกรายงานรับรองคุณภาพผ้ามัดย้อมสกลนคร',
 'Extending the IoT fermentation baseline by applying industrial cameras and YOLOv8 for automated 5-level indigo color grading and weave defect detection.',
 2567, 'completed', 'dept-cs', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=60', 4.95, 1980, 24),

('proj-3',
 'ระบบสูบน้ำพลังงานแสงอาทิตย์อัจฉริยะควบคุมผ่าน LoRaWAN สำหรับพื้นที่การเกษตรลุ่มน้ำก่ำ',
 'Smart Solar-Powered Water Pumping with LoRaWAN Telemetry for Nam Kam Basin',
 'ออกแบบระบบโซลาร์ปั๊มน้ำระยะไกลด้วยสัญญาณ LoRaWAN ครอบคลุมรัศมี 10 กิโลเมตร เพื่อสูบน้ำเข้านาข้าวและสวนผลไม้ในช่วงหน้าแล้งแบบอัตโนมัติผ่านพลังงานสะอาด',
 'A 10km LoRaWAN telemetry network controlling solar water pumps for remote farmland irrigation.',
 2566, 'completed', 'dept-ee', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=60', 4.75, 1150, 15),

('proj-4',
 'แบบจำลองทำนายวิกฤตน้ำแล้งล่วงหน้าและจัดสรรโควตาน้ำลุ่มน้ำก่ำด้วย LSTM AI',
 'LSTM Deep Learning for Drought Forecasting and Water Allocation in Nam Kam Basin',
 'ต่อยอดจากโครงข่ายเซ็นเซอร์ LoRaWAN (2566) โดยรวบรวมข้อมูลระดับน้ำ ย้อนหลัง 3 ปี มาเทรนโมเดล LSTM เพื่อทำนายระดับน้ำล่วงหน้า 14 วัน และแนะนำแผนการเปิด-ปิดประตูระบายน้ำอัตโนมัติ',
 'Incorporating historical sensor data from 2026 LoRa stations into an LSTM network predicting water levels 14 days ahead.',
 2567, 'completed', 'dept-cpe', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=60', 4.92, 1340, 22),

('proj-5',
 'ระบบประเมินน้ำหนักและติดตามพฤติกรรมสุขภาพโคขุนโพนยางคำแบบไม่สัมผัสด้วย 3D Vision',
 'Non-contact 3D Vision Weight Estimation and Behavior Tracking for Pon Yang Kham Cattle',
 'ใช้กล้อง Depth Sensor (RealSense) และโมเดล PointNet ในการสแกนรูปร่างโคขุนขณะเดินผ่านช่องตรวจ เพื่อคำนวณน้ำหนักตัวแบบแม่นยำสูงถึง 94% โดยไม่ต้องนำวัวขึ้นเครื่องชั่งจริง ลดความเครียดและอันตรายของสัตว์',
 '3D point cloud cattle body dimension scanning to estimate live weight with 94% accuracy without physical weighing scales.',
 2567, 'completed', 'dept-as', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=60', 4.88, 1620, 25),

('proj-6',
 'โดรนการเกษตรตรวจจับและฉีดพ่นสารชีวภัณฑ์กำจัดวัชพืชแปลงข้าวฮางแบบจำเพาะจุดด้วย Edge AI',
 'Precision Edge-AI Agricultural Drone for Targeted Organic Weed Spraying in Hang Rice Fields',
 'พัฒนาโดรนพ่นสารชีวภัณฑ์ติดตั้งชิป Edge AI (Jetson Orin Nano) บินสำรวจและฉีดพ่นเฉพาะจุดที่มีวัชพืชระบาด ลดการใช้สารชีวภัณฑ์ลง 65% และบันทึกพิกัด GPS อัตโนมัติ',
 'Autonomous drone powered by Jetson Orin detecting weeds in real-time and performing targeted spraying.',
 2568, 'in_progress', 'dept-me', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=60', 4.95, 2100, 31),

('proj-7',
 'อุปกรณ์สวมใส่อัจฉริยะตรวจจับการหกล้มและติดตามกายภาพบำบัดทางไกลสำหรับผู้สูงอายุในชนบท',
 'Smart Wearable Fall Detection and Remote Tele-Rehabilitation for Rural Elderly',
 'สายรัดข้อมือฝังเซ็นเซอร์ IMU 6-axis ประมวลผลอัลกอริทึม TinyML บนไมโครคอนโทรลเลอร์ ตรวจจับการล้มฉับพลันและส่งสัญญาณขอความช่วยเหลือผ่านเครือข่ายมือถือไปยัง รพ.สต. ใน 3 วินาที',
 'TinyML wearable on wrist detecting accidental falls within 3 seconds and alerting local healthcare units.',
 2567, 'completed', 'dept-ph', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60', 4.78, 890, 9),

('proj-8',
 'ระบบตรวจวัดและบริหารจัดการถังหมักก๊าซชีวภาพจากเศษอาหารโรงอาหาร มก.ฉกส. อัจฉริยะ',
 'Smart Biogas Digester Monitoring and Food Waste Optimization for KUSE Campus Cafeteria',
 'เปลี่ยนเศษอาหาร 300 กก./วัน ในโรงอาหารมหาวิทยาลัยเป็นพลังงานก๊าซชีวภาพ พร้อมแดชบอร์ดแสดงผลการผลิตก๊าซมีเทนและประหยัดพลังงานแบบเรียลไทม์',
 'Transforming 300kg daily campus food waste into green biogas with real-time energy telemetry.',
 2568, 'completed', 'dept-ce', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=60', 4.82, 760, 14)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert DNA Cards
INSERT INTO dna_cards (id, project_id, problem_statement, target_users, tech_stack, key_outcomes, limitations, hardware_specs, dataset_description, repository_url, demo_url, advisor_name) VALUES
('dna-1', 'proj-1',
 'การหมักครามแบบดั้งเดิมใช้ความชำนาญส่วนบุคคล ทำให้สีครามไม่คงที่ เสียหายบ่อยครั้งเมื่อสภาพอากาศเปลี่ยน ส่งผลให้สูญเสียรายได้ของชุมชน',
 ARRAY['กลุ่มวิสาหกิจชุมชนผ้าย้อมครามสกลนคร', 'ผู้ประกอบการ OTOP 5 ดาว', 'นักวิจัยภูมิปัญญาท้องถิ่น'],
 ARRAY['ESP32', 'Arduino C++', 'MQTT', 'Node-RED', 'pH Sensor Probe', 'DS18B20'],
 ARRAY['ลดความเสียหายของการเน่าเสียของครามได้ 40%', 'ตรวจวัดค่า pH และอุณหภูมิได้ต่อเนื่อง 24 ชม.', 'แจ้งเตือนผ่าน LINE Notify เมื่อค่าหลุดเกณฑ์ความปลอดภัย'],
 ARRAY['แบตเตอรี่ใช้งานได้ 5 วันต่อการชาร์จ', 'หัววัด pH ต้อง Calibrate ทุกๆ 2 สัปดาห์', 'ยังไม่มีระบบเติมสารด่างและน้ำหมักอัตโนมัติ'],
 'ESP32 Dev Module, Industrial Glass pH Electrode, Waterproof Temp Probe, Solar Panel 10W, Waterproof Box IP67',
 'Time-series dataset ค่า pH และอุณหภูมิการหมักคราม 180 วัน ใน 12 บ่อหมัก (CSV 28.5MB)',
 'https://github.com/Woraphob3938/indigo-ferment-iot',
 'https://indigo-iot.kuse.ac.th',
 'อาจารย์ประจำสาขาวิชาวิศวกรรมเครื่องกลและการผลิต'),

('dna-2', 'proj-2',
 'การตรวจสอบคุณภาพและเฉดสีของผ้าย้อมครามส่งออกยังใช้สายตามนุษย์ ทำให้เกิดความผิดพลาดและข้อพิพาทเรื่องมาตรฐานสีกับผู้ซื้อต่างประเทศ',
 ARRAY['ผู้ส่งออกผ้าคราม', 'ศูนย์หม่อนไหมเฉลิมพระเกียรติ', 'ผู้ตรวจรับมาตรฐาน มผช.'],
 ARRAY['Python', 'PyTorch', 'YOLOv8', 'FastAPI', 'Next.js', 'OpenCV'],
 ARRAY['ความแม่นยำจำแนก 5 เฉดสีครามธรรมชาติ 96.4%', 'ตรวจจับรอยด่างเส้นด้ายขนาด 2mm ได้ใน 150ms', 'ออกใบ Certificate พร้อม QR Code ดิจิทัลยืนยันคุณภาพผืนผ้า'],
 ARRAY['ต้องการแสงสว่างควบคุมมาตรฐาน (Light Box 6500K)', 'ยังไม่รองรับผ้าทอลายซับซ้อนมาก เช่น ลายพญานาคโบราณ'],
 'Industrial USB3 Camera 12MP, Controlled LED 6500K Lightbox, Raspberry Pi 5 / Coral TPU Accelerator',
 'ชุดภาพถ่ายผ้าย้อมครามแท้และสังเคราะห์ 12,000 ภาพ พร้อม Bounding Box Annotations (COCO Format)',
 'https://github.com/Woraphob3938/indigo-defect-vision',
 'https://indigo-ai.kuse.ac.th',
 'อาจารย์ประจำสาขาวิชาวิทยาการคอมพิวเตอร์')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Project Lineages
INSERT INTO project_lineages (id, parent_project_id, child_project_id, extension_type, evolution_summary) VALUES
('edge-1', 'proj-1', 'proj-2', 'feature_enhancement', 'ต่อยอดจากการวัดข้อมูลกายภาพ (IoT เซ็นเซอร์บ่อหมัก) สู่การประเมินคุณภาพผลลัพธ์ปลายทางด้วย Computer Vision และ Deep Learning'),
('edge-2', 'proj-3', 'proj-4', 'algorithm_optimization', 'ต่อยอดจากโครงข่ายฮาร์ดแวร์สถานีส่งสัญญาณ LoRa สู่การสร้างโมเดลพยากรณ์น้ำแล้งล่วงหน้า 14 วันด้วย LSTM AI')
ON CONFLICT (id) DO NOTHING;
