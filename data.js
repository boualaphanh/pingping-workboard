// PingPing workboard data — derived from Spec v0.1, Breakdown v0.2, Gen Analysis v0.3, Priority v0.4
window.PP = (function(){
const GENS = [
 {id:'G1',name:'Little',age:'3–6',level:'อนุบาล',device:'Watch / Band',note:'อ่านไม่ออก · อยู่กับผู้ใหญ่ · ไม่ถือเงิน'},
 {id:'G2',name:'Junior',age:'7–9',level:'ประถมต้น',device:'Watch (แท็บเล็ตบ้าน)',note:'อ่านง่ายๆ · เริ่มถือเหรียญ · โรงเรียนห้ามมือถือ'},
 {id:'G3',name:'Explorer',age:'10–12',level:'ประถมปลาย',device:'มือถือเครื่องแรก + Watch',note:'เดินทางเอง · มี LINE/เกม · เงินรายสัปดาห์'},
 {id:'G4',name:'Teen',age:'13–15',level:'มัธยมต้น',device:'มือถือ (โซเชียล)',note:'ต้องการอิสระ · เสี่ยงออนไลน์สูงสุด'},
 {id:'G5',name:'Senior',age:'16–18',level:'มัธยมปลาย',device:'มือถือ',note:'เกือบผู้ใหญ่ · คุมข้อมูลตัวเอง · โฟกัสอนาคต'}
];
// status: Y = ใช้ได้, A = ปรับ, N = ตัด.  s = sub-feature count.  ph = phase.  sc = priority score.
const F = [
 // A Security
 {id:'A1',g:'A',name:'Real-time Location',s:6,ph:'MVP-S1',sc:19,st:{G1:['Y','ผ่าน watch'],G2:['Y','watch'],G3:['Y',''],G4:['Y','โปร่งใส'],G5:['A','เฉพาะ check-in / SOS']}},
 {id:'A2',g:'A',name:'Safe Zone / Geo-fence',s:6,ph:'MVP-S2',sc:19,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['A','≤ 3 โซนหลัก'],G5:['N','alert รบกวน']}},
 {id:'A3',g:'A',name:'Route Deviation',s:5,ph:'1.1',sc:13,st:{G1:['N','ไม่เดินทางเอง'],G2:['A','เฉพาะรถโรงเรียน'],G3:['Y',''],G4:['A','แทนด้วย check-in'],G5:['N','']}},
 {id:'A4',g:'A',name:'SOS / Panic Button',s:8,ph:'MVP-S1',sc:20,st:{G1:['A','ปุ่มกายภาพ ไม่มี countdown'],G2:['Y','ปุ่ม watch'],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'A5',g:'A',name:'Loud Signal',s:4,ph:'1.1',sc:14,st:{G1:['Y','watch สั่น+เสียง'],G2:['Y',''],G3:['Y',''],G4:['A','1 ครั้ง/ชม.'],G5:['N','ใช้ ping แทน']}},
 {id:'A6',g:'A',name:'Ambient Audio',s:3,ph:'1.1',sc:11,st:{G1:['Y','พ่อแม่คุมเต็ม'],G2:['Y',''],G3:['A','ลูกเห็น log'],G4:['A','ต้อง consent'],G5:['N','สิทธิ์ส่วนตัว']}},
 {id:'A7',g:'A',name:'Screen Monitoring',s:5,ph:'1.1',sc:13,st:{G1:['N','ไม่มีเครื่องเอง'],G2:['A','แท็บเล็ต เวลารวม'],G3:['Y',''],G4:['Y',''],G5:['A','เวลารวมเท่านั้น']}},
 {id:'A8',g:'A',name:'Schedule / App Lock',s:6,ph:'1.1',sc:13,st:{G1:['N',''],G2:['A','ล็อกแท็บเล็ตทั้งเครื่อง'],G3:['Y',''],G4:['Y',''],G5:['N','']}},
 {id:'A9',g:'A',name:'Content Filter',s:6,ph:'2',sc:10,st:{G1:['A','YouTube Kids'],G2:['Y','แท็บเล็ต'],G3:['Y',''],G4:['Y',''],G5:['A','Safe search เท่านั้น']}},
 {id:'A10',g:'A',name:'Text Detection AI',s:6,ph:'2',sc:10,st:{G1:['N','ไม่มีแชต'],G2:['N',''],G3:['A','เฉพาะ High risk'],G4:['Y','จุดขายหลัก'],G5:['A','opt-in โดยลูก']}},
 {id:'A11',g:'A',name:'Battery Monitoring',s:4,ph:'MVP-S1',sc:19,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 // B Gadgets
 {id:'B1',g:'B',name:'Kids phone app',s:5,ph:'MVP-S1',sc:19,st:{G1:['N',''],G2:['A','โหมดเด็กเล็ก (แท็บเล็ต)'],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'B2',g:'B',name:'Watch',s:6,ph:'MVP-S3',sc:14,st:{G1:['Y','อุปกรณ์หลัก'],G2:['Y','อุปกรณ์หลัก'],G3:['Y','รอง'],G4:['N','ไม่ใส่'],G5:['N','']}},
 {id:'B3',g:'B',name:'Wrist band',s:4,ph:'later',sc:10,st:{G1:['Y',''],G2:['Y',''],G3:['A',''],G4:['N',''],G5:['N','']}},
 {id:'B4',g:'B',name:'Ring',s:3,ph:'later',sc:10,st:{G1:['N','หลุด/กลืน'],G2:['N',''],G3:['N',''],G4:['A','ทดลอง'],G5:['A','']}},
 {id:'B5',g:'B',name:'Device Pairing',s:6,ph:'MVP-S1',sc:20,st:{G1:['A','พ่อแม่ทำทั้งหมด'],G2:['A','พ่อแม่ทำ'],G3:['Y','ลูกกรอก code'],G4:['Y',''],G5:['Y','']}},
 {id:'B6',g:'B',name:'Device Health',s:4,ph:'MVP-S1',sc:19,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 // C Dashboard
 {id:'C1',g:'C',name:'Home Dashboard',s:5,ph:'MVP-S1',sc:18,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'C2',g:'C',name:'Weekly Report',s:4,ph:'1.1',sc:18,st:{G1:['A','เดินทาง+สุขภาพ'],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['A','การเงิน+การเรียน']}},
 {id:'C3',g:'C',name:'Growing Potential',s:4,ph:'2',sc:15,st:{G1:['A','พ่อแม่กรอก'],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'C4',g:'C',name:'Gen & Gender Comparison',s:3,ph:'2',sc:15,st:{G1:['A','พัฒนาการ WHO'],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'C5',g:'C',name:'Future Projection',s:3,ph:'2',sc:15,st:{G1:['N','ข้อมูลน้อย'],G2:['A','ออมเท่านั้น'],G3:['Y',''],G4:['Y',''],G5:['Y','จุดขาย']}},
 {id:'C6',g:'C',name:'Notification Center',s:5,ph:'MVP-S2',sc:18,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 // D Growth
 {id:'D1',g:'D',name:'Financial Behavior',s:7,ph:'1.1',sc:19,st:{G1:['N','ไม่ถือเงิน'],G2:['A','พ่อแม่กรอก / รูปเหรียญ'],G3:['Y','ลูกกรอกเอง'],G4:['Y',''],G5:['Y','+ e-wallet']}},
 {id:'D2',g:'D',name:'Investment',s:5,ph:'2',sc:18,st:{G1:['N',''],G2:['N','นามธรรมเกินไป'],G3:['A','เป้าหมายออม ไม่มี %'],G4:['Y',''],G5:['Y','จุดขาย']}},
 {id:'D3',g:'D',name:'Hobbies Log',s:6,ph:'1.1',sc:19,st:{G1:['A','พ่อแม่กรอก'],G2:['A','ลูกกดรูป'],G3:['Y','timer'],G4:['Y','portfolio'],G5:['Y','portfolio']}},
 {id:'D4',g:'D',name:'Missions & Rewards',s:8,ph:'MVP-S3',sc:19,st:{G1:['A','sticker chart'],G2:['Y','รูป + ปุ่มเดียว'],G3:['Y',''],G4:['A','เปลี่ยนเป็น contract'],G5:['N','']}},
 {id:'D5',g:'D',name:'Achievement / Badges',s:4,ph:'1.1',sc:19,st:{G1:['A','sticker บน watch'],G2:['Y',''],G3:['Y',''],G4:['A','milestone จริง'],G5:['N','']}},
 {id:'D6',g:'D',name:'Education Plan',s:5,ph:'2',sc:17,st:{G1:['A','พัฒนาการ'],G2:['A','ตารางเรียน'],G3:['Y',''],G4:['Y',''],G5:['Y','จุดขาย']}},
 // E Family
 {id:'E1',g:'E',name:'Auth',s:5,ph:'MVP-S1',sc:20,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'E2',g:'E',name:'Onboarding Survey',s:4,ph:'MVP-S3',sc:20,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'E3',g:'E',name:'Multi-child',s:4,ph:'MVP-S1',sc:20,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'E4',g:'E',name:'Family Members & Roles',s:5,ph:'MVP-S1',sc:20,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'E5',g:'E',name:'Ping / Check-in',s:6,ph:'MVP-S2',sc:22,st:{G1:['A','watch ปุ่มเดียว'],G2:['Y','sticker'],G3:['Y',''],G4:['Y','หลัก'],G5:['Y','หลัก']}},
 {id:'E6',g:'E',name:'Subscription',s:5,ph:'2',sc:16,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'E7',g:'E',name:'Privacy & Consent',s:7,ph:'MVP-S3',sc:20,st:{G1:['A','พ่อแม่ consent แทน'],G2:['A',''],G3:['Y','ลูกเห็น log'],G4:['Y','ลูก opt-out'],G5:['Y','ลูกคุมเอง']}},
 // Add-ons
 {id:'AD1',g:'X',name:'Pickup Today (วันนี้ใครรับ)',s:3,ph:'MVP-S2',sc:22,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['A',''],G5:['N','']}},
 {id:'AD3',g:'X',name:'Emergency Card',s:3,ph:'MVP-S1',sc:20,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'AD5',g:'X',name:'Trust Dashboard (ฝั่งเด็ก)',s:3,ph:'MVP-S3',sc:20,st:{G1:['N',''],G2:['A',''],G3:['Y',''],G4:['Y','เงื่อนไขให้ยอมใช้'],G5:['Y','']}},
 {id:'AD2',g:'X',name:'Family Calendar',s:4,ph:'1.1',sc:19,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'AD4',g:'X',name:'Find My Device',s:3,ph:'1.1',sc:17,st:{G1:['A','watch'],G2:['A','watch'],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'AD6',g:'X',name:'Request & Approve',s:3,ph:'1.1',sc:19,st:{G1:['N',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['A','']}},
 {id:'AD8',g:'X',name:'Health & Sleep (wearable)',s:3,ph:'1.1',sc:19,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['N',''],G5:['N','']}},
 {id:'AD10',g:'X',name:'Teen Contract',s:3,ph:'2',sc:16,st:{G1:['N',''],G2:['N',''],G3:['N',''],G4:['Y',''],G5:['A','']}},
 {id:'AD9',g:'X',name:'Ask PingPing (AI สรุป)',s:2,ph:'2',sc:17,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'AD11',g:'X',name:'Money Lessons',s:2,ph:'2',sc:18,st:{G1:['N',''],G2:['N',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}},
 {id:'AD7',g:'X',name:'School Bus mode',s:3,ph:'later',sc:10,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['N',''],G5:['N','']}},
 {id:'AD12',g:'X',name:'Community Safe Zone',s:2,ph:'later',sc:10,st:{G1:['Y',''],G2:['Y',''],G3:['Y',''],G4:['Y',''],G5:['Y','']}}
];
const GROUPS = {A:'Security',B:'Gadgets',C:'Dashboard & Analytics',D:'Growth',E:'Family & Account',X:'Add-ons (เสนอใหม่)'};
const PHASES = ['MVP-S1','MVP-S2','MVP-S3','1.1','2','later'];
const PHASE_LABEL = {'MVP-S1':'MVP · Sprint 1 เห็นลูก','MVP-S2':'MVP · Sprint 2 สบายใจ','MVP-S3':'MVP · Sprint 3 ไว้ใจ','1.1':'v1.1','2':'v2','later':'Later / ยังไม่ทำ'};
// Screens per app. gens = which gens include it. tab = parent tab.
const PARENT_TABS = ['Home','Map','Security','Growth','Family'];
const SCREENS = {
 parent: [
  {id:'P7',tab:'Home',name:'Home Dashboard',f:'C1',gens:'G1 G2 G3 G4 G5'},
  {id:'P8',tab:'Home',name:'Notification Center',f:'C6',gens:'G1 G2 G3 G4 G5'},
  {id:'P9',tab:'Home',name:'Alert Detail / SOS',f:'A4',gens:'G1 G2 G3 G4 G5'},
  {id:'PX',tab:'Home',name:'Pickup Today',f:'AD1',gens:'G1 G2 G3'},
  {id:'P10',tab:'Map',name:'Live Map',f:'A1',gens:'G1 G2 G3 G4'},
  {id:'P11',tab:'Map',name:'Location History',f:'A1',gens:'G1 G2 G3 G4'},
  {id:'P12',tab:'Map',name:'Safe Zones',f:'A2',gens:'G1 G2 G3 G4'},
  {id:'P14',tab:'Map',name:'Route Setup',f:'A3',gens:'G2 G3'},
  {id:'P15',tab:'Security',name:'Security Hub · Ping',f:'E5',gens:'G1 G2 G3 G4 G5'},
  {id:'P16',tab:'Security',name:'Screen Time',f:'A7',gens:'G2 G3 G4 G5'},
  {id:'P17',tab:'Security',name:'Schedule / App Lock',f:'A8',gens:'G2 G3 G4'},
  {id:'P18',tab:'Security',name:'Content Filter',f:'A9',gens:'G1 G2 G3 G4 G5'},
  {id:'P19',tab:'Security',name:'AI Text Alerts',f:'A10',gens:'G3 G4 G5'},
  {id:'P20',tab:'Security',name:'Devices & Battery',f:'B6',gens:'G1 G2 G3 G4 G5'},
  {id:'P21',tab:'Growth',name:'Growth Overview',f:'C3',gens:'G1 G2 G3 G4 G5'},
  {id:'P22',tab:'Growth',name:'Missions & Rewards',f:'D4',gens:'G1 G2 G3 G4'},
  {id:'P23',tab:'Growth',name:'Financial & Investment',f:'D1',gens:'G2 G3 G4 G5'},
  {id:'P24',tab:'Growth',name:'Hobbies',f:'D3',gens:'G1 G2 G3 G4 G5'},
  {id:'P25',tab:'Growth',name:'Comparison & Projection',f:'C5',gens:'G2 G3 G4 G5'},
  {id:'P26',tab:'Growth',name:'Education Plan',f:'D6',gens:'G1 G2 G3 G4 G5'},
  {id:'P27',tab:'Family',name:'Child Profile · Emergency Card',f:'E3',gens:'G1 G2 G3 G4 G5'},
  {id:'P28',tab:'Family',name:'Family Members',f:'E4',gens:'G1 G2 G3 G4 G5'},
  {id:'P29',tab:'Family',name:'Settings · Privacy',f:'E7',gens:'G1 G2 G3 G4 G5'},
  {id:'P30',tab:'Family',name:'Subscription',f:'E6',gens:'G1 G2 G3 G4 G5'}
 ],
 kids: [
  {id:'K1',name:'Pairing',f:'B5',gens:'G3 G4 G5'},
  {id:'K2',name:'Home · SOS · Trust',f:'AD5',gens:'G2 G3 G4 G5'},
  {id:'K3',name:'SOS Countdown',f:'A4',gens:'G3 G4 G5'},
  {id:'K4',name:'Missions / Hobbies',f:'D4',gens:'G2 G3 G4'},
  {id:'K5',name:'My Wallet',f:'D1',gens:'G3 G4 G5'},
  {id:'K6',name:'Badges / Portfolio',f:'D5',gens:'G2 G3 G4 G5'},
  {id:'K7',name:'Messages · Ping · Request',f:'E5',gens:'G2 G3 G4 G5'},
  {id:'K8',name:'Settings · What parents see',f:'E7',gens:'G3 G4 G5'}
 ],
 watch: [
  {id:'W1',name:'Watch Face · Battery',f:'B2',gens:'G1 G2 G3'},
  {id:'W2',name:'SOS (hold)',f:'A4',gens:'G1 G2 G3'},
  {id:'W3',name:'Ping / Call Parent',f:'E5',gens:'G1 G2 G3'},
  {id:'W4',name:'Sticker / Reward',f:'D5',gens:'G1 G2 G3'}
 ]
};
const GAPS = [
 {id:'G-01',t:'รับ-ส่งลูก (Pickup)',w:'painpoint ประจำวัน หลายคนรับส่ง',ad:'AD1'},
 {id:'G-02',t:'ปฏิทินครอบครัว',w:'zone/schedule/education ต้องการตารางเดียวกัน',ad:'AD2'},
 {id:'G-03',t:'Emergency Card',w:'ตอน SOS ต้องรู้กรุ๊ปเลือด แพ้ยา',ad:'AD3'},
 {id:'G-04',t:'Offline / สัญญาณอ่อน',w:'ลาว/ต่างจังหวัด internet ไม่เสถียร — queue + SMS fallback',ad:''},
 {id:'G-05',t:'หาอุปกรณ์หาย',w:'เด็กทำมือถือหายบ่อยกว่าเด็กหาย',ad:'AD4'},
 {id:'G-06',t:'ภาษา TH / LO / EN',w:'ตั้งแต่ MVP',ad:''},
 {id:'G-07',t:'Trust Dashboard',w:'เด็กไม่รู้ว่าถูกดูอะไร → ลบแอพ',ad:'AD5'},
 {id:'G-08',t:'ฝั่งเด็กได้อะไร',w:'Wallet / Portfolio / Badges ต้องเป็นของเด็กจริง',ad:''},
 {id:'G-09',t:'Request & Approve',w:'ขอเวลา / ขอเงิน / ขอไปที่อื่น pattern เดียว',ad:'AD6'},
 {id:'G-10',t:'Hardware partner (watch)',w:'G1–G2 ใช้ไม่ได้ถ้าไม่มี',ad:''},
 {id:'G-11',t:'Benchmark data',w:'วันแรกไม่มีผู้ใช้เทียบ — ใช้ WHO/งานวิจัย',ad:''},
 {id:'G-12',t:'กฎหมายฟังเสียง / สแกนแชต',w:'ที่ปรึกษากฎหมายก่อน v1.1',ad:''},
 {id:'G-13',t:'Data retention',w:'เก็บกี่วัน ลบยังไง ใครขอได้',ad:''},
 {id:'G-14',t:'Admin / Ops web',w:'ดู SOS สด · filter list · survey results',ad:''},
 {id:'G-15',t:'Team analytics funnel',w:'ติดตั้ง → pair → ใช้ 7 วัน',ad:''},
 {id:'G-16',t:'Painpoint ❓',w:'Survey 30 ครอบครัว สัมภาษณ์ 10',ad:''},
 {id:'G-18',t:'EZ Find · Velocity · Free',w:'ยังไม่แปลงเป็น design principle',ad:''}
];
const DECISIONS = [
 {id:'D-1',t:'Watch partner',o:'เลือก OEM ตอนนี้ / เลื่อน',r:'เลื่อนไป S3 · MVP เริ่มที่ G3 มือถือ'},
 {id:'D-2',t:'Platform ลำดับ',o:'Android / iOS / พร้อมกัน',r:'Flutter ทั้งคู่ · ทดสอบ Android ก่อน'},
 {id:'D-3',t:'Backend',o:'Firebase / Supabase / self-host',r:'Supabase (Postgres + realtime + OTP)'},
 {id:'D-4',t:'Map',o:'Google / Mapbox / OSM',r:'Google Maps · flutter_map+OSM fallback'},
 {id:'D-5',t:'Survey ①',o:'ก่อน S1 / คู่ขนาน',r:'คู่ขนาน · ส่งสัปดาห์นี้ ใช้ผลปรับ S2'},
 {id:'D-6',t:'ที่ปรึกษากฎหมาย',o:'ก่อน MVP / ก่อน 1.1',r:'ก่อน 1.1 (MVP ไม่มี audio/AI)'},
 {id:'D-7',t:'Financial input',o:'ลูกกรอก / พ่อแม่ / e-wallet',r:'ลูกกรอก (G3+) · พ่อแม่ (G2) · e-wallet v2'}
];
return {GENS,F,GROUPS,PHASES,PHASE_LABEL,PARENT_TABS,SCREENS,GAPS,DECISIONS};
})();
// ---- Mindmap + Painpoints (v0.5) ----
// src: 'mine' = จาก mindmap/Ideas.md ของผู้ใช้, 'addon' = Claude เสนอ, 'q' = คำถามเปิดในภาพเดิม
window.PP.MIND = [
 {name:'Security',src:'mine',kids:[
  {name:'Real-time Location',f:'A1'},{name:'Safe Zone / Geo-fence',f:'A2'},{name:'Route Deviation',f:'A3'},{name:'SOS',f:'A4'},{name:'Loud Signal',f:'A5'},{name:'Ambient Audio (env.)',f:'A6'},{name:'Screen Monitoring',f:'A7'},{name:'Schedule / App Lock',f:'A8'},{name:'Content Filter',f:'A9'},{name:'Text Detection AI',f:'A10'},{name:'Battery',f:'A11'},
  {name:'Emergency Card',f:'AD3',src:'addon'},{name:'Find My Device',f:'AD4',src:'addon'},{name:'Offline / SMS fallback',src:'addon'}]},
 {name:'Gadgets',src:'mine',kids:[
  {name:'Smart phone',f:'B1'},{name:'Watch',f:'B2'},{name:'Wrist band',f:'B3'},{name:'Ring',f:'B4'},{name:'Pairing',f:'B5'},{name:'Device Health',f:'B6'},
  {name:'Health & Sleep (wearable)',f:'AD8',src:'addon'},{name:'School Bus mode',f:'AD7',src:'addon'}]},
 {name:'Dashboard + Analytics',src:'mine',kids:[
  {name:'Home Dashboard',f:'C1'},{name:'Weekly Report',f:'C2'},{name:'Growing Potential',f:'C3'},{name:'Generation & Gender',f:'C4'},{name:'Future Projection (projectile)',f:'C5'},{name:'Notification Center',f:'C6'},
  {name:'Ask PingPing (AI)',f:'AD9',src:'addon'}]},
 {name:'Achievement → Behavior',src:'mine',kids:[
  {name:'Financial — How input?',f:'D1',src:'q'},{name:'Investment',f:'D2'},{name:'Hobbies',f:'D3'},{name:'Missions & Rewards',f:'D4'},{name:'Badges',f:'D5'},{name:'Education Plan (plan → educate)',f:'D6'},
  {name:'Money Lessons',f:'AD11',src:'addon'},{name:'Teen Contract',f:'AD10',src:'addon'}]},
 {name:'Family & Account',src:'mine',kids:[
  {name:'Auth',f:'E1'},{name:'Onboarding Survey ①',f:'E2'},{name:'Multi-child',f:'E3'},{name:'Family Roles',f:'E4'},{name:'Parents Interaction ④ · Ping',f:'E5'},{name:'Subscription (Free)',f:'E6'},{name:'Privacy & Consent',f:'E7'},
  {name:'Pickup Today',f:'AD1',src:'addon'},{name:'Family Calendar',f:'AD2',src:'addon'},{name:'Request & Approve',f:'AD6',src:'addon'},{name:'Trust Dashboard',f:'AD5',src:'addon'},{name:'Community Safe Zone',f:'AD12',src:'addon'}]},
 {name:'Discovery plan',src:'mine',kids:[
  {name:'① Survey & Research'},{name:'② Painpoint — ?',src:'q'},{name:'③ Gadget / Condition · school no phone · Gen & Gender'},{name:'④ Parents interaction'}]},
 {name:'Brand',src:'mine',kids:[{name:'Green · White · Light brown'},{name:'EZ Find · Velocity · Free'}]}
];
window.PP.PAIN = [
 {g:'Security',items:[
  {id:'P1',t:'ไม่รู้ว่าลูกอยู่ไหนระหว่างเดินทาง',e:'55 % พ่อแม่ในเมืองใช้ GPS wearable · 33–69 % ครอบครัวสหรัฐใช้ location tracking',r:'R19 R10',f:'A1 A2 AD1'},
  {id:'P2',t:'ติดต่อลูกไม่ได้ (เงียบ / แบตหมด / โรงเรียนเก็บมือถือ)',e:'phone ban เป็นตัวเร่งตลาด watch',r:'R19 R25',f:'A5 A11 B2 E5'},
  {id:'P3',t:'ฉุกเฉินแล้วลูกขอความช่วยเหลือไม่ได้',e:'เด็กไทย 10–31 % ไม่บอกใครเมื่อเจอภัย',r:'R21',f:'A4 AD3'},
  {id:'P4',t:'tracking ตลอดเวลาสร้างความกลัวให้พ่อแม่เพิ่ม',e:'ทัศนคติพ่อแม่ก้ำกึ่ง "ปลอดภัย vs สอดแนม"',r:'R14 R11',f:'C6 quiet hours · dashboard เริ่มที่ "ปลอดภัย"'}]},
 {g:'Gadget / Condition',items:[
  {id:'P5',t:'ลูกได้มือถือเครื่องแรก 10–12 พ่อแม่ตามไม่ทัน',e:'60 % ของเด็ก 11–12 มีเครื่องเอง · 37 % ใช้ TikTok',r:'R17',f:'G3 = MVP · E2'},
  {id:'P6',t:'จัดการเวลาหน้าจอยาก ทะเลาะบ่อย',e:'40 % บอกยาก · 38 % ทะเลาะ',r:'R16',f:'A7 A8 D4'},
  {id:'P7',t:'ภัยทางเพศออนไลน์จากคนรู้จัก เด็กไม่บอก',e:'9 % ของเด็กไทย 12–17 (~400,000 คน) · ผู้ดูแลแค่ 17 % จะแจ้งตำรวจ',r:'R21 R22',f:'A10 + คำแนะนำวิธีคุย'},
  {id:'P8',t:'เด็กเล็กใช้จอเกิน พัฒนาการช้า',e:'ผ่านพัฒนาการ 81.6 % (เป้า 85 %) · เด็ก 2–5 จอ 1 ชม. 33 นาที/วัน',r:'R23 R24',f:'G1–G2 A7 C4'},
  {id:'P9',t:'แอพ parental control เองไม่ปลอดภัย',e:'3/40 แอพส่งข้อมูลไม่เข้ารหัส · 8/20 sideloaded คล้าย stalkerware',r:'R9',f:'E7 · handbook §9'},
  {id:'P10',t:'เครื่องมือปัจจุบัน "ไม่สอน" แค่ห้าม',e:'rapid evidence review 2023',r:'R7 R6',f:'AD11 AD5'}]},
 {g:'Behavior / Growth',items:[
  {id:'P11',t:'พ่อแม่ต้องการวินัย/etiquette มากกว่า tracking',e:'etiquette β 0.383 · tracking ไม่มีนัยสำคัญ (p 0.589) · adoption ลด 28→22 %',r:'R8',f:'D4 D5 AD6'},
  {id:'P12',t:'มีแต่ข้อมูล "ทำผิด" ไม่มีด้านดีของลูก',e:'ทั้งสองฝ่ายชอบความโปร่งใสที่ช่วยคุย',r:'R2 R3',f:'C2 C3 D3 D5'},
  {id:'P13',t:'การเงินเด็ก: มีแอพ แต่ไม่มีงานวิจัยวัดผล',e:'ค้นพบแต่ product content',r:'—',f:'D1 D2 ต้อง validate เอง'},
  {id:'P14',t:'ไม่รู้ว่าลูกโตไปทางไหนเทียบวัยเดียวกัน',e:'ไม่พบงานวิจัยตรง มี benchmark WHO',r:'R23',f:'C4 C5'}]},
 {g:'Parents interaction',items:[
  {id:'P15',t:'พ่อแม่ส่วนใหญ่ใช้ "คุย + ดูเอง" ไม่ใช้ซอฟต์แวร์',e:'39 % ใช้เครื่องมือ (Pew 2016) · 22 % (2020)',r:'R18 R8',f:'E5 เป็นหน้าตาหลัก'},
  {id:'P16',t:'แชร์ตำแหน่งสมัครใจ วัยรุ่นชอบ · บังคับ วัยรุ่นเกลียด',e:'75–95 % Gen Z ชอบ location sharing vs 76 % รีวิวเด็ก 1 ดาว',r:'R15 R1',f:'G4–G5 check-in on demand'},
  {id:'P17',t:'หลายคนช่วยดูลูก แต่แอพออกแบบให้พ่อแม่คนเดียว',e:'community / extended family oversight',r:'R5',f:'E4 AD1'}]},
 {g:'Trust (ไม่มีใน mindmap เดิม)',addon:true,items:[
  {id:'P18',t:'เด็กรู้สึกถูกสอดแนม → ลบแอพ / หลบเลี่ยง',e:'76 % รีวิวเด็ก 1 ดาว · หลบเลี่ยงง่าย',r:'R1 R2',f:'AD5 E7'},
  {id:'P19',t:'เด็กยอมรับได้ถ้าต่อรอง + มีเหตุผล + ตกลงกัน',e:'147 เยาวชน 13–16 เบลเยียม',r:'R13 R3',f:'AD10 consent'},
  {id:'P20',t:'พ่อแม่เองรู้สึกผิดที่สอดแนม',e:'ทัศนคติก้ำกึ่ง 112 พ่อแม่',r:'R11',f:'ภาษาในแอพ "ดูแล" ไม่ใช่ "ควบคุม"'}]}
];
window.PP.REFS = {R1:'Ghosh et al. CHI 2018 — Safety vs. Surveillance',R2:'Wang et al. CSCW 2021 — Protection or Punishment?',R3:'Akter et al. CSCW 2022 — Joint Family Oversight',R5:'Wisniewski et al. 2025 — Community-based approaches',R6:'Systematic review 2021 — Designing parental monitoring tech',R7:'Rapid evidence review 2023 — J. Children & Media',R8:'Alkhalifah & Bukar 2026 — Frontiers in Psychology (n=388)',R9:'Maier, Tanczer, Klausner 2025 — 40 apps',R10:'Clin Child Fam Psychol Rev 2024 — Digital Location Tracking review',R11:'Surveillance & Society — "Safety Not Snooping" (n=112)',R13:'JCMC 2026 — Intimate surveillance of the ordinary',R14:'2015 — Tracking children, constructing fear',R15:'Life360 2023 / Psychology Today 2025',R16:'Pew 2024 — Teens & parents screen time (n=1,453)',R17:'Pew 2025 — Parents of kids ≤12 (n=3,054)',R18:'Pew 2016 — Digital monitoring',R19:'Kids smartwatch market reports 2025–26',R21:'Disrupting Harm Thailand 2022 (ECPAT/INTERPOL/UNICEF)',R22:'COPAT 2562/2565',R23:'สศช. ภาวะสังคม Q4/2568',R24:'JPSS 2024 — เด็ก 2–5 เขตสุขภาพ 3',R25:'ศธ./สพฐ. 2567–68'};
// ---- Sitemap + Research table + Painpoint table (v0.6) ----
window.PP.ONBOARD=[{id:'P1',name:'Splash',f:'E1',gens:'G1 G2 G3 G4 G5'},{id:'P2',name:'Login / OTP',f:'E1',gens:'G1 G2 G3 G4 G5'},{id:'P3',name:'Onboarding Survey',f:'E2',gens:'G1 G2 G3 G4 G5'},{id:'P4',name:'Add Child',f:'E3',gens:'G1 G2 G3 G4 G5'},{id:'P5',name:'Pair Device',f:'B5',gens:'G1 G2 G3 G4 G5'},{id:'P6',name:'Permissions',f:'A1',gens:'G1 G2 G3 G4 G5'}];
window.PP.RESEARCH=[
 {id:1,t:'รีวิวจากเด็ก 8–19 ต่อแอพ parental control',why:'ต้องรู้ว่าเด็กมองแอพติดตามอย่างไร ไม่ใช่แค่พ่อแม่ — ถ้าเด็กเกลียด เด็กลบ',who:'เด็ก/วัยรุ่น · รีวิว 736 ชิ้น แอพ 37 ตัว Google Play',res:'76 % ของรีวิวเด็กให้ 1 ดาว มองว่าจำกัดเกิน ละเมิดความเป็นส่วนตัว ทำลายความสัมพันธ์',ref:'Ghosh et al., CHI 2018',url:'https://dl.acm.org/doi/10.1145/3173574.3173698'},
 {id:2,t:'วิเคราะห์ feature ของแอพในตลาด + รีวิวผู้ใช้',why:'ดูว่าคู่แข่งทำอะไรเหมือนกันหมด แล้ว PingPing ควรต่างตรงไหน',who:'แอพ parental control ในตลาด + รีวิวพ่อแม่และเด็ก',res:'94 % มี screen time logging, > 90 % มี block — แนวจำกัด+สอดส่องถูกทั้งสองฝ่ายไม่ชอบ เด็กหลบเลี่ยงง่าย',ref:'Wang et al., CSCW 2021',url:'https://dl.acm.org/doi/10.1145/3476084'},
 {id:3,t:'ทดลอง "ดูแลร่วมกัน" พ่อแม่–วัยรุ่นเท่าเทียม',why:'ทดสอบว่าโมเดล "โปร่งใสสองทาง" ใช้ได้จริงไหม ก่อนออกแบบ Trust Dashboard',who:'19 คู่พ่อแม่–วัยรุ่น 13–17 ใช้แอพ CO-oPS',res:'ชอบความโปร่งใสที่ช่วยคุยกัน ไม่ชอบ feature ซ่อน/แชตในแอพ · power imbalance ทำให้ยาก',ref:'Akter et al., CSCW 2022',url:'https://dl.acm.org/doi/10.1145/3512904'},
 {id:4,t:'Co-design แอพความปลอดภัยกับวัยรุ่น (Value Sensitive Design)',why:'รู้ค่านิยมที่วัยรุ่นต้องการ เพื่อออกแบบ G4–G5',who:'วัยรุ่นสหรัฐ',res:'ต้องการ resilience + autonomy ไม่ใช่ control',ref:'Badillo-Urquiola et al., 2020',url:'https://journals.sagepage.com/doi/full/10.1177/0743558419884692'},
 {id:5,t:'Systematic review การออกแบบเทคโนโลยี monitoring',why:'รวมหลักออกแบบที่งานวิจัยตกผลึกแล้ว ไม่ต้องเดาเอง',who:'งานวิจัย HCI หลายสิบชิ้น',res:'ยืดหยุ่นตามสไตล์เลี้ยง · ให้เด็กร่วมออกแบบ · เคารพ privacy · ส่งเสริม self-regulation',ref:'Systematic Review 2021',url:'https://www.researchgate.net/publication/354123198'},
 {id:6,t:'Rapid evidence review: เครื่องมือ parental control ตอบความคาดหวังครอบครัวไหม',why:'เช็กว่าแอพที่มีอยู่ "ล้มเหลว" ตรงไหน = โอกาส',who:'ครอบครัวในงานวิจัยหลายประเทศ',res:'เครื่องมือปัจจุบัน "ไม่สอน" เด็ก ไม่สร้าง digital literacy · การใช้ขึ้นกับอายุและทักษะดิจิทัลของพ่อแม่',ref:'J. Children & Media 2023',url:'https://www.tandfonline.com/doi/full/10.1080/17482798.2023.2265512'},
 {id:7,t:'ปัจจัยที่ทำให้พ่อแม่ใช้/ไม่ใช้แอพ (PLS-SEM + ANN)',why:'รู้ว่าอะไร "ขาย" ได้จริง อะไรพ่อแม่มองเป็นของแถม',who:'พ่อแม่ 388 คน ซาอุดีอาระเบีย',res:'tracking ไม่มีนัยสำคัญ (p 0.589) · ตัวขับคือ digital etiquette β 0.383, กัน cyberbullying 0.224, fit กับการเลี้ยง 0.271 · adoption ลด 28 % → 22 %',ref:'Alkhalifah & Bukar, Frontiers 2026',url:'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1846156/full'},
 {id:8,t:'ตรวจความปลอดภัยของแอพ parental control 40 ตัว',why:'แอพเก็บข้อมูลเด็ก ถ้ารั่วคือจบ — ต้องรู้มาตรฐานขั้นต่ำ',who:'แอพ 20 sideloaded + 20 Play Store',res:'3 แอพส่งข้อมูลไม่เข้ารหัส · ครึ่งของ sideloaded ไม่มี privacy policy · 8/20 คล้าย stalkerware',ref:'Maier, Tanczer, Klausner 2025',url:'https://arxiv.org/abs/2504.16087'},
 {id:9,t:'Review การติดตามตำแหน่งเด็ก (Digital Location Tracking)',why:'ต้องรู้ว่า tracking ช่วยหรือทำร้ายครอบครัวในระยะยาว',who:'ครอบครัวสหรัฐ เด็ก–วัยผู้ใหญ่ตอนต้น',res:'33–69 % ใช้ DLT · สัมพันธ์กับการทำงานของครอบครัวและการปรับตัวเด็ก · "ยังศึกษาน้อยมาก"',ref:'Clin Child Fam Psychol Rev 2024',url:'https://link.springer.com/article/10.1007/s10567-024-00500-8'},
 {id:10,t:'Survey ทัศนคติพ่อแม่ต่อ tracking "ปลอดภัย ไม่ใช่สอดแนม"',why:'วัดว่าพ่อแม่รู้สึกผิดกับการติดตามไหม → กำหนดภาษาในแอพ',who:'พ่อแม่ 112 คน ลูก 5–18',res:'ใช้กันมากแต่ทัศนคติก้ำกึ่ง ขัดแย้งในตัวเอง',ref:'Surveillance & Society',url:'https://ojs.library.queensu.ca/index.php/surveillance-and-society/article/view/15719'},
 {id:11,t:'Life360 กับคุณภาพความสัมพันธ์พ่อแม่–ลูก',why:'คู่แข่งใหญ่สุดในตะวันตก ผลต่อความสัมพันธ์เป็นอย่างไร',who:'285 คน อายุเฉลี่ย 20.5 ย้อนดูสมัยมัธยม',res:'การถูกติดตามสมัยมัธยมสัมพันธ์กับคุณภาพความสัมพันธ์ (ทั้งบวกและลบตามวิธีใช้)',ref:'Langlais & Marich, Family Journal 2024',url:'https://journals.sagepub.com/doi/10.1177/10664807241269455'},
 {id:12,t:'Focus group: เยาวชนต่อรองการถูกติดตามอย่างไร',why:'ออกแบบ consent / contract สำหรับ G4',who:'147 เยาวชน 13–16 เบลเยียม 21 กลุ่ม',res:'ไม่ปฏิเสธทั้งหมด ยอมรับได้ถ้ามีเหตุผลและตกลงกัน',ref:'JCMC 2026',url:'https://academic.oup.com/jcmc/article/31/3/zmag010/8696200'},
 {id:13,t:'GPS กับการ "ผลิตความกลัว" ในครอบครัว',why:'เตือนว่า dashboard ที่เน้นภัยจะทำให้พ่อแม่กังวลมากขึ้น',who:'วิเคราะห์เชิงสังคม',res:'เทคโนโลยี tracking สร้างความกลัวเพิ่ม ไม่ได้ลด',ref:'Tracking children, constructing fear 2015',url:'https://www.researchgate.net/publication/273890500'},
 {id:14,t:'สถิติวัยรุ่นใช้ location sharing',why:'เทียบ "สมัครใจ" vs "บังคับ"',who:'วัยรุ่น/Gen Z ผู้ใช้ Life360',res:'> 75 % ใช้ location sharing · 95 % บอกมีประโยชน์ (แบบสมัครใจ)',ref:'Life360 2023 / Psychology Today 2025',url:'https://www.psychologytoday.com/us/blog/positively-media/202507/why-teens-love-location-sharing'},
 {id:15,t:'Pew: วัยรุ่นกับพ่อแม่จัดการเวลาหน้าจอ',why:'ตัวเลขระดับชาติเรื่องความขัดแย้งและความยาก',who:'1,453 คู่วัยรุ่น 13–17 + พ่อแม่ สหรัฐ',res:'50 % เคยเปิดดูมือถือลูก · 47 % ตั้งเวลา · 38 % ทะเลาะ · 40 % บอกจัดการยาก',ref:'Pew Research 2024',url:'https://www.pewresearch.org/internet/2024/03/11/how-teens-and-parents-approach-screen-time/'},
 {id:16,t:'Pew: พ่อแม่ของเด็ก ≤ 12 กับหน้าจอ',why:'รู้ว่าเด็กได้มือถือเครื่องแรกอายุเท่าไร → เลือก Gen เป้าหมาย',who:'3,054 พ่อแม่ + 4 focus groups สหรัฐ',res:'25 % มีเครื่องเอง · 60 % ของเด็ก 11–12 · 37 % ของ 11–12 ใช้ TikTok · 42 % ยอมรับจัดการได้ดีกว่านี้ · 80 % มองโซเชียลโทษมากกว่าประโยชน์',ref:'Pew Research 2025',url:'https://www.pewresearch.org/internet/2025/10/08/how-parents-manage-screen-time-for-kids/'},
 {id:17,t:'Pew: พ่อแม่ใช้เครื่องมือดิจิทัลดูแลลูกแค่ไหน',why:'baseline ว่าซอฟต์แวร์เป็นทางเลือกรอง',who:'พ่อแม่วัยรุ่น สหรัฐ',res:'39 % ใช้ parental control · 16 % จำกัดมือถือด้วยเครื่องมือ · ส่วนใหญ่ "คุย + ดูเอง"',ref:'Pew Research 2016',url:'https://www.pewresearch.org/internet/2016/01/07/parents-teens-and-digital-monitoring/'},
 {id:18,t:'รายงานตลาด Kids Smartwatch / GPS wearable',why:'ตัดสินใจว่า watch ต้องอยู่ MVP ไหม และเอเชียใหญ่แค่ไหน',who:'ตลาดโลก เน้น Asia-Pacific',res:'APAC 38.6 % (~3.2 พันล้าน USD 2025) · 55 % พ่อแม่ในเมืองใช้ wearable ติดตามไปโรงเรียน · phone ban เป็นตัวเร่ง',ref:'SNS Insider / Dataintelo 2025–26',url:'https://www.snsinsider.com/reports/kids-smartwatch-market-8160'},
 {id:19,t:'Disrupting Harm: ภัยทางเพศออนไลน์ต่อเด็กไทย',why:'ข้อมูลไทยที่หนักที่สุดเรื่องภัยออนไลน์ — ต้องรู้ขนาดปัญหา',who:'เด็กไทย 12–17 + ผู้ดูแล (ECPAT/INTERPOL/UNICEF)',res:'~400,000 คน (9 %) ถูกแสวงหาประโยชน์ปี 2021 · 10–31 % ไม่บอกใคร · ผู้ดูแลแค่ 17 % จะแจ้งตำรวจ · ผู้กระทำส่วนใหญ่คนรู้จัก',ref:'UNICEF Innocenti 2022',url:'https://www.unicef.org/innocenti/media/4151/file/DH-Thailand-Report-2022.pdf'},
 {id:20,t:'COPAT สำรวจภัยออนไลน์เด็กไทย',why:'ความเสี่ยงที่พ่อแม่ไทยเจอจริง ต่างจากตะวันตกตรงไหน',who:'เด็กและเยาวชนไทย (กรมกิจการเด็กฯ)',res:'ถูกล่อลวง ~12 % · ติดเกม พนันออนไลน์ cyberbullying นัดพบคนแปลกหน้า',ref:'COPAT 2562/2565',url:'https://www.bangkokbiznews.com/lifestyle/1047638'},
 {id:21,t:'รายงานภาวะสังคมไทย Q4/2568 — พัฒนาการเด็กกับจอ',why:'ใช้เป็น benchmark C4 และเหตุผลสำหรับ G1–G2',who:'เด็กไทยปฐมวัย (สศช.)',res:'ผ่านพัฒนาการตามวัย 81.6 % (เป้า 85 %) · ภาษาช้าสุด · พฤติกรรมคล้าย pseudo-autism',ref:'สศช. 2025 / Bangkok Post',url:'https://www.bangkokpost.com/thailand/general/3206118/too-much-screen-time-bad-for-kids'},
 {id:22,t:'เด็ก 2–5 กับอุปกรณ์อัจฉริยะ เขตสุขภาพ 3',why:'ตัวเลขไทยระดับครัวเรือน',who:'เด็ก 2–5 ปี ภาคเหนือตอนล่าง',res:'จอเฉลี่ย 1 ชม. 33 นาที/วัน · 54.3 % เกิน 1 ชม.',ref:'JPSS 2024',url:'https://so03.tci-thaijo.org/index.php/jpss/article/view/255919'},
 {id:23,t:'นโยบายห้ามมือถือในห้องเรียน ศธ./สพฐ.',why:'กำหนดว่าเด็กประถมพกมือถือได้ไหม → watch หรือ phone',who:'โรงเรียนสังกัด สพฐ.',res:'ยัง "ดุลพินิจโรงเรียน" ไม่ใช่คำสั่งบังคับ — ต้องสำรวจโรงเรียนเป้าหมายเอง',ref:'Thai PBS / Kruwandee 2024–25',url:'https://www.thaipbs.or.th/news/content/264566'},
 {id:24,t:'UNICEF ลาว: แผนชาติความปลอดภัยออนไลน์เด็ก',why:'ตลาดลาวมีข้อมูลไหม',who:'รัฐบาลลาว + UNICEF (LSIS-III 2023)',res:'เพิ่งเริ่ม workshop ก.ย. 2025 สำหรับแผน 2026–2030 · ไม่พบงานวิจัยพ่อแม่ลาวกับแอพติดตามเลย = ช่องว่าง',ref:'UNICEF Lao PDR 2025',url:'https://www.unicef.org/laos/press-releases/lao-pdr-launches-national-effort-keep-children-safe-digital-age'},
 {id:25,t:'แอพ "คุณลูก" (มข.) ติดตามพัฒนาการเด็ก 0–6',why:'precedent ว่าพ่อแม่ไทยรับแอพดูแลลูกได้',who:'พ่อแม่ไทย คลินิกสุขภาพเด็กดี',res:'ใช้จริงในระบบสาธารณสุข ตั้งแต่ 2015',ref:'Hfocus 2015',url:'https://www.hfocus.org/content/2015/03/9470'}
];
window.PP.PAINTBL=[
 {g:'ความปลอดภัยกายภาพ',rows:[
  {id:'P1',t:'ไม่รู้ว่าลูกอยู่ไหนระหว่างเดินทางไปโรงเรียน/เรียนพิเศษ',from:'พ่อแม่ในเมืองเอเชีย · ครอบครัวสหรัฐ 33–69 %',fix:'ตำแหน่งสด + Safe Zone แจ้งถึง/ออก + Pickup Today ว่าวันนี้ใครรับ',ref:'#18 #9',f:'A1 A2 AD1'},
  {id:'P2',t:'ติดต่อลูกไม่ได้ เครื่องเงียบ แบตหมด โรงเรียนเก็บมือถือ',from:'โรงเรียนที่ห้ามมือถือ · ตลาด watch',fix:'Watch เป็นอุปกรณ์หลัก G1–G2 · Loud signal · แจ้งแบต 20 % · Ping ปุ่มเดียว',ref:'#18 #23',f:'A5 A11 B2 E5'},
  {id:'P3',t:'เกิดเหตุแล้วลูกขอความช่วยเหลือไม่ได้ / ไม่กล้าบอก',from:'เด็กไทย 12–17 · 10–31 % ไม่บอกใคร',fix:'SOS ปุ่มกายภาพ + Emergency Card + ส่งถึงทุกคนในครอบครัว',ref:'#19',f:'A4 AD3'},
  {id:'P4',t:'ยิ่งติดตาม ยิ่งกลัว — แอพผลิตความกังวลเพิ่ม',from:'พ่อแม่ที่ใช้ GPS (ทัศนคติก้ำกึ่ง)',fix:'Dashboard เริ่มด้วยสถานะ "ปลอดภัย" ไม่ใช่แผนที่จุดแดง · Quiet hours · ลดจำนวน alert',ref:'#13 #10',f:'C1 C6'}]},
 {g:'ภัยออนไลน์ + หน้าจอ',rows:[
  {id:'P5',t:'ลูกได้มือถือเครื่องแรก 10–12 พ่อแม่ตั้งค่าไม่ทัน',from:'พ่อแม่เด็ก ≤ 12 สหรัฐ (60 % ของ 11–12 มีเครื่องเอง)',fix:'Onboarding ตามอายุ → Gen Profile อัตโนมัติ · G3 คือ MVP',ref:'#16',f:'E2 E3'},
  {id:'P6',t:'จัดการเวลาหน้าจอยาก ทะเลาะกันบ่อย',from:'พ่อแม่วัยรุ่นสหรัฐ 40 % ยาก · 38 % ทะเลาะ',fix:'เปลี่ยน "ห้าม" เป็น "ตกลง": Missions แลกเวลา · Request & Approve · Schedule ที่ลูกเห็นล่วงหน้า',ref:'#15 #16',f:'A7 A8 D4 AD6'},
  {id:'P7',t:'ภัยทางเพศออนไลน์จากคนรู้จัก เด็กไม่บอก พ่อแม่ไม่รู้จะทำอย่างไร',from:'เด็กไทย 9 % · ผู้ดูแล 17 % แจ้งตำรวจ',fix:'AI text detection แจ้งเฉพาะ High risk + คำแนะนำวิธีคุย + ช่องทางแจ้งเหตุ (v2)',ref:'#19 #20',f:'A10'},
  {id:'P8',t:'เด็กเล็กใช้จอเกิน พัฒนาการช้า',from:'เด็กไทยปฐมวัย 81.6 % ผ่านเกณฑ์ · 2–5 ปี จอ 1.5 ชม.',fix:'G1–G2 เวลารวมบนแท็บเล็ต + เทียบพัฒนาการ WHO + Hobbies ที่พ่อแม่บันทึก',ref:'#21 #22',f:'A7 C4 D3'},
  {id:'P9',t:'แอพ parental control เองรั่ว/ไม่ปลอดภัย',from:'แอพ 40 ตัวในตลาด',fix:'เข้ารหัสทุกชั้น (SQLCipher) · ไม่ทำ sideload · privacy policy ชัด · ผ่าน MASVS',ref:'#8',f:'E7'},
  {id:'P10',t:'เครื่องมือปัจจุบัน "ห้าม" อย่างเดียว ไม่สอน',from:'ครอบครัวในงาน review หลายประเทศ',fix:'Money lessons · Trust dashboard ที่อธิบายว่าทำไม · Badge จากพฤติกรรมดี',ref:'#6 #5',f:'AD11 AD5 D5'}]},
 {g:'พฤติกรรม / การเติบโต',rows:[
  {id:'P11',t:'พ่อแม่ต้องการวินัยและมารยาทดิจิทัล มากกว่ารู้ตำแหน่ง',from:'พ่อแม่ 388 คน (tracking ไม่มีนัยสำคัญ)',fix:'Missions & Rewards, Request & Approve เป็นหน้าตาหลัก · tracking เป็นของพื้นฐาน',ref:'#7',f:'D4 D5 AD6'},
  {id:'P12',t:'ข้อมูลที่แอพให้มีแต่ "ลูกทำผิด" ไม่มีด้านดี',from:'พ่อแม่–วัยรุ่นที่ทดลองดูแลร่วมกัน',fix:'Weekly report ที่มีสิ่งดี · Growing potential · Hobby portfolio',ref:'#3 #2',f:'C2 C3 D3'},
  {id:'P13',t:'ค่าขนม/การเงินเด็ก — มีแอพ แต่ไม่มีงานวิจัยวัดผล',from:'ค้นพบแต่ product content (Greenlight, GoHenry)',fix:'ยังไม่มีคำตอบจาก survey → ต้องทดสอบเองใน Survey ① ข้อ 5',ref:'—',f:'D1 D2'},
  {id:'P14',t:'ไม่รู้ว่าลูกโตไปทางไหนเทียบเด็กวัยเดียวกัน',from:'ไม่พบงานวิจัยตรง · มี benchmark พัฒนาการไทย',fix:'เทียบ percentile แบบไม่ระบุตัวตน ต้องมี ≥ 50 ตัวอย่างต่อกลุ่ม · เริ่มจากค่า WHO',ref:'#21',f:'C4 C5'}]},
 {g:'ปฏิสัมพันธ์พ่อแม่–ลูก',rows:[
  {id:'P15',t:'พ่อแม่ส่วนใหญ่ "คุย + ดูเอง" ไม่ใช้ซอฟต์แวร์ · adoption ลดลง',from:'พ่อแม่สหรัฐ 39 % → 22 %',fix:'แอพต้องเสริมการคุย: Ping/Check-in สติกเกอร์ปุ่มเดียว ไม่ใช่ระบบเฝ้าระวัง',ref:'#17 #7',f:'E5'},
  {id:'P16',t:'แชร์ตำแหน่งแบบสมัครใจวัยรุ่นชอบ 95 % · แบบบังคับเกลียด 76 % 1 ดาว',from:'Gen Z ผู้ใช้ Life360 vs รีวิวเด็กบน Play Store',fix:'G4–G5: check-in on demand แทน tracking ตลอด · ลูกเลือกแชร์เอง',ref:'#14 #1',f:'A1 E5 AD10'},
  {id:'P17',t:'หลายคนช่วยดูลูก (ปู่ย่า ญาติ) แต่แอพออกแบบให้พ่อแม่คนเดียว',from:'งาน community oversight / extended family',fix:'Family roles 4 ระดับ · Pickup Today · SOS ถึงทุกคน',ref:'#3 #5',f:'E4 AD1'}]},
 {g:'ความไว้ใจ (ไม่มีใน mindmap เดิม)',addon:true,rows:[
  {id:'P18',t:'เด็กรู้สึกถูกสอดแนม → ลบแอพ / หลบเลี่ยง / โกหก',from:'เด็ก 8–19 รีวิว 736 ชิ้น',fix:'Trust Dashboard "พ่อแม่เห็นอะไรบ้าง" + log ทุกครั้งที่ถูกฟัง/ขอพิกัด',ref:'#1 #2',f:'AD5 E7'},
  {id:'P19',t:'เด็กยอมรับได้ถ้าต่อรอง มีเหตุผล ตกลงกัน',from:'เยาวชน 13–16 เบลเยียม 147 คน',fix:'Consent ตอน pair เลือกได้ต่อรายการ · Teen Contract ลงชื่อสองฝ่าย',ref:'#12 #3',f:'AD10 E7'},
  {id:'P20',t:'พ่อแม่เองรู้สึกผิดที่สอดแนม',from:'พ่อแม่ 112 คน ทัศนคติก้ำกึ่ง',fix:'ภาษาในแอพใช้ "ดูแล" ไม่ใช่ "ควบคุม" · แสดงให้พ่อแม่เห็นว่าลูกเห็นอะไร',ref:'#10',f:'E7 C1'}]}
];
// ---- Feasibility (v0.6) ----
// k: S=software only, P=paid service, H=hardware/IoT, OS=platform-restricted, L=legal gate
window.PP.FIXED=[
 {id:'F1',t:'Apple Developer Program',c:'99 USD/ปี',w:'ก่อน TestFlight'},{id:'F2',t:'Google Play Console',c:'25 USD ครั้งเดียว',w:'ก่อน internal testing'},
 {id:'F3',t:'Server + Postgres (Singapore)',c:'20–40 USD/เดือน',w:'Sprint 1'},{id:'F4',t:'Object storage S3',c:'~5 USD/เดือน',w:'Sprint 1'},
 {id:'F5',t:'SMS OTP gateway',c:'0.03–0.06 USD/ข้อความ',w:'ถ้าล็อกอินเบอร์โทร — เริ่ม Google/Apple sign-in ฟรีได้'},{id:'F6',t:'Push OneSignal + Firebase project',c:'ฟรี ≤ 10k subs',w:'Sprint 1'},
 {id:'F7',t:'Map tiles',c:'Google ฟรี 200 USD/เดือน · OSM ฟรี',w:'Sprint 1'},{id:'F8',t:'Sentry',c:'ฟรี tier',w:'Sprint 1'},{id:'F9',t:'Shorebird code push',c:'ฟรี tier',w:'ก่อน release'},
 {id:'F11',t:'ที่ปรึกษากฎหมาย PDPA / ดักฟัง',c:'ตามตกลง',w:'ก่อน v1.1 (A6 A10)'},{id:'F12',t:'Watch sample 2–3 เรือน + SIM',c:'30–60 USD/เรือน + SIM',w:'ก่อนตัดสินใจ B2'}
];
window.PP.FEAS={
 A1:{k:'S',and:'S foreground service + background location',ios:'S/OS ขอ Always, ใช้ significant-change + region',need:'Kids app บนเครื่องลูก',cost:'map tiles F7',v:'ทำได้'},
 A2:{k:'S',and:'S Geofencing API',ios:'S จำกัด 20 โซน/แอพ',need:'—',cost:'—',v:'ทำได้'},
 A3:{k:'S',and:'S คำนวณ server',ios:'S',need:'A1',cost:'—',v:'1.1'},
 A4:{k:'S',and:'S push สูง + foreground service',ios:'S/OS เสียงทะลุ silent ต้อง Critical Alerts entitlement',need:'ปุ่มกายภาพ = H watch',cost:'SMS fallback F5',v:'ทำได้'},
 A5:{k:'OS',and:'S เล่นเสียงจาก push แม้เงียบ',ios:'OS ไม่ได้ถ้าไม่มี Critical Alerts',need:'—',cost:'—',v:'Android เต็ม / iOS บางส่วน'},
 A6:{k:'OS',and:'S/L อัดจาก foreground service, โชว์ไอคอนไมค์',ios:'OS ทำไม่ได้ เริ่มอัดจาก background ไม่ได้',need:'—',cost:'L ที่ปรึกษากฎหมาย F11',v:'1.1 Android เท่านั้น'},
 A7:{k:'OS',and:'S UsageStatsManager',ios:'OS Family Controls entitlement, ข้อมูล opaque ส่ง server ไม่ได้',need:'—',cost:'—',v:'Android 1.1 / iOS จำกัด'},
 A8:{k:'OS',and:'S Accessibility/Device admin, Play policy เข้ม',ios:'OS ManagedSettings ต้อง entitlement',need:'—',cost:'—',v:'Android 1.1'},
 A9:{k:'P',and:'S+P VpnService + DNS filter',ios:'OS ผ่าน Screen Time/MDM เท่านั้น',need:'—',cost:'P DNS filter 2–5 USD/เดือน/ครอบครัว',v:'v2'},
 A10:{k:'OS',and:'S+P NotificationListener + LLM',ios:'OS ทำไม่ได้ อ่าน notification แอพอื่นไม่ได้',need:'—',cost:'P LLM ตามใช้ · L',v:'v2 Android เท่านั้น'},
 A11:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'ทำได้'},
 B1:{k:'S',and:'S',ios:'S',need:'application id ที่สอง',cost:'เวลาพัฒนา ×1.5',v:'ทำได้'},
 B2:{k:'H',and:'H+P',ios:'H+P',need:'OEM เปิด API/MQTT + SIM 4G',cost:'30–60 USD/เรือน + SIM 3–5 USD/เดือน',v:'เลื่อน S3 / 1.1 ซื้อ sample ก่อน'},
 B3:{k:'H',and:'H BLE band',ios:'H',need:'band + มือถือลูก',cost:'15–30 USD/เส้น',v:'v2'},
 B4:{k:'H',and:'H',ios:'H',need:'ไม่มี OEM เด็ก',cost:'—',v:'ตัด'},
 B5:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'ทำได้'},
 B6:{k:'S',and:'S',ios:'S',need:'watch = H',cost:'—',v:'ทำได้'},
 C1:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'ทำได้'},C2:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'1.1'},
 C3:{k:'S',and:'S',ios:'S',need:'ข้อมูล ≥ 4 สัปดาห์',cost:'—',v:'v2'},C4:{k:'S',and:'S',ios:'S',need:'ผู้ใช้ ≥ 50/กลุ่ม หรือ WHO',cost:'—',v:'v2'},C5:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'v2'},
 C6:{k:'S',and:'S',ios:'S',need:'push F6',cost:'ฟรี',v:'ทำได้'},
 D1:{k:'S',and:'S ลูกกรอก',ios:'S',need:'e-wallet = P+L partner ธนาคาร + KYC เด็ก',cost:'—',v:'1.1 · e-wallet v2+'},
 D2:{k:'S',and:'S จำลอง',ios:'S',need:'ลงทุนจริง = P+L ใบอนุญาต ไม่ทำ',cost:'—',v:'v2'},
 D3:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'1.1'},D4:{k:'S',and:'S',ios:'S',need:'storage รูป F4',cost:'—',v:'ทำได้'},D5:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'1.1'},D6:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'v2'},
 E1:{k:'P',and:'P SMS OTP',ios:'P',need:'SMS gateway F5 หรือ Google/Apple sign-in ฟรี',cost:'ต่อข้อความ',v:'ทำได้ เริ่มฟรีก่อน'},
 E2:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'ทำได้'},E3:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'ทำได้'},E4:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'ทำได้'},
 E5:{k:'S',and:'S',ios:'S',need:'push F6',cost:'ฟรี',v:'ทำได้'},
 E6:{k:'P',and:'P',ios:'P',need:'บัญชี dev F1 F2',cost:'Apple/Google หัก 15–30 %',v:'v2'},
 E7:{k:'S',and:'S+L',ios:'S+L',need:'F11',cost:'—',v:'ทำได้ พื้นฐาน'},
 AD1:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'ทำได้'},AD2:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'1.1'},AD3:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'ทำได้'},
 AD4:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'1.1'},AD5:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'ทำได้'},AD6:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'1.1'},
 AD7:{k:'H',and:'S ถ้าคนขับใช้แอพ / H ถ้า GPS รถ',ios:'S',need:'คนขับ',cost:'—',v:'later'},AD8:{k:'H',and:'H',ios:'H',need:'watch/band',cost:'ตาม B2',v:'ตาม B2'},
 AD9:{k:'P',and:'P LLM',ios:'P',need:'—',cost:'0.01–0.05 USD/คำถาม',v:'v2'},AD10:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'v2'},AD11:{k:'S',and:'S',ios:'S',need:'—',cost:'—',v:'v2'},AD12:{k:'S',and:'S+L',ios:'S+L',need:'moderation',cost:'—',v:'later'}
};
// ---- Watch decision (2026-09-14) ----
window.PP.WATCH={
 verdict:'ซื้อ watch สำเร็จรูปแล้ว integrate ผ่าน API/protocol — ไม่เขียนแอพลงนาฬิกา · ซื้อทีหลังเมื่อ Survey ① ยืนยันโรงเรียนห้ามมือถือ > 50 %',
 options:[
  {t:'1. นาฬิกาเด็ก 4G จาก OEM (white-label)',pick:true,pro:'30–60 USD/เรือน · SIM 4G ลาว/ไทย · ปุ่ม SOS กายภาพ · integrate ได้ 2 แบบ: vendor cloud API หรือชี้ watch มา server เรา (SMS config APN/IP) แล้วคุย TCP/MQTT protocol ของเขา (ตระกูล Wonlex / SeTracker / 3g-elec)',con:'ต้องเช็กก่อนซื้อว่า vendor ให้ API/protocol doc จริง — imoo, Xplora ปิด · ยังไม่ได้ตรวจเจ้าใดเป็นรายตัว'},
  {t:'2. Apple Watch SE (Family Setup) / Wear OS',pick:false,pro:'เขียนแอพ watchOS / Wear OS เองได้',con:'250+ USD · เด็ก G1–G3 ไม่มี · Apple Watch เด็กต้องตั้งผ่าน iPhone พ่อแม่ · ไม่เหมาะตลาดไทย/ลาว'},
  {t:'3. ทำ hardware เอง',pick:false,pro:'—',con:'ไม่คุ้มก่อนมีผู้ใช้'}
 ],
 steps:['MVP S1–S3 ทำบนมือถือ G3 ก่อน ไม่แตะ watch','Survey ① ถามโรงเรียนห้ามมือถือกี่ % — ถ้า > 50 % เดินทาง 1','ซื้อ sample 2–3 เรือนจาก OEM ที่ยืนยันแล้วว่ามี API/protocol doc (F12 ~100–180 USD รวม SIM)','ทดสอบ 1 สัปดาห์: พิกัดถึง server เราไหม · SOS ปุ่มกายภาพยิง event ไหม · แบตอยู่กี่วัน','ผ่านแล้วทำ device-gateway (Architecture v0.7 §3) ใน Sprint 1.1']
};
// ---- Build / Buy / Integrate decisions (2026-09-14) — same shape as WATCH ----
window.PP.DECIDE=[
 {id:'BB-1',q:'Login เบอร์โทร OTP — ต้องซื้อ SMS gateway ไหม?',v:'เริ่ม Google/Apple sign-in ฟรี ใน MVP · เพิ่ม SMS OTP เมื่อมีผู้ใช้จริง · ทำ adapter interface ตั้งแต่ S1 เพื่อสลับ provider ได้',
  o:[{t:'Google / Apple sign-in',p:true,pro:'ฟรี · ไม่มีค่าใช้จ่ายต่อข้อความ · ไม่ต้องดูแล gateway',con:'พ่อแม่บางคนไม่มี Gmail/Apple ID · ลาวคุ้นเบอร์โทรมากกว่า'},
     {t:'SMS OTP ผ่าน provider สากล (Twilio / Vonage)',p:false,pro:'ตั้งค่าเร็ว API ดี',con:'ราคาลาว/ไทยแพง 0.05–0.10 USD/ข้อความ · เบอร์ลาวส่งถึงไม่ครบทุกเครือข่าย (ต้องทดสอบ LTC/Unitel/ETL)'},
     {t:'SMS OTP ผ่าน provider ท้องถิ่น (ไทย: ThaiBulkSMS/SMSMKT · ลาว: ผ่าน operator โดยตรง)',p:false,pro:'ถูกกว่า 0.02–0.04 USD · ส่งถึงชัวร์',con:'ต้องทำสัญญา/ลงทะเบียน sender name · API คุณภาพต่างกัน · ลาวยังไม่ได้ตรวจว่ามีเจ้าไหนเปิด API'},
     {t:'Email OTP',p:false,pro:'ฟรี (Resend/SES)',con:'เด็ก/พ่อแม่ลาวใช้ email น้อย'}],
  s:['S1: social login + email OTP สำรอง · SmsAdapter interface + ConsoleAdapter','Survey ①: ถามว่าพ่อแม่มี Gmail/Apple ID กี่ %','ทดสอบส่ง SMS ทดลอง 20 ข้อความไป 3 เครือข่ายลาวก่อนเซ็นสัญญา','เพิ่ม SMS OTP ใน 1.1 ถ้า social login ไม่พอ']},
 {id:'BB-2',q:'Push notification — OneSignal หรือ Firebase ตรง?',v:'OneSignal ตาม handbook (ไม่ใช้ firebase_messaging) · แต่ยังต้องสร้าง Firebase project เพื่อ FCM credentials ให้ OneSignal ใช้',
  o:[{t:'OneSignal + flutter_local_notifications',p:true,pro:'ฟรี ≤ 10k subs · segment/schedule ในตัว · ถอด Firebase SDK ออกจาก binary · REST API ง่าย',con:'ยังพึ่ง FCM (Android) และ APNs (iOS) อยู่เบื้องหลัง · เกิน 10k ต้องจ่าย'},
     {t:'firebase_messaging ตรง',p:false,pro:'ฟรีไม่จำกัด',con:'handbook ห้าม · ต้องเขียน segment/retry เอง · SDK หนัก'},
     {t:'APNs/FCM HTTP v1 จาก server เอง',p:false,pro:'ฟรี ไม่มี vendor',con:'ต้องดูแล token lifecycle, retry, batching เอง — เสียเวลา Sprint'}],
  s:['S1: สร้าง Firebase project (ฟรี) เอา FCM server key + APNs key (ต้อง Apple dev account F1)','OneSignal 6 apps (parent/kids × dev/uat/prod)','payload = {route,id} เท่านั้น ทดสอบว่าที่ส่งจริงไม่มีชื่อ/จำนวนเงิน','ทดสอบ critical channel บน Android จริง 3 ยี่ห้อ (Xiaomi/Oppo/Samsung ฆ่า background ต่างกัน)']},
 {id:'BB-3',q:'แผนที่ — Google Maps ต้องจ่ายไหม?',v:'flutter_map + OSM tiles ฟรีใน MVP · สลับ Google Maps เมื่อต้องการค้นหาที่อยู่/POI ไทย-ลาวที่แม่นกว่า',
  o:[{t:'flutter_map + OpenStreetMap tiles',p:true,pro:'ฟรี · ตาม handbook · ไม่ต้อง API key · tile server เลือกได้ (OSM public จำกัด rate, ใช้ MapTiler free tier 100k/เดือน)',con:'ข้อมูลถนนลาวบางพื้นที่บาง · ค้นหาที่อยู่ต้องใช้ Nominatim (ช้า, rate limit)'},
     {t:'Google Maps SDK + Places',p:false,pro:'POI ไทย/ลาวครบสุด · ค้นหาที่อยู่ดี · geocoding',con:'ต้องผูกบัตร · เครดิตฟรี 200 USD/เดือน แล้วคิดตามใช้ · Places API แพง'},
     {t:'Mapbox',p:false,pro:'สวย · ฟรี 50k loads/เดือน',con:'ข้อมูลลาวไม่ต่างจาก OSM (ใช้ OSM เป็นฐาน)'}],
  s:['S1: flutter_map + MapTiler free tier · เก็บ tile cache ในเครื่อง','Safe Zone editor: เลือกจุดบนแผนที่ + Nominatim search','วัดใน UAT: พ่อแม่หาโรงเรียนเจอไหม ถ้า < 80 % สลับ Google Places เฉพาะช่องค้นหา']},
 {id:'BB-4',q:'Background location บน Kids app — plugin ฟรีพอไหม?',v:'เริ่ม geolocator + foreground service (ฟรี) · วัดแบต 30 นาที/release ตาม handbook §8.3 · ถ้าเครื่องจีนฆ่า service บ่อยค่อยจ่าย flutter_background_geolocation',
  o:[{t:'geolocator + flutter_foreground_task (Android) / significant-change (iOS)',p:true,pro:'ฟรี · maintain ดี · ควบคุมเองได้',con:'Xiaomi/Oppo/Vivo ฆ่า background service — ต้องพาผู้ใช้ปิด battery optimisation เอง · iOS ความถี่ต่ำ'},
     {t:'flutter_background_geolocation (Transistor)',p:false,pro:'จัดการ OEM kill, motion detection, batch upload ให้ · ประหยัดแบตดีที่สุด',con:'Android licence ~349 USD ครั้งเดียว/แอพ · native footprint ใหญ่ · OTA patch ไม่ได้'},
     {t:'workmanager periodic (15 นาที)',p:false,pro:'ฟรี ง่าย',con:'ช้าเกินสำหรับ SOS/geofence · Android จำกัด 15 นาทีขั้นต่ำ'}],
  s:['S1: geolocator + foreground service · adaptive interval (โซน 5 นาที / เคลื่อน 1 นาที / SOS 10 วิ)','Onboarding Kids: หน้า "ปิด battery optimisation" ตามยี่ห้อ (dontkillmyapp.com)','ทดสอบบน Xiaomi, Oppo, Samsung, iPhone จริง 24 ชม. วัด % แบต + จุดหาย','ถ้าหาย > 20 % ของช่วงเวลา → ซื้อ Transistor']},
 {id:'BB-5',q:'Apple entitlements (Critical Alerts, Family Controls) — ขอยังไง ได้แน่ไหม?',v:'ยื่นทั้งสองทันทีที่มีบัญชี Apple (F1) · ใช้เวลา 2–8 สัปดาห์ ไม่การันตี · ออกแบบ fallback ให้แอพใช้ได้โดยไม่มี',
  o:[{t:'Critical Alerts (com.apple.developer.usernotifications.critical-alerts)',p:true,pro:'เสียง SOS ทะลุ silent/DND บน iOS',con:'ต้องกรอกฟอร์มอธิบาย use case · Apple อนุมัติเฉพาะ safety/health/security · อาจปฏิเสธ'},
     {t:'Family Controls (com.apple.developer.family-controls)',p:true,pro:'เปิดทาง Screen Time API: เวลาหน้าจอ, app lock บน iOS',con:'ข้อมูลเป็น opaque token ส่งขึ้น server ไม่ได้ · ต้องเป็น "parental control app" ชัดเจน · review เข้ม'},
     {t:'ไม่ขอ ใช้ push ปกติ',p:false,pro:'ไม่ต้องรอ',con:'iOS ได้แค่ตำแหน่ง + SOS แบบ push ธรรมดา'}],
  s:['สมัคร Apple Developer เป็นนิติบุคคล (ต้อง D-U-N-S) ไม่ใช่บุคคล — โอนสิทธิ์ทีหลังยาก','ยื่นทั้งสองฟอร์มพร้อมลิงก์ privacy policy + วิดีโอ demo','ระหว่างรอ: iOS build มี SOS/ping/location ครบ ไม่พึ่ง entitlement','ถ้าปฏิเสธ: iOS = "ดูแลเบา" (location + SOS + growth) เขียนใน store description']},
 {id:'BB-6',q:'Hosting + Postgres — ที่ไหนที่เน็ตลาวเปิดถึง?',v:'ทดสอบ curl จากลาว 3 เครือข่ายก่อนเลือกทุกครั้ง · เสนอ Supabase SG (Postgres+PostGIS อย่างเดียว) + VPS SG สำหรับ api-server',
  o:[{t:'Supabase Singapore (ใช้แค่ Postgres) + VPS SG (Hetzner ไม่มี SG → DigitalOcean/Vultr/Linode SG)',p:true,pro:'Postgres มี PITR + PostGIS · VPS 20–24 USD/เดือน · IP ตรงไม่ผ่าน edge ที่ถูกบล็อก',con:'2 provider · ต้องดูแล VPS เอง (Docker + Caddy)'},
     {t:'Fly.io sin + Fly Postgres',p:false,pro:'deploy ง่าย · ใกล้ลาว',con:'ยังไม่ได้ทดสอบ reachability จากลาว · Postgres ไม่ managed จริง'},
     {t:'AWS ap-southeast-1 (ECS + RDS)',p:false,pro:'มาตรฐาน · ขยายได้',con:'แพงกว่า 3–4 เท่า · ซับซ้อนสำหรับทีมเล็ก'},
     {t:'Vercel / Netlify / Cloudflare Workers',p:false,pro:'ฟรี',con:'Vercel/Netlify ต่อจากลาวไม่ได้ (พิสูจน์ 2026-09-12) · Workers ไม่รัน Express/BullMQ'}],
  s:['S0: curl ทดสอบ IP ของ DO-SG, Vultr-SG, Supabase-SG, Fly-sin จาก LTC/Unitel/ETL','เลือกที่ผ่านทั้ง 3 เครือข่าย','api.pingping.unclebuafarm.com ผ่าน Cloudflare DNS only (ไม่ proxy ตอนแรก เพื่อ SSE)','GET /health คืน commit hash']},
 {id:'BB-7',q:'Content filter (A9) — ต้องซื้อ DNS filter ไหม?',v:'v2 เท่านั้น · ถ้าทำ ใช้ NextDNS API (มี per-profile config) แทนสร้าง blocklist เอง',
  o:[{t:'NextDNS API + VpnService บนเครื่องลูก',p:true,pro:'ต่อ profile/ครอบครัว · หมวดพร้อม · log ให้',con:'~2 USD/เดือน/profile · Android ต้องขอ VPN permission · iOS ทำไม่ได้ (ต้อง Screen Time)'},
     {t:'CleanBrowsing / Cloudflare for Families (1.1.1.3)',p:false,pro:'ฟรี',con:'ปรับต่อครอบครัวไม่ได้ · ไม่มี log'},
     {t:'ทำ blocklist + DNS server เอง',p:false,pro:'คุมได้หมด',con:'ดูแล list ไม่ไหว · เสี่ยงบล็อกผิด'}],
  s:['v2: PoC Android VpnService → NextDNS 1 สัปดาห์','ถ้าลูกถอด VPN แจ้งพ่อแม่ (ไม่บังคับติดตั้งซ้ำ)']},
 {id:'BB-8',q:'AI text detection (A10) — ใช้ LLM เจ้าไหน ราคาเท่าไร?',v:'v2 Android เท่านั้น · Claude Haiku 4.5 ผ่าน API สำหรับ classify (ถูก เร็ว รองรับไทย) · ทำ on-device keyword filter ก่อนส่งขึ้น cloud เพื่อลดปริมาณและ privacy',
  o:[{t:'Claude Haiku 4.5 (classify เฉพาะข้อความที่ผ่าน keyword filter)',p:true,pro:'ราคาต่ำ · ไทย/ลาว/อังกฤษได้ · ส่งเฉพาะ snippet',con:'ยังส่งข้อความเด็กขึ้น cloud — ต้อง consent + policy · ค่าใช้จ่ายตามปริมาณ'},
     {t:'On-device model (ML Kit / TFLite)',p:false,pro:'ไม่ออกจากเครื่อง',con:'ภาษาไทย/ลาวไม่มีโมเดลสำเร็จรูป · ต้อง train เอง'},
     {t:'Bark-style ทั้งหมดขึ้น cloud',p:false,pro:'แม่นสุด',con:'privacy หนัก · ค่าใช้จ่ายสูง · กฎหมาย'}],
  s:['ที่ปรึกษากฎหมายก่อน (F11)','v2 PoC: NotificationListener → keyword filter → Haiku classify 6 หมวด → แจ้งเฉพาะ High','วัด false alarm กับ 20 ครอบครัว · พ่อแม่ mark false alarm']},
 {id:'BB-9',q:'e-wallet เด็ก (D1.4) — เชื่อม BCEL One / U-Money / PromptPay ได้ไหม?',v:'ไม่ทำใน 12 เดือนแรก · ลูกกรอกเองพอ · ถ้าจะทำต้องเป็น partnership ระดับธนาคาร ไม่ใช่ API สมัครเอง',
  o:[{t:'ลูกกรอกรายจ่ายเอง + พ่อแม่โอนจริงนอกแอพ',p:true,pro:'ฟรี · ไม่มี KYC · ไม่มีกฎหมายการเงิน',con:'ข้อมูลไม่ครบถ้าลูกลืมกรอก'},
     {t:'เชื่อม e-wallet ผ่าน partnership',p:false,pro:'ข้อมูลอัตโนมัติ',con:'บัญชีเด็กต้องมีผู้ปกครองเปิด · API ไม่เปิดสาธารณะ · ต้องเป็น licensed partner · ใช้เวลา 6–12 เดือน'},
     {t:'บัตร prepaid เด็กแบบ GoHenry',p:false,pro:'ครบวงจร',con:'ต้องใบอนุญาต e-money — เป็นอีกธุรกิจ'}],
  s:['1.1: wallet กรอกเอง + streak reward','v2: คุย BCEL/U-Money เชิงสำรวจ ถ้ามีผู้ใช้ > 5,000 ครอบครัว']},
 {id:'BB-10',q:'บัญชี developer + app id + โดเมน — ใครเป็นเจ้าของ?',v:'สมัคร Apple/Google ในนามนิติบุคคล (บริษัท/ฟาร์ม) ตั้งแต่แรก · app id root ตัดสินวันนี้ เปลี่ยนไม่ได้',
  o:[{t:'นิติบุคคล (D-U-N-S) เจ้าของบัญชี · id `la.pingping.*` (ซื้อ pingping.la)',p:true,pro:'โอน/ขาย/เพิ่มทีมได้ · แบรนด์ชัด',con:'ต้องมีเอกสารบริษัท · D-U-N-S ใช้เวลา 1–2 สัปดาห์ · ซื้อโดเมน .la (~40 USD/ปี)'},
     {t:'บุคคล + id `com.unclebuafarm.pingping`',p:false,pro:'เร็ว ไม่ต้องเอกสาร',con:'โอนบัญชี Apple บุคคล → บริษัทยุ่งยาก · id ผูกกับแบรนด์ฟาร์ม'}],
  s:['เช็ก pingping.la ว่าง? (ยังไม่ได้ตรวจ)','ขอ D-U-N-S ฟรีที่ dnb.com คู่ขนานกับ S0','สมัคร Apple (99 USD) + Google (25 USD) ในนามบริษัท','flutter create --org la.pingping แล้วตรวจ id ที่ได้จริง']},
 {id:'BB-11',q:'ที่ปรึกษากฎหมาย — เรื่องอะไร ตอนไหน?',v:'ก่อน v1.1 (A6 ฟังเสียง, A10 สแกนแชต) · MVP ไม่มีสองอย่างนี้จึงยังไม่ต้อง · แต่ privacy policy + consent flow ต้องมีตั้งแต่ store submission แรก',
  o:[{t:'ที่ปรึกษา PDPA ไทย + กฎหมายลาว (ข้อมูลส่วนบุคคล 2017, cyber 2015)',p:true,pro:'ครอบคลุม 2 ตลาด',con:'ค่าใช้จ่าย · หายาก'},
     {t:'ใช้ template privacy policy + consent ตามแนวทาง Apple/Google',p:false,pro:'ฟรี · พอสำหรับ MVP',con:'ไม่ครอบคลุมดักฟัง/สแกนแชต'}],
  s:['S3: privacy policy (th/lo/en) + consent ตอน pair + หน้า "พ่อแม่เห็นอะไร"','ก่อน 1.1: ปรึกษาเรื่อง A6/A10 + retention + สิทธิ์เด็ก 13+','Store privacy label ต้องตรงกับโค้ด (handbook §11.4)']},
 {id:'BB-12',q:'Wrist band / Ring (B3 B4) — ต้องซื้อไหม?',v:'ไม่ซื้อ · band รอหลัง watch พิสูจน์ตลาด · ring ตัดทุก phase',
  o:[{t:'รอ',p:true,pro:'ไม่เสียเงิน',con:'—'},
     {t:'BLE band (Xiaomi Band ผ่าน BLE)',p:false,pro:'15–30 USD · ก้าว/นอน',con:'ไม่มี GPS ต้องพึ่งมือถือลูก · protocol ปิด reverse-engineer เสี่ยง'},
     {t:'Ring',p:false,pro:'—',con:'ไม่มี OEM เด็ก · เด็กเล็กกลืน/หลุด'}],
  s:['ทบทวนหลัง B2 watch pilot ผ่าน']}
];
