# Google Flow Prompt Guide — Minute Mysteries: Episode 084
## Topic: How Does Tesla's Roadster Hang Upside Down?

Use these carefully engineered prompts inside **Google Flow** (or Imagen/Midjourney) to generate photorealistic or high-concept visual b-roll assets to complement the vector infographic cards.

---

### Asset 1: The Inverted Ceiling Track Stunt (Hero Visual)
* **Target Scene:** Scene 1 (The Hook) & Scene 7 (Verdict)
* **Aspect Ratio:** 9:16 vertical
* **Style:** Editorial documentary photography, high contrast lighting, clean industrial aesthetics
* **Google Flow Prompt:**
  > A sleek matte white next-generation Tesla Roadster driving upside down, hanging suspended from the concrete ceiling of an aerospace testing hangar. Glowing aerodynamic ground-effect skirts along the underside emitting low blue-white pressure plumes. Dramatic cinematic rim lighting, high-shutter freeze frame, industrial test facility with yellow caution floor markings, ultra-sharp 8k resolution, photorealistic, documentary automotive journalism style.

---

### Asset 2: Active Underbody Vacuum Turbine Close-Up
* **Target Scene:** Scene 3 (Suction Skirt) & Scene 4 (Twin Turbines)
* **Aspect Ratio:** 1:1 or 9:16
* **Style:** High-speed macro engineering photography
* **Google Flow Prompt:**
  > Cutaway engineering close-up of a carbon-fiber automotive underbody suction turbine fan spinning at ultra-high speed (25,000 RPM). Visible vortex air spirals being sucked into the turbine intake, flexible silicone-composite skirts sealing against a textured concrete road surface. Detailed titanium fan blades, technical blueprint line annotations, crisp studio lighting on graphite textures, macro lens depth of field.

---

### Asset 3: SpaceX Cold-Gas Thruster Pulse in Action
* **Target Scene:** Scene 5 (SpaceX Cold-Gas Thrusters)
* **Aspect Ratio:** 9:16
* **Style:** High-speed aerospace test footage
* **Google Flow Prompt:**
  > High-speed telephoto capture of a composite overwrapped pressure vessel (COPV) rocket thruster nozzle firing a violent supersonic plume of cold nitrogen gas from the rear bumper of a modern electric hypercar. Condensed white vapor shock diamonds, intense kinetic energy, sharp motion blur on background while thruster hardware remains pin-sharp, raw industrial testing facility background.

---

### Asset 4: Tunnel Ceiling Stunt (Cinematic Wide Angle)
* **Target Scene:** Scene 6 (The Reality Check)
* **Aspect Ratio:** 9:16 vertical
* **Style:** Cinematic film still
* **Google Flow Prompt:**
  > A modern futuristic vehicle driving along the curved upper ceiling of an illuminated arched tunnel at night. Striking red taillight streaks reflecting off the smooth polished tile tunnel ceiling. Subtle tire smoke, extreme vertical perspective looking up from the ground roadway below, moody cyberpunk atmosphere, photorealistic 35mm lens.

---

## How to integrate generated assets into Remotion:
1. Save generated image(s) or video clips to `public/flow-assets/` (e.g., `public/flow-assets/inverted_hero.png`).
2. In any scene file, import `{ Img, staticFile }` from `"remotion"`.
3. Drop in the image with ink border styling:
```tsx
<Img
  src={staticFile("flow-assets/inverted_hero.png")}
  style={{
    width: 860,
    borderRadius: 12,
    border: "3.5px solid #111111",
    boxShadow: "8px 8px 0px #111111",
  }}
/>
```
