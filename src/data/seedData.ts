import { Faculty, Department, Project, Challenge, ProjectLineageEdge } from '../types/dna';

export const SEED_FACULTIES: Faculty[] = [
  {
    id: 'fac-kuse',
    name_th: 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์',
    name_en: 'Faculty of Science and Engineering',
    short_name: 'KUSE',
    color_hex: '#2563EB' // Blue
  },
  {
    id: 'fac-fam',
    name_th: 'คณะศิลปศาสตร์และวิทยาการจัดการ',
    name_en: 'Faculty of Liberal Arts and Management Science',
    short_name: 'FAM',
    color_hex: '#F59E0B' // Amber
  },
  {
    id: 'fac-fnra',
    name_th: 'คณะทรัพยากรธรรมชาติและอุตสาหกรรมเกษตร',
    name_en: 'Faculty of Natural Resources and Agro-Industry',
    short_name: 'FNRA',
    color_hex: '#10B981' // Green
  },
  {
    id: 'fac-fph',
    name_th: 'คณะสาธารณสุขศาสตร์',
    name_en: 'Faculty of Public Health',
    short_name: 'FPH',
    color_hex: '#EC4899' // Pink / Magenta
  }
];

export const SEED_DEPARTMENTS: Department[] = [
  // 1. คณะวิทยาศาสตร์และวิศวกรรมศาสตร์ (KUSE)
  { id: 'dept-cpe', faculty_id: 'fac-kuse', code: 'CPE', name_th: 'วิศวกรรมคอมพิวเตอร์', name_en: 'Computer Engineering' },
  { id: 'dept-cs', faculty_id: 'fac-kuse', code: 'CS', name_th: 'วิทยาการคอมพิวเตอร์', name_en: 'Computer Science' },
  { id: 'dept-it', faculty_id: 'fac-kuse', code: 'IT', name_th: 'เทคโนโลยีสารสนเทศ', name_en: 'Information Technology' },
  { id: 'dept-me', faculty_id: 'fac-kuse', code: 'ME', name_th: 'วิศวกรรมเครื่องกลและการผลิต', name_en: 'Mechanical & Manufacturing Engineering' },
  { id: 'dept-ee', faculty_id: 'fac-kuse', code: 'EE', name_th: 'วิศวกรรมไฟฟ้า', name_en: 'Electrical Engineering' },
  { id: 'dept-ce', faculty_id: 'fac-kuse', code: 'CE', name_th: 'วิศวกรรมโยธาและสิ่งแวดล้อม', name_en: 'Civil & Environmental Engineering' },
  { id: 'dept-ie', faculty_id: 'fac-kuse', code: 'IE', name_th: 'วิศวกรรมอุตสาหการและโลจิสติกส์', name_en: 'Industrial Engineering and Logistics' },
  { id: 'dept-ac', faculty_id: 'fac-kuse', code: 'AC', name_th: 'เคมีประยุกต์', name_en: 'Applied Chemistry' },

  // 2. คณะศิลปศาสตร์และวิทยาการจัดการ (FAM)
  { id: 'dept-mgt', faculty_id: 'fac-fam', code: 'MGT', name_th: 'การจัดการ', name_en: 'Management' },
  { id: 'dept-mkt', faculty_id: 'fac-fam', code: 'MKT', name_th: 'การตลาด', name_en: 'Marketing' },
  { id: 'dept-fin', faculty_id: 'fac-fam', code: 'FIN', name_th: 'การเงิน', name_en: 'Finance' },
  { id: 'dept-acc', faculty_id: 'fac-fam', code: 'ACC', name_th: 'การบัญชี', name_en: 'Accounting' },
  { id: 'dept-htm', faculty_id: 'fac-fam', code: 'HTM', name_th: 'การจัดการโรงแรมและท่องเที่ยว', name_en: 'Hospitality and Tourism Management' },
  { id: 'dept-ebc', faculty_id: 'fac-fam', code: 'EBC', name_th: 'ภาษาอังกฤษเพื่อการสื่อสารธุรกิจ', name_en: 'English for Business Communication' },
  { id: 'dept-pa', faculty_id: 'fac-fam', code: 'PA', name_th: 'รัฐประศาสนศาสตร์', name_en: 'Public Administration' },

  // 3. คณะทรัพยากรธรรมชาติและอุตสาหกรรมเกษตร (FNRA)
  { id: 'dept-as', faculty_id: 'fac-fnra', code: 'AS', name_th: 'สัตวศาสตร์', name_en: 'Animal Science' },
  { id: 'dept-ps', faculty_id: 'fac-fnra', code: 'PS', name_th: 'พืชศาสตร์', name_en: 'Plant Science' },
  { id: 'dept-fish', faculty_id: 'fac-fnra', code: 'FISH', name_th: 'ประมง', name_en: 'Fisheries' },
  { id: 'dept-fst', faculty_id: 'fac-fnra', code: 'FST', name_th: 'วิทยาศาสตร์และเทคโนโลยีการอาหาร', name_en: 'Food Science and Technology' },
  { id: 'dept-arm', faculty_id: 'fac-fnra', code: 'ARM', name_th: 'ทรัพยากรเกษตรและการจัดการการผลิต', name_en: 'Agricultural Resources Management' },

  // 4. คณะสาธารณสุขศาสตร์ (FPH)
  { id: 'dept-ph', faculty_id: 'fac-fph', code: 'PH', name_th: 'สาธารณสุขศาสตร์', name_en: 'Public Health' },
  { id: 'dept-eh', faculty_id: 'fac-fph', code: 'EH', name_th: 'อนามัยสิ่งแวดล้อม', name_en: 'Environmental Health' },
  { id: 'dept-ohs', faculty_id: 'fac-fph', code: 'OHS', name_th: 'อาชีวอนามัยและความปลอดภัย', name_en: 'Occupational Health and Safety' }
];

