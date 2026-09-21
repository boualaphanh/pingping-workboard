#!/usr/bin/env node
/* Turns the prototype into the three things that migrate into pingping-mobile:
     export/pp_colors.dart      ColorScheme pairs + the PpColors theme extension
     export/app_en.arb          English strings, with placeholders declared
     export/app_lo.arb          Lao strings, same keys
     export/screen-manifest.json  screen -> features, states, strings, fixture paths
   Everything else in proto/ is discarded (design spec §9).

   Run:  node proto/export.js        (from the workboard repo root, or from proto/)
*/
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = fs.existsSync("fixtures/seed.js") ? "." : "proto";
const OUT = path.join(ROOT, "export");
fs.mkdirSync(OUT, { recursive: true });

/* ---------- load the prototype's own data, the same way a browser does ---- */
global.window = {};
new Function(fs.readFileSync(path.join(ROOT, "i18n/en.js"), "utf8"))();
new Function(fs.readFileSync(path.join(ROOT, "i18n/lo.js"), "utf8"))();
new Function(fs.readFileSync(path.join(ROOT, "fixtures/seed.js"), "utf8"))();
const EN = global.window.PP_I18N.en;
const LO = global.window.PP_I18N.lo;

/* ---------- 1. colours ---------------------------------------------------- */
function readTokens(file, selector) {
  const css = fs.readFileSync(path.join(ROOT, "tokens", file), "utf8");
  const block = css.split(selector)[1];
  if (!block) throw new Error("selector not found: " + selector + " in " + file);
  const body = block.slice(0, block.indexOf("}"));
  const out = {};
  for (const m of body.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)) out[m[1]] = m[2];
  return out;
}

const THEMES = {
  parentLight: readTokens("parent.css", '[data-app="parent"] {'),
  parentDark: readTokens("parent.css", '[data-app="parent"][data-theme="dark"] {'),
  kidsLight: readTokens("kids.css", '[data-app="kids"] {'),
  kidsDark: readTokens("kids.css", '[data-app="kids"][data-theme="dark"] {'),
};

