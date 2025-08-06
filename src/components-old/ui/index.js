/**
 * UI Components - Comprehensive Barrel Export
 * Enterprise-level component organization with multiple import strategies
 *
 * Import strategies:
 * 1. Individual components: import { Button } from "@components/ui"
 * 2. Grouped components: import { FormComponents } from "@components/ui"
 * 3. Domain-specific: import { Button } from "@components/ui/groups/form-components"
 */

// === GROUPED EXPORTS (RECOMMENDED) ===
// Domain-specific component groups for optimal bundle splitting
export * from "./groups";

// === FLAT EXPORTS (LEGACY COMPATIBILITY) ===
// Individual component exports for existing code compatibility

// Core UI Components (shadcn/ui)
export * from "./accordion";
export * from "./alert";
export * from "./alert-dialog";
export * from "./aspect-ratio";
export * from "./avatar";
export * from "./badge";
export * from "./button";
export * from "./calendar";
export * from "./card";
export * from "./carousel";
export * from "./chart";
export * from "./checkbox";
export * from "./collapsible";
export * from "./command";
export * from "./dialog";
export * from "./drawer";
export * from "./dropdown-menu";
export * from "./form";
export * from "./gauge";
export * from "./hover-card";
export * from "./input";
export * from "./input-otp";
export * from "./label";
export * from "./menubar";
export * from "./navigation-menu";
export * from "./pagination";
export * from "./popover";
export * from "./progress";
export * from "./radio-group";
export * from "./resizable";
export * from "./scroll-area";
export * from "./select";
export * from "./separator";
export * from "./sheet";
export * from "./sidebar";
export * from "./skeleton";
export * from "./slider";
export * from "./switch";
export * from "./table";
export * from "./tabs";
export * from "./textarea";
export * from "./toast";
export * from "./toaster";
export * from "./tooltip";
export * from "./use-toast";

// Custom UI Components
export { default as DarkModeToggle } from "./DarkModeToggle";
export { default as LanguageSelector } from "./language-selector";

// === PERFORMANCE OPTIMIZATION ===
/**
 * Bundle Optimization Guide:
 *
 * For optimal bundle size, prefer grouped imports:
 * ✅ import { FormComponents } from "@components/ui"
 * ✅ import { Button, Input } from "@components/ui/groups/form-components"
 *
 * Avoid importing entire UI library unless necessary:
 * ❌ import * as UI from "@components/ui"
 *
 * Use individual imports for single components:
 * ✅ import { Button } from "@components/ui"
 */
