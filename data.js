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
