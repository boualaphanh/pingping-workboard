# THROWAWAY PROTOTYPE — NO NETWORK CALLS — DO NOT COPY THIS CODE INTO `pingping-mobile`

Only three things leave this folder: the colour tokens, the i18n keys and their strings, and the
traceability table below. The HTML, the CSS and the JavaScript are discarded.

Design: `docs/superpowers/specs/20260921-ui-prototype-design.md`
Benchmark: `20260921 PingPing UI Benchmark — Find My Kids.md`
Live: `https://pingping.unclebuafarm.com/proto/`
Gate: `bash proto/check.sh` — no network calls, no colour literals in a screen, en/lo key parity,
every i18n key resolves, every fixture path a screen names resolves, every script parses.

Screen identifiers are assigned in the design spec §4.1 and follow Feature Spec v0.1 §4 list order.
`P31` and above are screens an add-on or a late scope change needs that Feature Spec §4.1 never listed.

## Decisions that changed this list (2026-09-21)

- **Parent navigation is three tabs: Map · Growth · Family.** The map is the home screen and alerts
  are an icon on it. **P07 Home Dashboard was merged into P10's bottom sheet and deleted** — it
  showed the same children, statuses and battery figures one tap away from the map.
- **A5 Loud Signal moved into MVP-S1.** It answers painpoint P3 directly and rides the same push
  channel as SOS. With no Security Hub tab, its entry points are the map sheet and the child
  profile, and it adds **P34** (parent) and **K09** (child).

## Batch S1 — 18 screens, all built

Legend: `·` not started · `~` built, not yet reviewed in both languages · `✓` passes the §8 gate

| ID | Screen | Features | States | EN | LO | Light | Dark | Status |
|---|---|---|---|---|---|---|---|---|
| P10 | **Live map — Parent home** | A1.1, A1.3, A1.5, A11, A4 banner, A2 places | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P01 | Splash | — | ok | ~ | ~ | ~ | ~ | ~ |
| P02 | Sign in (OTP) | E1 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P04 | Add child | E3 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P05 | Pair device | B5 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P06 | Permissions | A1, A11, A4 | ok · error | ~ | ~ | ~ | ~ | ~ |
| P09 | SOS alert detail | A4.2, A4.4, A11, AD3 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P11 | Location history | A1.4 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P20 | Devices & battery | B6, B6.2, A11 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P27 | Child profile | E3, A5, AD3 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P28 | Family & roles | E4 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P31 | Emergency card | AD3 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| P34 | **Loud signal** | A5.1, A5.2, A5.3 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| K01 | Pairing | B5 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| K02 | Kids home + SOS | B1, A4.1, E7 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| K03 | SOS countdown | A4.2 | ok · error | ~ | ~ | ~ | ~ | ~ |
| K08 | Kids settings | A11, B6, E7 | ok · loading · empty · error | ~ | ~ | ~ | ~ | ~ |
| K09 | **Loud signal, child side** | A5.2, A5.3 | ok · error | ~ | ~ | ~ | ~ | ~ |

All 18 are built and pass the mechanical gate. None has been reviewed on a real phone yet, which
is what `~` means: the human checks — does the flow make sense, does Lao overflow, does it read
right at 200 % text scaling — have not been done.

## Documented state exceptions (design spec §6)

| Screen | States it does not have | Why |
|---|---|---|
| P01 Splash | loading, empty, error | It has no data |
| P06 Permissions | loading, empty | Nothing to load, nothing to be empty |
| K03 SOS countdown | loading, empty | A countdown that showed a skeleton would be a defect |
| K09 Loud signal | loading, empty | A live alarm is either sounding or it is not |

`check.sh` knows these four and fails any other screen that is missing a state.

## What P10 carries, after the benchmark

- Avatar marker per child, with the name and **where they are and for how long** above it
- Battery badge on the marker, red at 20 % or below; silent-mode badge when the phone is muted
- Marker ring coloured by status: safe, stale, offline, SOS. The SOS marker pulses
- Saved-place pins (home, school) and today's route line
- Floating controls: settings, family switcher, alerts, map layers, recentre
- Bottom sheet: the SOS banner, the family list, and quick actions for the child in focus —
  request location, loud signal, history, profile

## Fixture coverage

| Fixture | Used for |
|---|---|
| Family 01 — owner, co-parent, three children | the normal case on P10, P27, P28 |
| — child 1 `Ton` / `ຕົ້ນ` | safe: in a zone, fix 2 min old, battery 82 %, at school 1 h 36 min |
| — child 2 `Nam` / `ນ້ຳ` | stale: fix 24 min old, battery 17 %, phone on silent, and the active SOS |
| — child 3 `Fah` / `ຟ້າ` | offline: phone off, battery 0 % |
| Family 03 first child | two devices (phone + watch) for P20 |
| Family 20 | the empty state on P10 and P27 — a real cause, not a placeholder |
| Families 04/08/12/16/20 | a pending guardian invite, code `PP<NN>GUARD`, for P28 |

Ids come from `pingping-api/lib/db/seed/IDS.md`, copied 2026-09-21. Device ids are prototype-local
and prefixed `proto-dev-` because the seed's device key shape was not verified. Each child also
carries an `avatar` block the prototype draws a face from; a real profile photo replaces it.

## What still has to happen outside this folder

- Amend `20260912 PingPing Feature Spec v0.1.md` §4 to carry these identifiers, to drop P07 as a
  destination, and to add P31, P34 and K09.
- Update `20260917 PingPing Decision Log v0.8.md` §4: A5 Loud Signal is now in MVP-S1.
- `locationLatestView` in the API contract returns no place, no dwell and no silent-mode flag, so
  the map label and the mute badge have nothing to read yet. Add them when A2 lands in S2 —
  benchmark doc F-3.
- D-18 (ARB languages) stays open. This prototype covers English and Lao only.
