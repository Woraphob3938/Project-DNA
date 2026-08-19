-- =========================================================================
-- PROJECT DNA: SUPABASE SEED DATA
-- Pre-populated Projects, DNA Cards, Assets, Lineages, Challenges & SDGs
-- =========================================================================

-- Insert SDGs
INSERT INTO sdg_goals (id, code, name_th, name_en, color_hex, icon_name) VALUES
(4, 'SDG 4', 'การศึกษาที่มีคุณภาพ', 'Quality Education', '#C5192D', 'GraduationCap'),
(9, 'SDG 9', 'อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน', 'Industry, Innovation and Infrastructure', '#F36D25', 'Cpu'),
(11, 'SDG 11', 'เมืองและชุมชนที่ยั่งยืน', 'Sustainable Cities and Communities', '#F99D26', 'Building2'),
(12, 'SDG 12', 'การผลิตและการบริโภคที่รับผิดชอบ', 'Responsible Consumption and Production', '#CF8D2A', 'Recycle'),
(17, 'SDG 17', 'ความร่วมมือเพื่อการพัฒนาที่ยั่งยืน', 'Partnerships for the Goals', '#19486A', 'Handshake')
ON CONFLICT (id) DO NOTHING;

-- Insert Departments
INSERT INTO departments (id, code, name_th, name_en, faculty) VALUES
('a0000001-0000-0000-0000-000000000001', 'CS', 'วิทยาการคอมพิวเตอร์', 'Computer Science', 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์'),
('a0000001-0000-0000-0000-000000000002', 'CPE', 'วิศวกรรมคอมพิวเตอร์', 'Computer Engineering', 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์'),
('a0000001-0000-0000-0000-000000000003', 'ME', 'วิศวกรรมเครื่องกลและการผลิต', 'Mechanical & Manufacturing Engineering', 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์'),
('a0000001-0000-0000-0000-000000000004', 'EE', 'วิศวกรรมไฟฟ้า', 'Electrical Engineering', 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์'),
('a0000001-0000-0000-0000-000000000005', 'CE', 'วิศวกรรมโยธาและสิ่งแวดล้อม', 'Civil & Environmental Engineering', 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์')
ON CONFLICT (code) DO NOTHING;

-- Insert Projects (Generations 1, 2, 3 in Lineages)
-- Project 1: Smart Indigo Dyeing IoT (Generation 1 - ME & EE)
INSERT INTO projects (id, title_th, title_en, abstract_th, abstract_en, academic_year, status, department_id, cover_image_url, rating_score, view_count, fork_count) VALUES
('b0000001-0000-0000-0000-000000000001', 
 'ระบบควบคุมอุณหภูมิและความชื้นในกระบวนการหมักครามธรรมชาติด้วย IoT', 
 'IoT-based Temperature and Humidity Monitoring for Natural Indigo Fermentation',
 'พัฒนากล่องเซ็นเซอร์ IoT เพื่อตรวจวัดค่า pH อุณหภูมิ และความชื้นในการหมักครามพื้นเมืองสกลนคร เพื่อควบคุมคุณภาพสีครามให้สม่ำเสมอ ลดความเสียหายจากการเน่าเสียของเนื้อคราม',
 'An IoT sensor unit monitoring pH, temp, and moisture in traditional Sakon Nakhon indigo fermentation vats.',
 2566, 'completed', 'a0000001-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', 4.9, 1420, 18),

-- Project 2: Indigo AI Color Grading (Generation 2 - CS & CPEต่อยอดจาก Proj 1)
('b0000001-0000-0000-0000-000000000002',
 'ระบบประเมินเกรดสีครามและตรวจจับข้อบกพร่องผ้าย้อมครามด้วย Computer Vision',
 'Computer Vision-based Indigo Dye Quality Grading and Defect Inspection',
 'ต่อยอดจากระบบ IoT หมักคราม (รุ่นพี่ 2566) โดยนำกล้องอุตสาหกรรมและโมเดล YOLOv8 มาจำแนกเกรดเฉดสีคราม 5 ระดับ และตรวจจับรอยด่างบนผืนผ้าอัตโนมัติ พร้อมส่งออกรายงานรับรองคุณภาพผ้ามัดย้อมสกลนคร',
 'Extending the IoT fermentation baseline by applying industrial cameras and YOLOv8 for automated 5-level indigo color grading and weave defect detection.',
 2567, 'completed', 'a0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=60', 4.85, 980, 12),

-- Project 3: Smart Solar Water Pumping & Reservoir Predictor (Generation 1 - EE)
('b0000001-0000-0000-0000-000000000003',
 'ระบบสูบน้ำพลังงานแสงอาทิตย์อัจฉริยะควบคุมผ่าน LoRaWAN สำหรับพื้นที่การเกษตรลุ่มน้ำก่ำ',
 'Smart Solar-Powered Water Pumping with LoRaWAN Telemetry for Nam Kam Basin',
 'ออกแบบระบบโซลาร์ปั๊มน้ำระยะไกลด้วยสัญญาณ LoRaWAN ครอบคลุมรัศมี 10 กิโลเมตร เพื่อสูบน้ำเข้านาข้าวและสวนผลไม้ในช่วงหน้าแล้งแบบอัตโนมัติผ่านพลังงานสะอาด',
 'A 10km LoRaWAN telemetry network controlling solar water pumps for remote farmland irrigation.',
 2566, 'completed', 'a0000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=60', 4.75, 1150, 15),

-- Project 4: AI Water Level & Drought Early Warning (Generation 2 -ต่อยอดจาก Proj 3)
('b0000001-0000-0000-0000-000000000004',
 'แบบจำลองทำนายวิกฤตน้ำแล้งล่วงหน้าและจัดสรรโควตาน้ำลุ่มน้ำก่ำด้วย LSTM AI',
 'LSTM Deep Learning for Drought Forecasting and Water Allocation in Nam Kam Basin',
 'ต่อยอดจากโครงข่ายเซ็นเซอร์ LoRaWAN (2566) โดยรวบรวมข้อมูลระดับน้ำ ย้อนหลัง 3 ปี มาเทรนโมเดล LSTM เพื่อทำนายระดับน้ำล่วงหน้า 14 วัน และแนะนำแผนการเปิด-ปิดประตูระบายน้ำอัตโนมัติ',
 'Incorporating historical sensor data from 2026 LoRa stations into an LSTM network predicting water levels 14 days ahead.',
 2567, 'completed', 'a0000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=60', 4.92, 1340, 22),

-- Project 5: Pon Yang Kham Cattle Health & Weight Vision (CS & ME)
('b0000001-0000-0000-0000-000000000005',
 'ระบบประเมินน้ำหนักและติดตามพฤติกรรมสุขภาพโคขุนโพนยางคำแบบไม่สัมผัสด้วย 3D Vision',
 'Non-contact 3D Vision Weight Estimation and Behavior Tracking for Pon Yang Kham Cattle',
 'ใช้กล้อง Depth Sensor (RealSense) และโมเดล PointNet ในการสแกนรูปร่างโคขุนขณะเดินผ่านช่องตรวจ เพื่อคำนวณน้ำหนักตัวแบบแม่นยำสูงถึง 94% โดยไม่ต้องนำวัวขึ้นเครื่องชั่งจริง ลดความเครียดและอันตรายของสัตว์',
 '3D point cloud cattle body dimension scanning to estimate live weight with 94% accuracy without physical weighing scales.',
 2567, 'completed', 'a0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=60', 4.88, 1620, 25),

-- Project 6: Automated Drone Weed Spraying for Organic Rice (ME & CPE)
('b0000001-0000-0000-0000-000000000006',
 'โดรนการเกษตรตรวจจับและฉีดพ่นสารชีวภัณฑ์กำจัดวัชพืชแปลงข้าวฮางแบบจำเพาะจุดด้วย Edge AI',
 'Precision Edge-AI Agricultural Drone for Targeted Organic Weed Spraying in Hang Rice Fields',
 'พัฒนาโดรนพ่นสารชีวภัณฑ์ติดตั้งชิป Edge AI (Jetson Orin Nano) บินสำรวจและฉีดพ่นเฉพาะจุดที่มีวัชพืชระบาด ลดการใช้สารชีวภัณฑ์ลง 65% และบันทึกพิกัด GPS อัตโนมัติ',
 'Autonomous drone powered by Jetson Orin detecting weeds in real-time and performing targeted spraying.',
 2568, 'in_progress', 'a0000001-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=60', 4.95, 2100, 31),

-- Project 7: Elderly Fall Detection & Tele-rehab IoT (EE & CPE)
('b0000001-0000-0000-0000-000000000007',
 'อุปกรณ์สวมใส่อัจฉริยะตรวจจับการหกล้มและติดตามกายภาพบำบัดทางไกลสำหรับผู้สูงอายุในชนบท',
 'Smart Wearable Fall Detection and Remote Tele-Rehabilitation for Rural Elderly',
 'สายรัดข้อมือฝังเซ็นเซอร์ IMU 6-axis ประมวลผลอัลกอริทึม TinyML บนไมโครคอนโทรลเลอร์ ตรวจจับการล้มฉับพลันและส่งสัญญาณขอความช่วยเหลือผ่านเครือข่ายมือถือไปยัง รพ.สต. ใน 3 วินาที',
 'TinyML wearable on wrist detecting accidental falls within 3 seconds and alerting local healthcare units.',
 2567, 'completed', 'a0000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60', 4.78, 890, 9),

-- Project 8: Campus Food Waste to Biogas Smart Monitoring (CE & CS)
('b0000001-0000-0000-0000-000000000008',
 'ระบบตรวจวัดและบริหารจัดการถังหมักก๊าซชีวภาพจากเศษอาหารโรงอาหาร มก.ฉกส. อัจฉริยะ',
 'Smart Biogas Digester Monitoring and Food Waste Optimization for KUSE Campus Cafeteria',
 'เปลี่ยนเศษอาหาร 300 กก./วัน ในโรงอาหารมหาวิทยาลัยเป็นพลังงานก๊าซชีวภาพ พร้อมแดชบอร์ดแสดงผลการผลิตก๊าซมีเทนและลดการปล่อยคาร์บอนฟุตพริ้นท์แบบเรียลไทม์',
 'Transforming 300kg daily campus food waste into green biogas with real-time carbon reduction telemetry.',
 2568, 'completed', 'a0000001-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=60', 4.82, 760, 14)
ON CONFLICT (id) DO NOTHING;

-- Insert DNA Cards
INSERT INTO dna_cards (id, project_id, problem_statement, target_users, tech_stack, key_outcomes, limitations, hardware_specs, dataset_description, repository_url, demo_url, advisor_name, student_authors) VALUES
('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001',
 'การหมักครามแบบดั้งเดิมใช้ความชำนาญส่วนบุคคล ทำให้สีครามไม่คงที่ เสียหายบ่อยครั้งเมื่อสภาพอากาศเปลี่ยน',
 ARRAY['กลุ่มวิสาหกิจชุมชนผ้าย้อมครามสกลนคร', 'ผู้ประกอบการ OTOP 5 ดาว', 'นักวิจัยภูมิปัญญาท้องถิ่น'],
 ARRAY['ESP32', 'Arduino C++', 'MQTT', 'Node-RED', 'pH Sensor Probe', 'DS18B20'],
 ARRAY['ลดความเสียหายของการเน่าเสียของครามได้ 40%', 'ตรวจวัดค่า pH และอุณหภูมิได้ต่อเนื่อง 24 ชม.', 'แจ้งเตือนผ่าน LINE Notify เมื่อค่าหลุดเกณฑ์'],
 ARRAY['แบตเตอรี่ใช้งานได้ 5 วันต่อการชาร์จ', 'หัววัด pH ต้อง Calibrate ทุกๆ 2 สัปดาห์', 'ยังไม่มีระบบแนะนำการเติมน้ำด่างอัตโนมัติ'],
 'ESP32 Dev Module, Industrial pH Electrode Glass Probe, Waterproof Temp Probe, Solar Panel 10W',
 'Time-series dataset ค่า pH และอุณหภูมิการหมักคราม 180 วัน ใน 12 บ่อหมัก (CSV 25MB)',
 'https://github.com/Woraphob3938/indigo-ferment-iot',
 'https://indigo-iot.kuse.ac.th',
 'ผศ.ดร.สมชาย ใจดี',
 '[{"name": "นายพัชรพล วงค์คำ", "student_id": "6840209388", "role": "Hardware & Firmware"}, {"name": "น.ส.ชัชนัน บุญเหลือง", "student_id": "6740205106", "role": "System Architecture"}]'::jsonb),

('c0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002',
 'การตรวจสอบคุณภาพและเฉดสีของผ้าย้อมครามส่งออกยังใช้สายตามนุษย์ ทำให้เกิดความผิดพลาดและข้อพิพาทเรื่องมาตรฐานสี',
 ARRAY['ผู้ส่งออกผ้าคราม', 'ศูนย์หม่อนไหมเฉลิมพระเกียรติ', 'ผู้ตรวจรับมาตรฐาน มผช.'],
 ARRAY['Python', 'PyTorch', 'YOLOv8', 'FastAPI', 'Next.js', 'OpenCV'],
 ARRAY['ความแม่นยำจำแนก 5 เฉดสีคราม 96.4%', 'ตรวจจับรอยด่างเส้นด้ายขนาด 2mm ได้ใน 150ms', 'ออกใบ Certificate พร้อม QR Code ยืนยันคุณภาพ'],
 ARRAY['ต้องการแสงสว่างควบคุมมาตรฐาน (Light Box 6500K)', 'ยังไม่รองรับผ้าทอลายซับซ้อนมาก เช่น ลายพญานาคโบราณ'],
 'Industrial USB3 Camera 12MP, Controlled LED 6500K Lightbox, Raspberry Pi 5 / Coral TPU',
 'ชุดภาพถ่ายผ้าย้อมครามแท้และสังเคราะห์ 12,000 ภาพ พร้อม Bounding Box Annotations (COCO Format)',
 'https://github.com/Woraphob3938/indigo-defect-vision',
 'https://indigo-ai.kuse.ac.th',
 'รศ.ดร.วิศวกรรม นวัตกรรม',
 '[{"name": "นายวรภพ ไชยวงศ์คต", "student_id": "6640203938", "role": "AI / ML Engineer"}, {"name": "นายพิพัฒน์ โพธิ์ศรีสุข", "student_id": "6640207426", "role": "Fullstack Developer"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert Reusable Assets
INSERT INTO reusable_assets (id, project_id, asset_type, title, description, resource_url, file_size, license, download_count) VALUES
('d0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'circuit_schematic', 'ESP32 pH & Temp Sensor PCB Schematic (EasyEDA)', 'ไฟล์ Gerber และวงจร PCB 2 เลเยอร์ สำหรับเซ็นเซอร์หมักครามกันน้ำ IP67', 'https://github.com/Woraphob3938/indigo-ferment-iot/releases/download/v1.0/pcb_gerber.zip', '4.2 MB', 'CERN Open Hardware', 142),
('d0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'dataset', 'Sakon Indigo Fermentation 180-Day Sensor Timeseries', 'ข้อมูล CSV บันทึกค่า pH, อุณหภูมิ, ความชื้น พร้อมผลการย้อมจริง 180 วัน', 'https://huggingface.co/datasets/kuse/indigo-fermentation-180d', '28.5 MB', 'CC-BY-4.0', 310),
('d0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000002', 'trained_model', 'YOLOv8x-Indigo-Defect-Weights (.pt & .onnx)', 'โมเดล AI ที่เทรนแล้วสำหรับตรวจจับตำหนิผ้าครามและจำแนกเฉดสี 5 ระดับ', 'https://huggingface.co/kuse/yolov8-indigo-color-grading', '135 MB', 'Apache 2.0', 425),
('d0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000002', 'code_repo', 'Fullstack Next.js + FastAPI AI Inspection Source Code', 'โค้ดระบบเว็บแดชบอร์ดพร้อม API ประมวลผลภาพถ่ายแบบ Real-time', 'https://github.com/Woraphob3938/indigo-defect-vision', '18.4 MB', 'MIT', 512),
('d0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000005', 'trained_model', 'PointNet Cattle 3D Weight Estimation Weights', 'โมเดล Deep Learning ประมวลผล Point Cloud 3D โคขุนสกลนคร', 'https://huggingface.co/kuse/cattle-3d-pointnet', '84 MB', 'MIT', 198)
ON CONFLICT (id) DO NOTHING;

-- Insert Project Lineages (Evolution from Parent to Child)
INSERT INTO project_lineages (id, parent_project_id, child_project_id, extension_type, evolution_summary) VALUES
('e0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000002', 'feature_enhancement', 'ต่อยอดจากการวัดข้อมูลกายภาพ (IoT เซ็นเซอร์บ่อหมัก) สู่การประเมินคุณภาพผลลัพธ์ปลายทางด้วย Computer Vision และ Deep Learning'),
('e0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000004', 'algorithm_optimization', 'ต่อยอดจากโครงข่ายฮาร์ดแวร์สถานีส่งสัญญาณ LoRa สู่การสร้างโมเดลพยากรณ์น้ำแล้งล่วงหน้า 14 วันด้วย LSTM AI')
ON CONFLICT (id) DO NOTHING;

-- Insert Extension Gaps (AI Identified Continuation Ideas for Next Students)
INSERT INTO extension_gaps (id, project_id, gap_title, gap_description, difficulty_level, recommended_tech, potential_impact) VALUES
('f0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000002',
 'ระบบวิเคราะห์สูตรเคมีธรรมชาติเพื่อปรับสภาพน้ำครามอัตโนมัติ (Closed-loop Auto Dosing)',
 'ปัจจุบันระบบทำได้เพียงตรวจวัดและประเมินเกรด แต่ยังไม่มีหัวจ่ายสารด่าง (น้ำขี้เถ้า/ปูนขาว) เพื่อรักษาสมดุลบ่อหมักอัตโนมัติแบบปิด',
 'Medium', ARRAY['Robotics', 'Stepper Motor Actuators', 'PID Controller', 'Edge Impulse'],
 'ยกระดับบ่อหมักครามสู่ Smart Indigo Vat 100% ป้องกันบ่อตายลดความสูญเสียปีละกว่า 2 ล้านบาท'),

('f0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002',
 'โมบายแอปพลิเคชันสำหรับช่างทอผ้าชุมชนเพื่อตรวจลายผ้าแบบ Offline บนสมาร์ตโฟน',
 'แปลงโมเดล YOLOv8 ให้เป็น TFLite / ONNX Runtime บน Flutter/React Native เพื่อให้ชาวบ้านในพื้นที่ไม่มีสัญญาณเน็ตสามารถสแกนตรวจเกรดผ้าได้ทันที',
 'Easy', ARRAY['Flutter', 'TensorFlow Lite', 'React Native', 'Mobile Optimization'],
 'ขยายผลให้ชาวบ้านกว่า 40 ชุมชนในสกลนครเข้าถึงเทคโนโลยี AI ตรวจสอบผ้าครามได้ด้วยมือถือตนเอง'),

('f0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000005',
 'ระบบวิเคราะห์ลายม่านตาและลักษณะจมูก (Nose Print) เพื่อระบุตัวตนโคขุนแบบไบโอเมตริกซ์',
 'เพิ่มโมเดลตรวจจับลวดลายจมูกวัวเพื่อทำ Smart Cow Passport แทนการติดเบอร์หูที่อาจหลุดหรือถูกปลอมแปลง',
 'Hard', ARRAY['Biometrics AI', 'Siamese Neural Networks', 'Vision Transformer'],
 'รองรับมาตรฐานการตรวจสอบย้อนกลับ (Traceability) เนื้อโคขุนโพนยางคำส่งออกต่างประเทศ')
ON CONFLICT (id) DO NOTHING;

-- Insert Real-World Challenges (University, Industry, Community, SDGs)
INSERT INTO challenges (id, title, category, organization_name, contact_person, description, pain_points, desired_outputs, location, status) VALUES
('10000001-0000-0000-0000-000000000001',
 'การยกระดับมาตรฐานสีครามธรรมชาติสกลนครสู่การส่งออกตลาดยุโรป',
 'industry', 'กลุ่มคลัสเตอร์ผ้าย้อมครามสกลนคร & กรมส่งเสริมอุตสาหกรรม', 'คุณวิไลลักษณ์ พรหมดี (ประธานคลัสเตอร์)',
 'ต้องการเทคโนโลยีตรวจสอบความสม่ำเสมอของเฉดสีครามธรรมชาติ (Standard Indigo Pantone) และใบรับรองดิจิทัลแบบตรวจสอบย้อนกลับได้',
 ARRAY['ผู้ซื้อต่างประเทศต้องการสีมาตรฐานคงที่', 'กระบวนการย้อมด้วยมือมีความคลาดเคลื่อนสูง', 'ขาดระบบบันทึกประวัติการผลิต'],
 ARRAY['ระบบ AI ตรวจรับรองเกรดสี', 'Digital Product Passport (DPP) บนมือถือ', 'API เชื่อมโยงระบบมาตรฐานสินค้า GI สกลนคร'],
 'จ.สกลนคร', 'open'),

('10000001-0000-0000-0000-000000000002',
 'ระบบจัดการพลังงานอัจฉริยะและการลดคาร์บอนในอาคารเรียน มก.ฉกส. (Smart Green Campus)',
 'university', 'กองบริหารกิจการวิทยาเขต มก.ฉกส.', 'ผศ.ดร. ธนกร (รองอธิการบดีฝ่ายกายภาพ)',
 'มหาวิทยาลัยต้องการลดค่าไฟฟ้าอาคารเรียนรวมและหอพักนิสิต โดยใช้ AI วิเคราะห์พฤติกรรมการใช้เครื่องปรับอากาศและควบคุมโซลาร์เซลล์บนหลังคา',
 ARRAY['ค่าไฟฟ้ารวมสูงกว่า 1.8 ล้านบาทต่อเดือน', 'เครื่องปรับอากาศถูกเปิดทิ้งไว้ในห้องเรียนว่าง', 'ยังไม่มีแดชบอร์ดแสดงผลพลังงานรวม'],
 ARRAY['IoT Smart Sub-metering', 'AI Optimization เปิด-ปิดแอร์ตามตารางเรียน', 'Web Dashboard แสดงปริมาณ Carbon Reduction'],
 'เขตพื้นที่ มก.ฉกส.', 'open'),

('10000001-0000-0000-0000-000000000003',
 'การตรวจเฝ้าระวังคุณภาพน้ำและเตือนภัยสารเคมีตกค้างในลุ่มน้ำหนองหาร',
 'community', 'เทศบาลนครสกลนคร & สมาคมประมงพื้นบ้านหนองหาร', 'นายประเสริฐ สุวรรณโชติ',
 'หนองหารประสบปัญหาวัชพืชน้ำและตะกอนสะสม ต้องการทุ่นตรวจวัดคุณภาพน้ำอัจฉริยะพลังงานแสงอาทิตย์แจ้งเตือนประชาชนริมน้ำ',
 ARRAY['การตรวจคุณภาพน้ำแบบสุ่มตัวอย่างทำได้ช้า', 'ปลาตายฉับพลันเมื่อออกซิเจนในน้ำลดลงเฉียบพลัน'],
 ARRAY['ทุ่นลอย IoT ตรวจวัด DO/BOD/pH แบบ Real-time', 'ระบบแจ้งเตือนภัยผ่านแอปพลิเคชันมือถือ'],
 'ทะเลสาบหนองหาร จ.สกลนคร', 'open')
ON CONFLICT (id) DO NOTHING;

-- Map Project to SDGs
INSERT INTO project_sdgs (project_id, sdg_id) VALUES
('b0000001-0000-0000-0000-000000000001', 9),
('b0000001-0000-0000-0000-000000000001', 12),
('b0000001-0000-0000-0000-000000000002', 9),
('b0000001-0000-0000-0000-000000000002', 11),
('b0000001-0000-0000-0000-000000000002', 12),
('b0000001-0000-0000-0000-000000000003', 9),
('b0000001-0000-0000-0000-000000000003', 11),
('b0000001-0000-0000-0000-000000000004', 9),
('b0000001-0000-0000-0000-000000000004', 11),
('b0000001-0000-0000-0000-000000000005', 9),
('b0000001-0000-0000-0000-000000000005', 12),
('b0000001-0000-0000-0000-000000000006', 9),
('b0000001-0000-0000-0000-000000000006', 11),
('b0000001-0000-0000-0000-000000000006', 12),
('b0000001-0000-0000-0000-000000000007', 4),
('b0000001-0000-0000-0000-000000000007', 11),
('b0000001-0000-0000-0000-000000000008', 11),
('b0000001-0000-0000-0000-000000000008', 12),
('b0000001-0000-0000-0000-000000000008', 17)
ON CONFLICT (project_id, sdg_id) DO NOTHING;

-- Map Challenge to Projects
INSERT INTO challenge_project_matches (id, challenge_id, project_id, match_score, synergy_reason) VALUES
('20000001-0000-0000-0000-000000000001', '10000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000002', 0.98, 'โครงงานมี AI ตรวจวัดเกรด 5 เฉดสีและออกรายงาน Certificate อยู่แล้ว สามารถนำไปปรับใช้กับข้อกำหนดสากลของสหภาพยุโรปได้ทันที'),
('20000001-0000-0000-0000-000000000002', '10000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 0.88, 'ระบบ IoT หมักครามสามารถป้อนข้อมูลอุณหภูมิ/pH เพื่อเป็นหลักฐานกระบวนการผลิตครามธรรมชาติ 100% ไร้สารเคมี'),
('20000001-0000-0000-0000-000000000003', '10000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000008', 0.92, 'ระบบ Smart Biogas มีโครงสร้างแดชบอร์ดวัดผลประหยัดพลังงานและการลดคาร์บอนฟุตพริ้นท์อยู่แล้ว สามารถขยายสเกลมามอนิเตอร์อาคารเรียนรวมได้')
ON CONFLICT (id) DO NOTHING;
