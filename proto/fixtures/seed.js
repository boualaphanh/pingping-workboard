/* PingPing prototype — fixtures.
   Ids, names and places are copied from pingping-api on 2026-09-21:
     lib/db/seed/IDS.md          family / user / child ids (uuid v5, deterministic)
     lib/db/seed/data/names.ts   Lao and Thai names used by the seed
     lib/db/seed/data/places.ts  real districts of Vientiane, points on residential blocks
   Child ids were re-derived with uuidv5('child:<NN>-<k>', PINGPING_NS) and family 01 child 1
   matches IDS.md exactly, so the derivation is the same one the seed uses.
   Device ids are NOT copied: the seed's device key shape was not verified, so the ids below
   are prototype-local and marked as such.

   THROWAWAY PROTOTYPE — NO NETWORK CALLS — DO NOT COPY INTO pingping-mobile. */

window.PP_SEED = {
  source: "pingping-api/lib/db/seed/IDS.md",
  copiedOn: "2026-09-21",

  /* Family 01 — owner, co-parent, three children. The normal case. */
  family01: {
    id: "8d0101d8-df74-5009-82b9-fad1ee0216e7",
    owner: {
      id: "9c1d95cb-77d7-546c-a1e1-db52c3924fbf",
      phone: "+8562055500001",
      latin: "Khamla Vongsavanh",
      lo: "ຄຳລ້າ ວົງສະຫວັນ",
      role: "owner",
    },
    coParent: {
      id: "58864db8-e8c6-5e48-a944-499a518db31d",
      phone: "+8562055510001",
      latin: "Noy Phommachanh",
      lo: "ນ້ອຍ ພົມມະຈັນ",
      role: "co-parent",
    },
    children: [
      {
        id: "41ea9442-558a-5455-bb48-5dcbb766a2f6",
        latin: "Ton",
        lo: "ຕົ້ນ",
        age: 11,
        status: "safe",           // in a safe zone, location fresh
        zoneKey: "p07_chip_at_school",
        minutesAgo: 2,
        battery: 82,
        accuracy: 12,
        source: "p10_source_gps",
        place: "Xaysettha · Ban Nongbone",
        lat: 17.9812,
        lng: 102.6354,
        devices: [{ kind: "phone", primary: true, battery: 82, localId: "proto-dev-01-1" }],
        // where the marker sits on the map stub, in per cent of the stage
        map: { x: 46, y: 30 },
        dwellKey: "p10_dwell_at_school",
        dwellMinutes: 96,
        silent: false,
        // the prototype draws the face from these; a real profile photo replaces it
        avatar: { style: "short", skin: "#F1C9A5", hair: "#2B2118", shirt: "#3E7F8C", bg: "#DCEFE6" },
      },
      {
        id: "70450a58-c234-5963-aa66-64112f2ea911",
        latin: "Nam",
        lo: "ນ້ຳ",
        age: 10,
        status: "stale",          // last seen more than 10 minutes ago
        zoneKey: "p07_chip_moving",
        minutesAgo: 24,
        battery: 17,
        accuracy: 180,
        source: "p10_source_cell",
        place: "Sisattanak · Ban Phonsinuan",
        lat: 17.9664,
        lng: 102.6297,
        devices: [{ kind: "phone", primary: true, battery: 17, localId: "proto-dev-01-2" }],
        map: { x: 68, y: 54 },
        dwellKey: "p10_dwell_moving",
        dwellMinutes: 12,
        silent: true,
        avatar: { style: "ponytail", skin: "#E8B88E", hair: "#1E1712", shirt: "#B45B7A", bg: "#F3E6DC" },
      },
      {
        id: "dcc160b4-502f-5c6f-8d46-6cfe0c16a194",
        latin: "Fah",
        lo: "ຟ້າ",
        age: 12,
        status: "offline",        // phone off — distinct from permission revoked
        zoneKey: null,
        minutesAgo: 96,
        battery: 0,
        accuracy: 45,
        source: "p10_source_wifi",
        place: "Chanthabouly · Ban Hatsady",
        lat: 17.9701,
        lng: 102.6128,
        devices: [{ kind: "phone", primary: true, battery: 0, localId: "proto-dev-01-3" }],
        map: { x: 24, y: 72 },
        dwellKey: "p10_dwell_last_seen",
        dwellMinutes: 96,
        silent: false,
        avatar: { style: "long", skin: "#D9A379", hair: "#241B14", shirt: "#7A6A46", bg: "#EAEFE2" },
      },
    ],
  },

  /* Family 03 — a child carrying both a phone and a watch. The two-device case for P20. */
  family03: {
    id: "7c6bca60-f75d-52b7-8439-a566fa0afccd",
    firstChild: {
      id: "8a304f7a-2707-5996-83ee-dbbd28fc00d3",
      latin: "Ton",
      lo: "ຕົ້ນ",
      devices: [
        { kind: "phone", primary: true, battery: 64, localId: "proto-dev-03-1a" },
        { kind: "watch", primary: false, battery: 41, localId: "proto-dev-03-1b" },
      ],
    },
  },

  /* Family 20 — no children. The empty state, with a real cause rather than a placeholder. */
  family20: {
    id: "d66fee40-480b-5a83-9704-b401fbe245fd",
    owner: {
      id: "1d513ab6-242b-5a53-a319-2fa194e755fc",
      phone: "+8562055500020",
      latin: "Vilay Souksavath",
      lo: "ວິໄລ ສຸກສະຫວັດ",
      role: "owner",
    },
    children: [],
    pendingInvite: { code: "PP20GUARD" },
  },

  /* Saved places (A2, Sprint S2). The map already shows them so that the S1 screens
     are laid out against the furniture they will eventually have. */
  places: [
    { key: "p10_place_home", icon: "home", x: 26, y: 50 },
    { key: "p10_place_school", icon: "school", x: 52, y: 22 }
  ],

  /* Today's path for the selected child, as percentages of the map stage. */
  route: "M 26 50 L 34 44 L 40 38 L 46 30",

  /* The SOS shown on P07 and P09 — child 2 of family 01. */
  sosAlert: {
    childId: "70450a58-c234-5963-aa66-64112f2ea911",
    childLatin: "Nam",
    childLo: "ນ້ຳ",
    at: "09:41",
    minutesAgo: 1,
    batteryAtAlert: 17,
    accuracy: 12,
    place: "Xaysettha · Ban Nongbone",
    lat: 17.9812,
    lng: 102.6354,
    emergencyCard: { bloodType: "O+", allergiesKey: "p09_allergies_value" },
  },

  /* Pairing code — prototype-local. The seed's guardian invites use PP<NN>GUARD; a kid
     pairing code shape has not been fixed in the contract yet, so this is a placeholder. */
  pairing: { code: "PP01-TON-7K", expiresMin: 10 },

  /* One day of stops for P11, built from lib/db/seed/data/places.ts districts. */
  history: {
    distanceKm: 4.2,
    stops: [
      { placeKey: "p10_place_home", place: "Sisattanak · Ban Phonsinuan", arrive: "06:40", minutes: 45 },
      { placeKey: null, place: "Xaysettha · Ban Saphanthong", arrive: "07:25", minutes: 12 },
      { placeKey: "p10_place_school", place: "Xaysettha · Ban Nongbone", arrive: "07:37", minutes: 96 }
    ]
  },

  /* B6.2 permission checklist, as the parent sees it for the child's phone. */
  permissions: { location: true, notifications: true, batteryOptimisationOff: false },

  /* E4 roles. Family 20's pending invite code is the one the seed generates. */
  members: [
    { nameKey: null, latin: "Khamla Vongsavanh", lo: "ຄຳລ້າ ວົງສະຫວັນ", roleKey: "p28_role_owner", canKey: "p28_role_owner_can", pending: false },
    { nameKey: null, latin: "Noy Phommachanh", lo: "ນ້ອຍ ພົມມະຈັນ", roleKey: "p28_role_parent", canKey: "p28_role_parent_can", pending: false },
    { nameKey: null, latin: "Vilay Souksavath", lo: "ວິໄລ ສຸກສະຫວັດ", roleKey: "p28_role_guardian", canKey: "p28_role_guardian_can", pending: true, code: "PP20GUARD" }
  ],

  /* AD3, in full. P09 shows the first three lines of this. */
  emergencyCard: {
    bloodType: "O+",
    allergiesKey: "p09_allergies_value",
    conditionsKey: "p31_conditions_value",
    contacts: [
      { latin: "Noy Phommachanh", lo: "ນ້ອຍ ພົມມະຈັນ", phone: "+856 20 5551 0001", roleKey: "p28_role_parent" },
      { latin: "Vilay Souksavath", lo: "ວິໄລ ສຸກສະຫວັດ", phone: "+856 20 5550 0020", roleKey: "p28_role_guardian" }
    ]
  },

  /* Kids app fixture — child 1 of family 01, as seen from their own phone. */
  kidsSelf: {
    childId: "41ea9442-558a-5455-bb48-5dcbb766a2f6",
    latin: "Ton",
    lo: "ຕົ້ນ",
    battery: 82,
    missionsDone: 2,
    missionsTotal: 3,
    coins: 25,
  },
};