// --md-sys-color-on-surface-variant -> onSurfaceVariant
const camel = (s) =>
  s.replace(/^md-sys-color-/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const SCHEME_KEYS = [
  "primary", "on-primary", "primary-container", "on-primary-container",
  "secondary", "on-secondary", "secondary-container", "on-secondary-container",
  "tertiary", "on-tertiary", "tertiary-container", "on-tertiary-container",
  "surface", "on-surface", "surface-container", "surface-container-high", "on-surface-variant",
  "outline", "outline-variant",
  "error", "on-error", "error-container", "on-error-container",
].map((k) => "md-sys-color-" + k);

const EXT_KEYS = [
  "pp-status-safe", "pp-on-status-safe",
  "pp-status-stale", "pp-on-status-stale",
  "pp-status-offline", "pp-on-status-offline",
  "pp-map-tint", "pp-map-zone",
];

const hex = (v) => "0xFF" + v.slice(1).toUpperCase();

function schemeDart(name, tokens, brightness) {
  const lines = SCHEME_KEYS.filter((k) => tokens[k]).map(
    (k) => `    ${camel(k)}: Color(${hex(tokens[k])}),`
  );
  return `static const ColorScheme ${name} = ColorScheme(\n    brightness: Brightness.${brightness},\n${lines.join("\n")}\n  );`;
}

function extDart(name, tokens) {
  const lines = EXT_KEYS.filter((k) => tokens[k]).map(
    (k) => `    ${k.replace(/^pp-/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase())}: Color(${hex(tokens[k])}),`
  );
  return `static const PpColors ${name} = PpColors(\n${lines.join("\n")}\n  );`;
}

const dart = `// GENERATED from the PingPing UI prototype by proto/export.js — do not hand-edit.
// Source of truth for the values: docs/superpowers/specs/20260921-ui-prototype-design.md §3.
//
// Seeds: parent #0E5C43, kids #8FD44A. The schemes below are the exact values the prototype
// was reviewed against, so they are written out rather than regenerated from the seed — a
// ColorScheme.fromSeed call would drift the moment Flutter changes its tone mapping.
//
// Contrast, computed at design time (WCAG AA needs 4.5):
//   parent primary / onPrimary      7.98
//   parent statusSafe / onStatusSafe 4.94
//   kids   primary / onPrimary      8.65   <- dark text on the lime, white fails at 3.52
//   kids   statusSafe / onStatusSafe 5.20

import 'package:flutter/material.dart';

/// What Material 3 has no slot for (Mobile Handbook §7.2): live status colours and the
/// map tints. Two instantiations, one key set — never a second design system.
@immutable
class PpColors extends ThemeExtension<PpColors> {
  const PpColors({
    required this.statusSafe,
    required this.onStatusSafe,
    required this.statusStale,
    required this.onStatusStale,
    required this.statusOffline,
    required this.onStatusOffline,
    required this.mapTint,
    required this.mapZone,
  });

  /// In a safe zone, location fresh.
  final Color statusSafe;
  final Color onStatusSafe;

  /// Last seen more than 10 minutes ago.
  final Color statusStale;
  final Color onStatusStale;

  /// Device off, or location permission revoked — deliberately distinct from stale
  /// (Feature Breakdown A1: a parent must be able to tell those two apart).
  final Color statusOffline;
  final Color onStatusOffline;

  final Color mapTint;
  final Color mapZone;

  @override
  PpColors copyWith({
    Color? statusSafe,
    Color? onStatusSafe,
    Color? statusStale,
    Color? onStatusStale,
    Color? statusOffline,
    Color? onStatusOffline,
    Color? mapTint,
    Color? mapZone,
  }) {
    return PpColors(
      statusSafe: statusSafe ?? this.statusSafe,
      onStatusSafe: onStatusSafe ?? this.onStatusSafe,
      statusStale: statusStale ?? this.statusStale,
      onStatusStale: onStatusStale ?? this.onStatusStale,
      statusOffline: statusOffline ?? this.statusOffline,
      onStatusOffline: onStatusOffline ?? this.onStatusOffline,
      mapTint: mapTint ?? this.mapTint,
      mapZone: mapZone ?? this.mapZone,
    );
  }

  @override
  PpColors lerp(covariant PpColors? other, double t) {
    if (other == null) return this;
    return PpColors(
      statusSafe: Color.lerp(statusSafe, other.statusSafe, t)!,
      onStatusSafe: Color.lerp(onStatusSafe, other.onStatusSafe, t)!,
      statusStale: Color.lerp(statusStale, other.statusStale, t)!,
      onStatusStale: Color.lerp(onStatusStale, other.onStatusStale, t)!,
      statusOffline: Color.lerp(statusOffline, other.statusOffline, t)!,
      onStatusOffline: Color.lerp(onStatusOffline, other.onStatusOffline, t)!,
      mapTint: Color.lerp(mapTint, other.mapTint, t)!,
      mapZone: Color.lerp(mapZone, other.mapZone, t)!,
    );
  }
}

class PpSchemes {
  PpSchemes._();

  ${schemeDart("parentLight", THEMES.parentLight, "light")}

  ${schemeDart("parentDark", THEMES.parentDark, "dark")}

  ${schemeDart("kidsLight", THEMES.kidsLight, "light")}

  ${schemeDart("kidsDark", THEMES.kidsDark, "dark")}

  ${extDart("parentLightExt", THEMES.parentLight)}

  ${extDart("parentDarkExt", THEMES.parentDark)}

  ${extDart("kidsLightExt", THEMES.kidsLight)}

  ${extDart("kidsDarkExt", THEMES.kidsDark)}
}

/// Spacing, radius, type and motion the prototype was drawn on (design spec §3.4).
/// Lao and Thai clip their diacritics below a 1.5 line height — Mobile Handbook §7.4.
class PpSpace {
  PpSpace._();
  static const double s1 = 4;
  static const double s2 = 8;
  static const double s3 = 12;
  static const double s4 = 16;
  static const double s5 = 24;
  static const double s6 = 32;

  static const double radiusChip = 10;
  static const double radiusCard = 16;
  static const double radiusSheet = 28;

  static const double touchTarget = 48;
  static const double lineHeight = 1.5;
  static const double lineHeightTight = 1.35;

  static const Duration motion = Duration(milliseconds: 240);
  static const Curve motionCurve = Cubic(0.2, 0, 0, 1);
}
`;
fs.writeFileSync(path.join(OUT, "pp_colors.dart"), dart);

/* ---------- 2. ARB -------------------------------------------------------- */
const INT_ARGS = new Set(["n", "h", "m", "done", "total"]);

function arb(locale, dict) {
  const out = { "@@locale": locale };
  for (const [key, value] of Object.entries(dict)) {
    out[key] = value;
    const args = [...new Set([...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))];
    if (args.length) {
      out["@" + key] = {
        placeholders: Object.fromEntries(
          args.map((a) => [a, { type: INT_ARGS.has(a) ? "int" : "String" }])
        ),
      };
    }
  }
  return JSON.stringify(out, null, 2) + "\n";
}
fs.writeFileSync(path.join(OUT, "app_en.arb"), arb("en", EN));
fs.writeFileSync(path.join(OUT, "app_lo.arb"), arb("lo", LO));

/* ---------- 3. screen manifest ------------------------------------------- */
const FEATURES = /Features:\s*([^\n]*(?:\n\s{15,}[^\n]*)*)/;
const screens = [];
for (const file of fs.readdirSync(path.join(ROOT, "screens")).sort()) {
  if (!file.endsWith(".html")) continue;
  const id = file.replace(/\.html$/, "");
  const src = fs.readFileSync(path.join(ROOT, "screens", file), "utf8");
  const head = src.slice(0, src.indexOf("-->"));
  const feat = head.match(FEATURES);
  const strings = new Set([
    ...[...src.matchAll(/data-i18n="(\w+)"/g)].map((m) => m[1]),
    ...[...src.matchAll(/PP\.t\(\s*"(\w+)"/g)].map((m) => m[1]),
  ]);
  for (const m of src.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const pair of m[1].split(",")) strings.add(pair.split(":")[1].trim());
  }
  const fixtures = new Set([
    ...[...src.matchAll(/data-(?:val|avatar|nm|nm-initial)="([\w.]+)"/g)].map((m) => m[1]),
  ]);
  screens.push({
    id,
    app: /data-app="kids"/.test(src) ? "kids" : "parent",
    title: (src.match(/<title>([^<]+)<\/title>/) || [, id])[1],
    features: feat ? feat[1].replace(/\s+/g, " ").trim() : "",
    states: [...new Set([...src.matchAll(/data-state-view="(\w+)"/g)].map((m) => m[1]))],
    strings: [...strings].sort(),
    fixturePaths: [...fixtures].sort(),
  });
}

const manifest = {
  generated: new Date().toISOString().slice(0, 10),
  source: "workboard/proto",
  spec: "docs/superpowers/specs/20260921-ui-prototype-design.md",
  benchmark: "20260921 PingPing UI Benchmark — Find My Kids.md",
  navigation: {
    parent: ["map", "growth", "family"],
    note: "PR-7: the map is the Parent home screen; alerts are an icon on it, not a tab.",
  },
  screens,
};
fs.writeFileSync(path.join(OUT, "screen-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log("export/pp_colors.dart       %d bytes", dart.length);
console.log("export/app_en.arb           %d keys", Object.keys(EN).length);
console.log("export/app_lo.arb           %d keys", Object.keys(LO).length);
console.log("export/screen-manifest.json %d screens", screens.length);