export const SEED_LINEAGES: ProjectLineageEdge[] = [
  {
    id: 'edge-1',
    parent_project_id: 'proj-1',
    child_project_id: 'proj-2',
    extension_type: 'feature_enhancement',
    evolution_summary: 'ต่อยอดจากการวัดข้อมูลกายภาพ (IoT เซ็นเซอร์บ่อหมัก) สู่การประเมินคุณภาพผลลัพธ์ปลายทางด้วย Computer Vision และ Deep Learning'
  },
  {
    id: 'edge-2',
    parent_project_id: 'proj-3',
    child_project_id: 'proj-4',
    extension_type: 'algorithm_optimization',
    evolution_summary: 'ต่อยอดจากโครงข่ายฮาร์ดแวร์สถานีส่งสัญญาณ LoRa สู่การสร้างโมเดลพยากรณ์น้ำแล้งล่วงหน้า 14 วันด้วย LSTM AI'
  },
  {
    id: 'edge-3',
    parent_project_id: 'proj-2',
    child_project_id: 'proj-6',
    extension_type: 'domain_adaptation',
    evolution_summary: 'นำสถาปัตยกรรม Computer Vision ไปประยุกต์ใช้กับโดรนตรวจจับวัชพืชแปลงเกษตรอินทรีย์'
  }
];

