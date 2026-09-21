// GENERATED from the PingPing UI prototype by proto/export.js — do not hand-edit.
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

  static const ColorScheme parentLight = ColorScheme(
    brightness: Brightness.light,
    primary: Color(0xFF0E5C43),
    onPrimary: Color(0xFFFFFFFF),
    primaryContainer: Color(0xFFA6F2D4),
    onPrimaryContainer: Color(0xFF002017),
    secondary: Color(0xFF4B635A),
    onSecondary: Color(0xFFFFFFFF),
    secondaryContainer: Color(0xFFCDE9DC),
    onSecondaryContainer: Color(0xFF072019),
    tertiary: Color(0xFFB0562F),
    onTertiary: Color(0xFFFFFFFF),
    tertiaryContainer: Color(0xFFFFDBCB),
    onTertiaryContainer: Color(0xFF3A1000),
    surface: Color(0xFFFCF9F5),
    onSurface: Color(0xFF191C1A),
    surfaceContainer: Color(0xFFF0ECE4),
    surfaceContainerHigh: Color(0xFFEAE5DC),
    onSurfaceVariant: Color(0xFF3F4944),
    outline: Color(0xFFC4C8C2),
    outlineVariant: Color(0xFFDDE1DA),
    error: Color(0xFFC2160F),
    onError: Color(0xFFFFFFFF),
    errorContainer: Color(0xFFFFDAD5),
    onErrorContainer: Color(0xFF410002),
  );

  static const ColorScheme parentDark = ColorScheme(
    brightness: Brightness.dark,
    primary: Color(0xFF7BD9B6),
    onPrimary: Color(0xFF00382A),
    primaryContainer: Color(0xFF00513D),
    onPrimaryContainer: Color(0xFF97F6D2),
    secondary: Color(0xFFB1CCC0),
    onSecondary: Color(0xFF1D352D),
    secondaryContainer: Color(0xFF334B43),
    onSecondaryContainer: Color(0xFFCDE9DC),
    tertiary: Color(0xFFFFB595),
    onTertiary: Color(0xFF5C1C00),
    tertiaryContainer: Color(0xFF8A3A16),
    onTertiaryContainer: Color(0xFFFFDBCB),
    surface: Color(0xFF0E1512),
    onSurface: Color(0xFFDEE4DF),
    surfaceContainer: Color(0xFF1A211E),
    surfaceContainerHigh: Color(0xFF242B27),
    onSurfaceVariant: Color(0xFFBEC9C2),
    outline: Color(0xFF88938D),
    outlineVariant: Color(0xFF3F4944),
    error: Color(0xFFFFB4AB),
    onError: Color(0xFF690005),
    errorContainer: Color(0xFF93000A),
    onErrorContainer: Color(0xFFFFDAD6),
  );

  static const ColorScheme kidsLight = ColorScheme(
    brightness: Brightness.light,
    primary: Color(0xFF8FD44A),
    onPrimary: Color(0xFF14290A),
    primaryContainer: Color(0xFFD9F5B4),
    onPrimaryContainer: Color(0xFF1D3808),
    secondary: Color(0xFF59624C),
    onSecondary: Color(0xFFFFFFFF),
    secondaryContainer: Color(0xFFDEE7CB),
    onSecondaryContainer: Color(0xFF171E0D),
    tertiary: Color(0xFF8D6E63),
    onTertiary: Color(0xFFFFFFFF),
    tertiaryContainer: Color(0xFFF3E3DC),
    onTertiaryContainer: Color(0xFF3B2B26),
    surface: Color(0xFFFFFDF6),
    onSurface: Color(0xFF1A1C16),
    surfaceContainer: Color(0xFFF2EFE2),
    surfaceContainerHigh: Color(0xFFECE9DC),
    onSurfaceVariant: Color(0xFF44483D),
    outline: Color(0xFFC6C9BA),
    outlineVariant: Color(0xFFDFE3D2),
    error: Color(0xFFC2160F),
    onError: Color(0xFFFFFFFF),
    errorContainer: Color(0xFFFFDAD5),
    onErrorContainer: Color(0xFF410002),
  );

  static const ColorScheme kidsDark = ColorScheme(
    brightness: Brightness.dark,
    primary: Color(0xFFA8E96A),
    onPrimary: Color(0xFF1A3300),
    primaryContainer: Color(0xFF2F5410),
    onPrimaryContainer: Color(0xFFC4F58A),
    secondary: Color(0xFFC2CBAF),
    onSecondary: Color(0xFF2C3421),
    secondaryContainer: Color(0xFF424B36),
    onSecondaryContainer: Color(0xFFDEE7CB),
    tertiary: Color(0xFFD7BDB3),
    onTertiary: Color(0xFF3B2B26),
    tertiaryContainer: Color(0xFF5A423B),
    onTertiaryContainer: Color(0xFFF3E3DC),
    surface: Color(0xFF12140D),
    onSurface: Color(0xFFE3E4D8),
    surfaceContainer: Color(0xFF1E2118),
    surfaceContainerHigh: Color(0xFF282B21),
    onSurfaceVariant: Color(0xFFC6C9BA),
    outline: Color(0xFF909485),
    outlineVariant: Color(0xFF44483D),
    error: Color(0xFFFFB4AB),
    onError: Color(0xFF690005),
    errorContainer: Color(0xFF93000A),
    onErrorContainer: Color(0xFFFFDAD6),
  );

  static const PpColors parentLightExt = PpColors(
    statusSafe: Color(0xFF1E9E4A),
    onStatusSafe: Color(0xFF00210C),
    statusStale: Color(0xFFB0562F),
    onStatusStale: Color(0xFFFFFFFF),
    statusOffline: Color(0xFF5D5F5B),
    onStatusOffline: Color(0xFFFFFFFF),
    mapTint: Color(0xFFE3EDE7),
    mapZone: Color(0xFFA6F2D4),
  );

  static const PpColors parentDarkExt = PpColors(
    statusSafe: Color(0xFF5FD07E),
    onStatusSafe: Color(0xFF00390F),
    statusStale: Color(0xFFFFB595),
    onStatusStale: Color(0xFF3A1000),
    statusOffline: Color(0xFFA9ACA6),
    onStatusOffline: Color(0xFF1B1C19),
    mapTint: Color(0xFF1B241F),
    mapZone: Color(0xFF00513D),
  );

  static const PpColors kidsLightExt = PpColors(
    statusSafe: Color(0xFF1E7D32),
    onStatusSafe: Color(0xFFFFFFFF),
    statusStale: Color(0xFFB0562F),
    onStatusStale: Color(0xFFFFFFFF),
    statusOffline: Color(0xFF5D5F5B),
    onStatusOffline: Color(0xFFFFFFFF),
    mapTint: Color(0xFFEBF0DF),
    mapZone: Color(0xFFD9F5B4),
  );

  static const PpColors kidsDarkExt = PpColors(
    statusSafe: Color(0xFF8AD99A),
    onStatusSafe: Color(0xFF00390F),
    statusStale: Color(0xFFFFB595),
    onStatusStale: Color(0xFF3A1000),
    statusOffline: Color(0xFFA9ACA6),
    onStatusOffline: Color(0xFF1B1C19),
    mapTint: Color(0xFF22261A),
    mapZone: Color(0xFF2F5410),
  );
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
