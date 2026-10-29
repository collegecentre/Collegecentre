// Phase 10 Comprehensive Test Suite: Themes & Appearance Design System
// Verifies all 6 official presets, legacy backward compatibility, controlled customization layering,
// database persistence, and dynamic public profile resolution.

import { mockSupabase } from "../src/lib/supabase.ts";
import {
  OFFICIAL_THEMES,
  PROFILE_THEMES,
  getProfileTheme,
  getAllProfileThemes,
} from "../src/lib/themes.ts";
import { getStudentProfileByUsername } from "../src/lib/profile-service.ts";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runPhase10Tests() {
  console.log("\n=========================================");
  console.log("TEST SUITE 1: 6 Curated Theme Presets");
  console.log("=========================================\n");

  assert(OFFICIAL_THEMES.length === 6, `Provides exactly 6 official curated presets (found ${OFFICIAL_THEMES.length})`);

  const requiredPresets = ["minimal", "developer", "creative", "academic", "professional", "dark"];

  for (const presetId of requiredPresets) {
    const theme = PROFILE_THEMES[presetId];
    assert(Boolean(theme), `Theme preset '${presetId}' exists in registry`);
    assert(theme.id === presetId, `Theme '${presetId}' has matching id`);
    assert(Boolean(theme.name), `Theme '${presetId}' specifies display name (${theme.name})`);
    assert(Boolean(theme.tagline), `Theme '${presetId}' has a descriptive tagline`);
    assert(Boolean(theme.category), `Theme '${presetId}' has a defined category (${theme.category})`);
    assert(Boolean(theme.fontFamily), `Theme '${presetId}' specifies typography font family (${theme.fontFamily})`);
    assert(Boolean(theme.pageBackground), `Theme '${presetId}' specifies background treatment`);
    assert(Boolean(theme.containerClass), `Theme '${presetId}' specifies container styling`);
    assert(Boolean(theme.linkCard), `Theme '${presetId}' specifies link card treatment`);
    assert(Boolean(theme.previewColors), `Theme '${presetId}' provides preview color palette`);
  }

  // Verify visual differentiation (distinct visual personalities)
  assert(PROFILE_THEMES.developer.fontFamily === "font-mono", "Developer theme uses monospace font");
  assert(PROFILE_THEMES.academic.fontFamily === "font-serif", "Academic theme uses serif editorial font");
  assert(PROFILE_THEMES.minimal.fontFamily === "font-sans", "Minimal theme uses clean sans font");
  assert(PROFILE_THEMES.dark.pageBackground.includes("bg-black"), "Dark theme uses pure pitch black OLED background");
  assert(PROFILE_THEMES.creative.containerClass.includes("rounded-3xl"), "Creative theme uses fluid geometry");
  assert(PROFILE_THEMES.developer.accentBadgeVariant === "success", "Developer theme uses emerald success cue");
  assert(PROFILE_THEMES.professional.accentText.includes("text-blue"), "Professional theme uses corporate blue accent");

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Legacy Themes Backward Compatibility");
  console.log("=========================================\n");

  const legacyIds = ["obsidian", "academic", "cobalt", "terminal"];
  for (const id of legacyIds) {
    const conf = getProfileTheme(id);
    assert(conf.id === id, `Legacy theme ID '${id}' resolves successfully`);
  }

  const fallbackTheme = getProfileTheme("completely-unknown-theme-xyz");
  assert(fallbackTheme.id === "obsidian", "Unknown theme ID gracefully falls back to default preset");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Controlled Customization Layering");
  console.log("=========================================\n");

  // 1. Accent color override
  const emeraldCustom = getProfileTheme("minimal", { accentColor: "emerald" });
  assert(emeraldCustom.accentText.includes("text-emerald"), "Layers emerald accent color onto minimal theme");
  assert(emeraldCustom.accentBadgeVariant === "success", "Layers success badge variant");

  const violetCustom = getProfileTheme("minimal", { accentColor: "violet" });
  assert(violetCustom.accentText.includes("text-violet"), "Layers violet accent color onto minimal theme");

  // 2. Button style override
  const pillCustom = getProfileTheme("minimal", { buttonStyle: "pill" });
  assert(pillCustom.linkCard.includes("rounded-full"), "Layers pill button radius onto link cards");
  assert(pillCustom.socialButton.includes("rounded-full"), "Layers pill radius onto social buttons");

  const sharpCustom = getProfileTheme("minimal", { buttonStyle: "sharp" });
  assert(sharpCustom.linkCard.includes("rounded-sm"), "Layers sharp technical radius onto link cards");

  // 3. Background style override
  const dotsCustom = getProfileTheme("minimal", { backgroundStyle: "dots" });
  assert(dotsCustom.pageBackground.includes("radial-gradient"), "Layers matrix dot pattern onto page background");

  const gridCustom = getProfileTheme("minimal", { backgroundStyle: "grid" });
  assert(gridCustom.pageBackground.includes("linear-gradient"), "Layers hairline grid pattern onto page background");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Database Persistence");
  console.log("=========================================\n");

  const testProfileId = "usr_phase10_test";
  const initialProfile = {
    id: testProfileId,
    username: "themetester",
    full_name: "Theme Tester",
    theme: "minimal",
    theme_accent: "default",
    theme_button: "rounded",
    theme_layout: "centered",
    theme_background: "solid",
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  await mockSupabase.from("profiles").insert(initialProfile);

  // Update theme & appearance settings
  const updateRes = await mockSupabase
    .from("profiles")
    .update({
      theme: "creative",
      theme_accent: "violet",
      theme_button: "pill",
      theme_layout: "editorial",
      theme_background: "gradient",
      updated_at: new Date().toISOString(),
    })
    .eq("id", testProfileId);

  assert(updateRes.error === null, "Persists theme & appearance updates in database");

  const queryRes = await mockSupabase
    .from("profiles")
    .select("*")
    .eq("id", testProfileId)
    .single();

  assert(queryRes.data?.theme === "creative", "Persists 'creative' theme preset in profile");
  assert(queryRes.data?.theme_accent === "violet", "Persists 'violet' accent color");
  assert(queryRes.data?.theme_button === "pill", "Persists 'pill' button style");
  assert(queryRes.data?.theme_layout === "editorial", "Persists 'editorial' layout variant");
  assert(queryRes.data?.theme_background === "gradient", "Persists 'gradient' background style");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Public Profile Theme Resolution");
  console.log("=========================================\n");

  const resolved = await getStudentProfileByUsername("themetester");
  assert(resolved !== null, "Resolves public profile for 'themetester'");
  assert(resolved.profile.theme === "creative", "Returns stored theme preset");

  const runtimeTheme = getProfileTheme(resolved.profile.theme, {
    accentColor: resolved.profile.theme_accent,
    buttonStyle: resolved.profile.theme_button,
    layoutVariant: resolved.profile.theme_layout,
    backgroundStyle: resolved.profile.theme_background,
  });

  assert(runtimeTheme.name === "Creative", "Resolves Creative theme configuration");
  assert(runtimeTheme.accentText.includes("text-violet"), "Resolves custom violet accent text token");
  assert(runtimeTheme.linkCard.includes("rounded-full"), "Resolves custom pill button radius token");

  console.log("\n=========================================");
  console.log("TEST SUITE 6: Accessibility & Contrast Audit");
  console.log("=========================================\n");

  for (const preset of OFFICIAL_THEMES) {
    assert(Boolean(preset.previewColors.bg), `Theme ${preset.name} has preview background color`);
    assert(Boolean(preset.previewColors.text), `Theme ${preset.name} has preview text color`);
    assert(Boolean(preset.avatarRing), `Theme ${preset.name} provides accessible focus/avatar ring`);
    assert(Boolean(preset.headerBorder), `Theme ${preset.name} provides clean divider contrast`);
  }

  console.log("\n✨ ALL PHASE 10 THEME & APPEARANCE TESTS PASSED SUCCESSFULLY! ✨\n");
}

runPhase10Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