export const SEED_CHALLENGES: Challenge[] = [
  {
    id: 'chal-1',
    title: 'การยกระดับมาตรฐานสีครามธรรมชาติสกลนครสู่การส่งออกตลาดยุโรป',
    category: 'industry',
    organization_name: 'กลุ่มคลัสเตอร์ผ้าย้อมครามสกลนคร & กรมส่งเสริมอุตสาหกรรม',
    contact_person: 'คุณวิไลลักษณ์ พรหมดี (ประธานคลัสเตอร์)',
    description: 'ต้องการเทคโนโลยีตรวจสอบความสม่ำเสมอของเฉดสีครามธรรมชาติ (Standard Indigo Pantone) และใบรับรองดิจิทัลแบบตรวจสอบย้อนกลับได้เพื่อส่งออก',
    pain_points: [
      'ผู้ซื้อในยุโรปและญี่ปุ่นต้องการมาตรฐานสีที่แน่นอนในทุกล็อต',
      'กระบวนการย้อมด้วยมือมีความผันแปรสูงตามสภาพอากาศ',
      'ขาดระบบ Digital Product Passport (DPP) บันทึกประวัติกระบวนการย้อมธรรมชาติ'
    ],
    desired_outputs: [
      'ระบบ AI สแกนตรวจรับรองเกรดสีระดับมิลลิวินาที',
      'Digital Passport บนมือถือพร้อม QR Code ประจำผืนผ้า',
      'ระบบเชื่อมโยงข้อมูลกับมาตรฐานสิ่งบ่งชี้ทางภูมิศาสตร์ (GI)'
    ],
    location: 'จังหวัดสกลนคร',
    status: 'open',
    matched_project_ids: ['proj-2', 'proj-1']
  },
  {
    id: 'chal-2',
    title: 'ระบบบริหารจัดการพลังงานอัจฉริยะและการลดคาร์บอนในอาคารเรียน มก.ฉกส. (Smart Green Campus)',
    category: 'university',
    organization_name: 'กองบริหารกิจการวิทยาเขตเฉลิมพระเกียรติ จ.สกลนคร',
    contact_person: 'รองอธิการบดีฝ่ายกายภาพและสิ่งแวดล้อม',
    description: 'มหาวิทยาลัยต้องการลดค่าไฟฟ้าอาคารเรียนรวมและหอพักนิสิต โดยใช้ AI วิเคราะห์พฤติกรรมการใช้เครื่องปรับอากาศและควบคุมระบบไฟฟ้าโซลาร์เซลล์อัตโนมัติ',
    pain_points: [
      'ค่าไฟฟ้าอาคารเรียนรวมสูงในช่วงฤดูร้อน',
      'เครื่องปรับอากาศถูกเปิดทิ้งไว้ในห้องเรียนที่ไม่มีการใช้งาน',
      'ยังไม่มีระบบแดชบอร์ดแสดงผลการประหยัดพลังงานแบบรวมศูนย์'
    ],
    desired_outputs: [
      'ระบบ IoT Smart Sub-metering ตรวจวัดกระแสไฟฟ้ารายห้อง',
      'AI แนะนำการเปิด-ปิดเครื่องปรับอากาศตามตารางเรียนจริง',
      'Web Dashboard แสดงผลการประหยัดพลังงาน'
    ],
    location: 'มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จ.สกลนคร',
    status: 'open',
    matched_project_ids: ['proj-8', 'proj-3']
  },
  {
    id: 'chal-3',
    title: 'การตรวจเฝ้าระวังคุณภาพน้ำและเตือนภัยสารเคมีตกค้างในลุ่มน้ำหนองหาร',
    category: 'community',
    organization_name: 'เทศบาลนครสกลนคร & สมาคมประมงพื้นบ้านหนองหาร',
    contact_person: 'นายประเสริฐ สุวรรณโชติ',
    description: 'หนองหารประสบปัญหาวัชพืชน้ำและตะกอนสะสม ต้องการทุ่นตรวจวัดคุณภาพน้ำอัจฉริยะพลังงานแสงอาทิตย์เพื่อเตือนภัยสารเคมีและภาวะออกซิเจนต่ำแก่ชุมชนริมน้ำ',
    pain_points: [
      'การเก็บตัวอย่างน้ำส่งห้องแล็บใช้เวลา 3-5 วัน ทำให้เตือนภัยไม่ทันท่วงที',
      'เกิดปรากฏการณ์ปลาตายฉับพลันเมื่อปริมาณออกซิเจนละลายน้ำ (DO) ลดฮวบ'
    ],
    desired_outputs: [
      'ทุ่นลอย IoT ตรวจวัดค่า DO, pH, อุณหภูมิ และความขุ่นน้ำพลังงานแสงอาทิตย์',
      'แอปพลิเคชันแจ้งเตือนภัยชาวประมงพื้นบ้านผ่านสมาร์ตโฟน'
    ],
    location: 'ทะเลสาบหนองหาร จ.สกลนคร',
    status: 'open',
    matched_project_ids: ['proj-4', 'proj-3']
  },
  {
    id: 'chal-4',
    title: 'ระบบตรวจสอบย้อนกลับสายพันธุ์และสุขภาพโคขุนโพนยางคำเพื่อการส่งออกเนื้อเกรดพรีเมียม',
    category: 'industry',
    organization_name: 'สหกรณ์การเลี้ยงปศุสัตว์ กรป.กลาง โพนยางคำ จำกัด',
    contact_person: 'สัตวแพทย์หญิง ดร.นภัสสร',
    description: 'ต้องการระบบติดตามสุขภาพ น้ำหนัก และประวัติการให้อาหารโคขุนตลอดวงจรการเลี้ยง เพื่อสร้างความเชื่อมั่นแก่ผู้บริโภคระดับพรีเมียมทั้งในและต่างประเทศ',
    pain_points: [
      'การบันทึกประวัติน้ำหนักด้วยมือเกิดความผิดพลาดบ่อยครั้ง',
      'การชั่งน้ำหนักวัวตัวใหญ่ทำได้ยากและทำให้วัวบาดเจ็บหรือเครียด'
    ],
    desired_outputs: [
      'ระบบชั่งน้ำหนักแบบไร้การสัมผัส (3D Camera)',
      'ฐานข้อมูลกลางบันทึกประวัติวัคซีนและสารอาหารของโคขุนรายตัว'
    ],
    location: 'อ.เมือง จ.สกลนคร',
    status: 'open',
    matched_project_ids: ['proj-5']
  },
  {
    id: 'chal-5',
    title: 'ระบบสำรวจและติดตามภาวะสุขภาพจิตและโรคเรื้อรังในผู้สูงอายุชนบท จ.สกลนคร',
    category: 'community',
    organization_name: 'สำนักงานสาธารณสุขจังหวัดสกลนคร & คณะสาธารณสุขศาสตร์',
    contact_person: 'ดร. สาธารณสุข ชุมชน',
    description: 'พัฒนาแพลตฟอร์มคัดกรองสุขภาพผู้สูงอายุแบบดิจิทัลเพื่อช่วย อสม. ติดตามผู้ป่วยติดเตียงและภาวะสมองเสื่อมในชุมชนห่างไกล',
    pain_points: [
      'เอกสารคัดกรองกระดาษสูญหายและประมวลผลข้อมูลล่าช้า',
      'ขาดเครื่องมือช่วยเตือนการรับประทานยาและการนัดหมายตรวจสุขภาพ'
    ],
    desired_outputs: [
      'Mobile App สำหรับ อสม. บันทึกข้อมูลสุขภาพออฟไลน์',
      'ระบบประเมินความเสี่ยงสุขภาพด้วย AI แจ้งเตือน รพ.สต.'
    ],
    location: 'จังหวัดสกลนคร',
    status: 'open',
    matched_project_ids: ['proj-7']
  }
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title_th: 'ระบบควบคุมอุณหภูมิและความชื้นในกระบวนการหมักครามธรรมชาติด้วย IoT',
    title_en: 'IoT Temperature and Humidity Monitoring for Natural Indigo Fermentation',
    abstract_th: 'พัฒนากล่องเซ็นเซอร์ IoT เพื่อตรวจวัดค่า pH อุณหภูมิ และความชื้นในการหมักครามพื้นเมืองสกลนคร เพื่อควบคุมคุณภาพสีครามให้สม่ำเสมอ ลดความเสียหายจากการเน่าเสียของเนื้อคราม',
    abstract_en: 'An IoT sensor unit monitoring pH, temp, and moisture in traditional Sakon Nakhon indigo fermentation vats.',
    academic_year: 2566,
    status: 'completed',
    department_id: 'dept-me',
    cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    rating_score: 4.9,
    view_count: 1420,
    fork_count: 18,
    dna_card: {
      id: 'dna-1',
      project_id: 'proj-1',
      problem_statement: 'การหมักครามแบบดั้งเดิมใช้ความชำนาญส่วนบุคคล ทำให้สีครามไม่คงที่ เสียหายบ่อยครั้งเมื่อสภาพอากาศเปลี่ยน ส่งผลให้สูญเสียรายได้ของชุมชน',
      target_users: ['กลุ่มวิสาหกิจชุมชนผ้าย้อมครามสกลนคร', 'ผู้ประกอบการ OTOP 5 ดาว', 'นักวิจัยภูมิปัญญาท้องถิ่น'],
      tech_stack: ['ESP32', 'Arduino C++', 'MQTT', 'Node-RED', 'pH Sensor Probe', 'DS18B20'],
      key_outcomes: [
        'ลดความเสียหายของการเน่าเสียของครามได้ 40%',
        'ตรวจวัดค่า pH และอุณหภูมิได้ต่อเนื่อง 24 ชม.',
        'แจ้งเตือนผ่าน LINE Notify เมื่อค่าหลุดเกณฑ์ความปลอดภัย'
      ],
      limitations: [
        'แบตเตอรี่ใช้งานได้ 5 วันต่อการชาร์จ',
        'หัววัด pH ต้อง Calibrate ทุกๆ 2 สัปดาห์',
        'ยังไม่มีระบบเติมสารด่างและน้ำหมักอัตโนมัติ'
      ],
      hardware_specs: 'ESP32 Dev Module, Industrial Glass pH Electrode, Waterproof Temp Probe, Solar Panel 10W, Waterproof Box IP67',
      dataset_description: 'Time-series dataset ค่า pH และอุณหภูมิการหมักคราม 180 วัน ใน 12 บ่อหมัก (CSV 28.5MB)',
      repository_url: 'https://github.com/Woraphob3938/indigo-ferment-iot',
      demo_url: 'https://indigo-iot.kuse.ac.th',
      advisor_name: 'ผศ.ดร. อาจารย์ที่ปรึกษาประจำสาขา',
      student_authors: [
        { name: 'นิสิตรุ่นพี่ผู้จัดทำ 1', student_id: '644020xxxx', role: 'Hardware & Firmware Lead' },
        { name: 'นิสิตรุ่นพี่ผู้จัดทำ 2', student_id: '644020xxxx', role: 'System Architecture' }
      ]
    },
    assets: [
      {
        id: 'asset-1',
        project_id: 'proj-1',
        asset_type: 'circuit_schematic',
        title: 'ESP32 pH & Temp Sensor PCB Schematic (EasyEDA)',
        description: 'ไฟล์ Gerber และวงจร PCB 2 เลเยอร์ พร้อมรายการอุปกรณ์ BOM สำหรับเซ็นเซอร์บ่อหมัก',
        resource_url: 'https://github.com/Woraphob3938/indigo-ferment-iot/releases/download/v1.0/pcb_gerber.zip',
        file_size: '4.2 MB',
        license: 'CERN Open Hardware',
        download_count: 142
      },
      {
        id: 'asset-2',
        project_id: 'proj-1',
        asset_type: 'dataset',
        title: 'Sakon Indigo Fermentation 180-Day Sensor Timeseries',
        description: 'ข้อมูล CSV บันทึกค่า pH, อุณหภูมิ, ความชื้น พร้อมผลการย้อมจริง 180 วัน',
        resource_url: 'https://huggingface.co/datasets/kuse/indigo-fermentation-180d',
        file_size: '28.5 MB',
        license: 'CC-BY-4.0',
        download_count: 310
      },
      {
        id: 'asset-3',
        project_id: 'proj-1',
        asset_type: 'code_repo',
        title: 'ESP32 Firmware & Node-RED Flow Codebase',
        description: 'ซอร์สโค้ดภาษา C++ สำหรับเฟิร์มแวร์ ESP32 พร้อม Dashboard Flow Node-RED',
        resource_url: 'https://github.com/Woraphob3938/indigo-ferment-iot',
        file_size: '12.1 MB',
        license: 'MIT',
        download_count: 245
      }
    ],
    gaps: [
      {
        id: 'gap-1',
        project_id: 'proj-1',
        gap_title: 'พัฒนาหัวจ่ายสารด่างอัตโนมัติ (Closed-loop Auto Dosing Actuator)',
        gap_description: 'สร้างกลไกควบคุมมอเตอร์ปั๊มสารละลายขี้เถ้าและปูนขาวตามค่า pH แบบอัตโนมัติเพื่อป้องกันบ่อครามตาย',
        difficulty_level: 'Medium',
        recommended_tech: ['Stepper Motor Actuators', 'PID Controller', 'FreeRTOS', 'Relay Module'],
        potential_impact: 'เปลี่ยนการหมักครามให้เป็นระบบกึ่งอัตโนมัติ 100% ประหยัดเวลาแรงงานชุมชน'
      }
    ],
    child_lineages: [SEED_LINEAGES[0]],
    matched_challenge_ids: ['chal-1']
  },
  {
    id: 'proj-2',
    title_th: 'ระบบประเมินเกรดสีครามและตรวจจับข้อบกพร่องผ้าย้อมครามด้วย Computer Vision',
    title_en: 'Computer Vision-based Indigo Dye Quality Grading and Defect Inspection',
    abstract_th: 'ต่อยอดจากระบบ IoT หมักคราม (รุ่นพี่ 2566) โดยนำกล้องอุตสาหกรรมและโมเดล YOLOv8 มาจำแนกเกรดเฉดสีคราม 5 ระดับ และตรวจจับรอยด่างบนผืนผ้าอัตโนมัติ พร้อมส่งออกรายงานรับรองคุณภาพผ้ามัดย้อมสกลนคร',
    abstract_en: 'Extending the IoT fermentation baseline by applying industrial cameras and YOLOv8 for automated 5-level indigo color grading and weave defect detection.',
    academic_year: 2567,
    status: 'completed',
    department_id: 'dept-cs',
    cover_image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=60',
    rating_score: 4.95,
    view_count: 1980,
    fork_count: 24,
    dna_card: {
      id: 'dna-2',
      project_id: 'proj-2',
      problem_statement: 'การตรวจสอบคุณภาพและเฉดสีของผ้าย้อมครามส่งออกยังใช้สายตามนุษย์ ทำให้เกิดความผิดพลาดและข้อพิพาทเรื่องมาตรฐานสีกับผู้ซื้อต่างประเทศ',
      target_users: ['ผู้ส่งออกผ้าคราม', 'ศูนย์หม่อนไหมเฉลิมพระเกียรติ', 'ผู้ตรวจรับมาตรฐาน มผช.'],
      tech_stack: ['Python', 'PyTorch', 'YOLOv8', 'FastAPI', 'Next.js', 'OpenCV'],
      key_outcomes: [
        'ความแม่นยำจำแนก 5 เฉดสีครามธรรมชาติ 96.4%',
        'ตรวจจับรอยด่างเส้นด้ายขนาด 2mm ได้ใน 150ms',
        'ออกใบ Certificate พร้อม QR Code ดิจิทัลยืนยันคุณภาพผืนผ้า'
      ],
      limitations: [
        'ต้องการแสงสว่างควบคุมมาตรฐาน (Light Box 6500K)',
        'ยังไม่รองรับผ้าทอลายซับซ้อนมาก เช่น ลายพญานาคโบราณ',
        'ยังไม่รองรับการทำงานแบบ Realtime บนสมาร์ตโฟนราคาประหยัด'
      ],
      hardware_specs: 'Industrial USB3 Camera 12MP, Controlled LED 6500K Lightbox, Raspberry Pi 5 / Coral TPU Accelerator',
      dataset_description: 'ชุดภาพถ่ายผ้าย้อมครามแท้และสังเคราะห์ 12,000 ภาพ พร้อม Bounding Box Annotations (COCO Format)',
      repository_url: 'https://github.com/Woraphob3938/indigo-defect-vision',
      demo_url: 'https://indigo-ai.kuse.ac.th',
      advisor_name: 'รศ.ดร. อาจารย์ที่ปรึกษาประจำภาควิชา',
      student_authors: [
        { name: 'นิสิตรุ่นพี่ผู้จัดทำ 1', student_id: '654020xxxx', role: 'AI / ML Research Lead' },
        { name: 'นิสิตรุ่นพี่ผู้จัดทำ 2', student_id: '654020xxxx', role: 'Fullstack & Edge Deployment' }
      ]
    },
    assets: [
      {
        id: 'asset-4',
        project_id: 'proj-2',
        asset_type: 'trained_model',
        title: 'YOLOv8x-Indigo-Defect-Weights (.pt & .onnx)',
        description: 'โมเดล AI ที่เทรนแล้วสำหรับตรวจจับตำหนิผ้าครามและจำแนกเฉดสี 5 ระดับ',
        resource_url: 'https://huggingface.co/kuse/yolov8-indigo-color-grading',
        file_size: '135 MB',
        license: 'Apache 2.0',
        download_count: 425
      },
      {
        id: 'asset-5',
        project_id: 'proj-2',
        asset_type: 'code_repo',
        title: 'Fullstack Next.js + FastAPI AI Inspection Source Code',
        description: 'โค้ดระบบเว็บแดชบอร์ดพร้อม API ประมวลผลภาพถ่ายแบบ Real-time',
        resource_url: 'https://github.com/Woraphob3938/indigo-defect-vision',
        file_size: '18.4 MB',
        license: 'MIT',
        download_count: 512
      },
      {
        id: 'asset-6',
        project_id: 'proj-2',
        asset_type: 'dataset',
        title: 'Sakon Indigo Fabric Defect Annotated Dataset (12K Images)',
        description: 'ชุดภาพถ่ายความละเอียดสูงพร้อมไฟล์ Label Bounding Box Format COCO',
        resource_url: 'https://huggingface.co/datasets/kuse/indigo-fabric-defects-12k',
        file_size: '1.4 GB',
        license: 'CC-BY-SA-4.0',
        download_count: 670
      }
    ],
    gaps: [
      {
        id: 'gap-2',
        project_id: 'proj-2',
        gap_title: 'โมบายแอปพลิเคชันตรวจคุณภาพผ้าครามออฟไลน์สำหรับช่างทอชุมชน',
        gap_description: 'แปลงโมเดล YOLOv8 ให้เป็น TFLite / ONNX Runtime บน Flutter เพื่อให้ชาวบ้านในพื้นที่ไม่มีสัญญาณเน็ตสามารถสแกนตรวจเกรดผ้าได้ทันที',
        difficulty_level: 'Easy',
        recommended_tech: ['Flutter', 'TensorFlow Lite', 'React Native', 'Mobile Optimization'],
        potential_impact: 'ขยายผลให้ช่างทอกว่า 40 ชุมชนในสกลนครเข้าถึงเทคโนโลยี AI ตรวจสอบผ้าครามได้ด้วยตนเอง'
      },
      {
        id: 'gap-3',
        project_id: 'proj-2',
        gap_title: 'ระบบ Digital Product Passport บน Blockchain เพื่อความโปร่งใสระดับสากล',
        gap_description: 'เชื่อมโยงผลการตรวจสีและประวัติครามเข้ากับ Smart Contract เพื่อสร้างใบรับรอง Digital Passport สู่ตลาดยุโรป',
        difficulty_level: 'Hard',
        recommended_tech: ['Solidity', 'IPFS', 'ERC-721', 'Web3.js'],
        potential_impact: 'เพิ่มมูลค่าผ้าครามสกลนครขึ้น 300% ในตลาดแฟชั่นพรีเมียมระดับโลก'
      }
    ],
    parent_lineages: [SEED_LINEAGES[0]],
    child_lineages: [SEED_LINEAGES[2]],
    matched_challenge_ids: ['chal-1']
  },
  {
    id: 'proj-3',
    title_th: 'ระบบสูบน้ำพลังงานแสงอาทิตย์อัจฉริยะควบคุมผ่าน LoRaWAN สำหรับพื้นที่การเกษตรลุ่มน้ำก่ำ',
    title_en: 'Smart Solar-Powered Water Pumping with LoRaWAN Telemetry for Nam Kam Basin',
    abstract_th: 'ออกแบบระบบโซลาร์ปั๊มน้ำระยะไกลด้วยสัญญาณ LoRaWAN ครอบคลุมรัศมี 10 กิโลเมตร เพื่อสูบน้ำเข้านาข้าวและสวนผลไม้ในช่วงหน้าแล้งแบบอัตโนมัติผ่านพลังงานสะอาด',
    abstract_en: 'A 10km LoRaWAN telemetry network controlling solar water pumps for remote farmland irrigation.',
    academic_year: 2566,
    status: 'completed',
    department_id: 'dept-ee',
    cover_image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=60',
    rating_score: 4.75,
    view_count: 1150,
    fork_count: 15,
    dna_card: {
      id: 'dna-3',
      project_id: 'proj-3',
      problem_statement: 'เกษตรกรในลุ่มน้ำก่ำขาดแคลนน้ำช่วงฤดูแล้ง และสถานีสูบน้ำอยู่ห่างไกลพื้นที่ไม่มีสัญญาณมือถือ ทำให้การเปิด-ปิดปั๊มน้ำทำได้ลำบากและสิ้นเปลืองเชื้อเพลิง',
      target_users: ['กลุ่มผู้ใช้น้ำลุ่มน้ำก่ำ', 'เกษตรกรแปลงใหญ่', 'สหกรณ์การเกษตร'],
      tech_stack: ['LoRaWAN', 'STM32', 'Solar MPPT', 'C/C++', 'ThingsBoard', 'Modbus RTU'],
      key_outcomes: [
        'ส่งสัญญาณควบคุมปั๊มน้ำได้ไกล 10 กม. โดยไม่ต้องใช้เน็ตมือถือ',
        'ลดต้นทุนค่าน้ำมันเชื้อเพลิงสูบน้ำลง 100% ด้วยพลังงานแสงอาทิตย์',
        'บริหารจัดการน้ำผ่านสถานีควบคุมส่วนกลาง'
      ],
      limitations: [
        'ยังไม่สามารถคำนวณทำนายการใช้น้ำล่วงหน้าได้',
        'อัตราส่งข้อมูลจำกัดตามแบนด์วิดท์ของ LoRa (ทุกๆ 5 นาที)'
      ],
      hardware_specs: 'SX1276 LoRa Module, STM32F4 Microcontroller, 5kW Solar Inverter, Ultrasonic Water Level Sensor',
      dataset_description: 'ข้อมูลสถิติการเปิด-ปิดปั๊มน้ำและระดับน้ำลุ่มน้ำก่ำ 1 ปี (CSV 14MB)',
      repository_url: 'https://github.com/Woraphob3938/solar-lora-pumping',
      advisor_name: 'ผศ.ดร. อาจารย์ประจำภาควิชาวิศวกรรมไฟฟ้า',
      student_authors: [
        { name: 'นิสิตรุ่นพี่ผู้จัดทำ', student_id: '644020xxxx', role: 'Embedded Systems & LoRa Lead' }
      ]
    },
    assets: [
      {
        id: 'asset-7',
        project_id: 'proj-3',
        asset_type: 'circuit_schematic',
        title: 'LoRaWAN Long-Range Transceiver PCB Schematic',
        description: 'วงจรส่งสัญญาณ LoRa ความถี่ 923MHz สำหรับสภาพแวดล้อมการเกษตร',
        resource_url: 'https://github.com/Woraphob3938/solar-lora-pumping/raw/main/schematic.pdf',
        file_size: '3.1 MB',
        download_count: 189
      }
    ],
    gaps: [],
    child_lineages: [SEED_LINEAGES[1]],
    matched_challenge_ids: ['chal-2', 'chal-3']
  },
  {
    id: 'proj-4',
    title_th: 'แบบจำลองทำนายวิกฤตน้ำแล้งล่วงหน้าและจัดสรรโควตาน้ำลุ่มน้ำก่ำด้วย LSTM AI',
    title_en: 'LSTM Deep Learning for Drought Forecasting and Water Allocation in Nam Kam Basin',
    abstract_th: 'ต่อยอดจากโครงข่ายเซ็นเซอร์ LoRaWAN (2566) โดยรวบรวมข้อมูลระดับน้ำ ย้อนหลัง 3 ปี มาเทรนโมเดล LSTM เพื่อทำนายระดับน้ำล่วงหน้า 14 วัน และแนะนำแผนการเปิด-ปิดประตูระบายน้ำอัตโนมัติ',
    abstract_en: 'Incorporating historical sensor data from 2026 LoRa stations into an LSTM network predicting water levels 14 days ahead.',
    academic_year: 2567,
    status: 'completed',
    department_id: 'dept-cpe',
    cover_image_url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=60',
    rating_score: 4.92,
    view_count: 1340,
    fork_count: 22,
    dna_card: {
      id: 'dna-4',
      project_id: 'proj-4',
      problem_statement: 'การจัดสรรน้ำในลุ่มน้ำก่ำมักเกิดปัญหาล่าช้า เนื่องจากไม่สามารถคาดการณ์ปริมาณน้ำฝนและอัตราการไหลล่วงหน้าได้แม่นยำ',
      target_users: ['สำนักงานชลประทานที่ 5', 'เทศบาลนครสกลนคร', 'กลุ่มผู้ใช้น้ำการเกษตร'],
      tech_stack: ['Python', 'TensorFlow/Keras', 'LSTM', 'FastAPI', 'PostgreSQL', 'Grafana'],
      key_outcomes: [
        'ทำนายระดับน้ำล่วงหน้า 14 วัน ด้วยค่าความแม่นยำ RMSE ต่ำกว่า 0.08 เมตร',
        'จำลองสถานการณ์น้ำท่วมและน้ำแล้งแบบอัตโนมัติ',
        'ระบบแนะนำการเปิดประตูระบายน้ำเพื่อลดความสูญเสียพืชผล'
      ],
      limitations: [
        'ต้องอาศัยข้อมูลสภาพอากาศจากกรมอุตุนิยมวิทยาประกอบการพยากรณ์',
        'ยังไม่ได้คำนึงถึงผลกระทบจากการสร้างสิ่งกีดขวางทางน้ำชั่วคราวของชุมชน'
      ],
      advisor_name: 'รศ.ดร. อาจารย์ประจำภาควิชาวิศวกรรมคอมพิวเตอร์',
      student_authors: [
        { name: 'นิสิตรุ่นพี่ผู้จัดทำ', student_id: '654020xxxx', role: 'AI Modeler' }
      ]
    },
    parent_lineages: [SEED_LINEAGES[1]],
    matched_challenge_ids: ['chal-3']
  },
  {
    id: 'proj-5',
    title_th: 'ระบบประเมินน้ำหนักและติดตามพฤติกรรมสุขภาพโคขุนโพนยางคำแบบไม่สัมผัสด้วย 3D Vision',
    title_en: 'Non-contact 3D Vision Weight Estimation and Behavior Tracking for Pon Yang Kham Cattle',
    abstract_th: 'ใช้กล้อง Depth Sensor (RealSense) และโมเดล PointNet ในการสแกนรูปร่างโคขุนขณะเดินผ่านช่องตรวจ เพื่อคำนวณน้ำหนักตัวแบบแม่นยำสูงถึง 94% โดยไม่ต้องนำวัวขึ้นเครื่องชั่งจริง ลดความเครียดและอันตรายของสัตว์',
    abstract_en: '3D point cloud cattle body dimension scanning to estimate live weight with 94% accuracy without physical weighing scales.',
    academic_year: 2567,
    status: 'completed',
    department_id: 'dept-as',
    cover_image_url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=60',
    rating_score: 4.88,
    view_count: 1620,
    fork_count: 25,
    dna_card: {
      id: 'dna-5',
      project_id: 'proj-5',
      problem_statement: 'การชั่งน้ำหนักโคขุนขนาด 600-800 กิโลกรัมด้วยเครื่องชั่งแบบเดิม ทำให้สัตว์ตื่นตกใจ เกิดอาการบาดเจ็บ และส่งผลต่อคุณภาพเนื้อ',
      target_users: ['สหกรณ์โคขุนโพนยางคำ', 'ฟาร์มปศุสัตว์มาตรฐาน', 'สัตวแพทย์คุมฟาร์ม'],
      tech_stack: ['Python', 'Intel RealSense SDK', 'PointNet++', 'Open3D', 'PyTorch', 'Streamlit'],
      key_outcomes: [
        'ประเมินน้ำหนักวัวได้ใน 2 วินาที ด้วยความแม่นยำ 94.2%',
        'ลดความเครียดและการบาดเจ็บของสัตว์ได้ 100%',
        'บันทึกประวัติการเติบโตรายวันอัตโนมัติ'
      ],
      limitations: [
        'กล้องต้องติดตั้งในระยะ 2.5 - 3.5 เมตรในมุม 45 องศา',
        'สภาพแสงในคอกวัวต้องไม่มืดสนิท'
      ],
      advisor_name: 'ผศ.ดร. อาจารย์ประจำสาขาสัตวศาสตร์',
      student_authors: [
        { name: 'นิสิตรุ่นพี่ผู้จัดทำ', student_id: '654020xxxx', role: '3D Computer Vision Lead' }
      ]
    },
    matched_challenge_ids: ['chal-4']
  },
  {
    id: 'proj-6',
    title_th: 'โดรนการเกษตรตรวจจับและฉีดพ่นสารชีวภัณฑ์กำจัดวัชพืชแปลงข้าวฮางแบบจำเพาะจุดด้วย Edge AI',
    title_en: 'Precision Edge-AI Agricultural Drone for Targeted Organic Weed Spraying in Hang Rice Fields',
    abstract_th: 'พัฒนาโดรนพ่นสารชีวภัณฑ์ติดตั้งชิป Edge AI (Jetson Orin Nano) บินสำรวจและฉีดพ่นเฉพาะจุดที่มีวัชพืชระบาด ลดการใช้สารชีวภัณฑ์ลง 65% และบันทึกพิกัด GPS อัตโนมัติ',
    abstract_en: 'Autonomous drone powered by Jetson Orin detecting weeds in real-time and performing targeted spraying.',
    academic_year: 2568,
    status: 'in_progress',
    department_id: 'dept-me',
    cover_image_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=60',
    rating_score: 4.95,
    view_count: 2100,
    fork_count: 31,
    parent_lineages: [SEED_LINEAGES[2]]
  },
  {
    id: 'proj-7',
    title_th: 'อุปกรณ์สวมใส่อัจฉริยะตรวจจับการหกล้มและติดตามกายภาพบำบัดทางไกลสำหรับผู้สูงอายุในชนบท',
    title_en: 'Smart Wearable Fall Detection and Remote Tele-Rehabilitation for Rural Elderly',
    abstract_th: 'สายรัดข้อมือฝังเซ็นเซอร์ IMU 6-axis ประมวลผลอัลกอริทึม TinyML บนไมโครคอนโทรลเลอร์ ตรวจจับการล้มฉับพลันและส่งสัญญาณขอความช่วยเหลือผ่านเครือข่ายมือถือไปยัง รพ.สต. ใน 3 วินาที',
    abstract_en: 'TinyML wearable on wrist detecting accidental falls within 3 seconds and alerting local healthcare units.',
    academic_year: 2567,
    status: 'completed',
    department_id: 'dept-ph',
    cover_image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60',
    rating_score: 4.78,
    view_count: 890,
    fork_count: 9,
    matched_challenge_ids: ['chal-5']
  },
  {
    id: 'proj-8',
    title_th: 'ระบบตรวจวัดและบริหารจัดการถังหมักก๊าซชีวภาพจากเศษอาหารโรงอาหาร มก.ฉกส. อัจฉริยะ',
    title_en: 'Smart Biogas Digester Monitoring and Food Waste Optimization for KUSE Campus Cafeteria',
    abstract_th: 'เปลี่ยนเศษอาหาร 300 กก./วัน ในโรงอาหารมหาวิทยาลัยเป็นพลังงานก๊าซชีวภาพ พร้อมแดชบอร์ดแสดงผลการผลิตก๊าซมีเทนและประหยัดพลังงานแบบเรียลไทม์',
    abstract_en: 'Transforming 300kg daily campus food waste into green biogas with real-time energy telemetry.',
    academic_year: 2568,
    status: 'completed',
    department_id: 'dept-ce',
    cover_image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=60',
    rating_score: 4.82,
    view_count: 760,
    fork_count: 14,
    matched_challenge_ids: ['chal-2']
  },
  {
    id: 'proj-9',
    title_th: 'ระบบวิเคราะห์การตลาดดิจิทัลและช่องทางจำหน่ายผลิตภัณฑ์ชุมชน GI สกลนคร',
    title_en: 'Digital Marketing Analytics and Omni-channel Distribution for Sakon Nakhon GI Products',
    abstract_th: 'พัฒนาระบบแดชบอร์ดวิเคราะห์พฤติกรรมผู้บริโภคออนไลน์และระบบจัดการสต็อกอัตโนมัติสำหรับวิสาหกิจชุมชนผ้าครามและข้าวฮางทองสกลทวาปี',
    abstract_en: 'Omni-channel marketing and inventory optimization platform for geographical indication community products.',
    academic_year: 2567,
    status: 'completed',
    department_id: 'dept-mkt',
    cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    rating_score: 4.86,
    view_count: 1040,
    fork_count: 11,
    matched_challenge_ids: ['chal-1']
  }
];
