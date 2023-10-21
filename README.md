# Mart

a thing that installs [skyclient](https://skyclient.co/)
see the latest release for info on how to run it

## development

- Online dev:
  `npm run online-dev`
- Online build:
  `npm run online-build`
- App dev:
  Terminal 1: `npm run build --mode neutralino; npm run dev`
  Terminal 2: `npm run start`

## colors

```css
@media (prefers-color-scheme: light) {
  :root,
  ::backdrop {
    --m3-scheme-primary: 137 55 0;
    --m3-scheme-on-primary: 255 255 255;
    --m3-scheme-primary-container: 195 81 0;
    --m3-scheme-on-primary-container: 255 255 255;
    --m3-scheme-inverse-primary: 255 182 147;
    --m3-scheme-secondary: 145 75 38;
    --m3-scheme-on-secondary: 255 255 255;
    --m3-scheme-secondary-container: 255 174 135;
    --m3-scheme-on-secondary-container: 89 33 0;
    --m3-scheme-tertiary: 102 96 0;
    --m3-scheme-on-tertiary: 255 255 255;
    --m3-scheme-tertiary-container: 183 174 46;
    --m3-scheme-on-tertiary-container: 36 33 0;
    --m3-scheme-error: 186 26 26;
    --m3-scheme-on-error: 255 255 255;
    --m3-scheme-error-container: 255 218 214;
    --m3-scheme-on-error-container: 65 0 2;
    --m3-scheme-background: 255 248 246;
    --m3-scheme-on-background: 37 25 19;
    --m3-scheme-surface: 255 248 246;
    --m3-scheme-on-surface: 37 25 19;
    --m3-scheme-surface-variant: 254 219 204;
    --m3-scheme-on-surface-variant: 89 66 55;
    --m3-scheme-inverse-surface: 60 45 38;
    --m3-scheme-inverse-on-surface: 255 237 230;
    --m3-scheme-outline: 141 113 101;
    --m3-scheme-outline-variant: 225 192 177;
    --m3-scheme-shadow: 0 0 0;
    --m3-scheme-scrim: 0 0 0;
    --m3-scheme-surface-dim: 238 213 203;
    --m3-scheme-surface-bright: 255 248 246;
    --m3-scheme-surface-container-lowest: 255 255 255;
    --m3-scheme-surface-container-low: 255 241 235;
    --m3-scheme-surface-container: 255 234 225;
    --m3-scheme-surface-container-high: 252 227 217;
    --m3-scheme-surface-container-highest: 246 221 211;
    --m3-scheme-surface-tint: 160 65 0;
  }
}
@media (prefers-color-scheme: dark) {
  :root,
  ::backdrop {
    --m3-scheme-primary: 255 182 147;
    --m3-scheme-on-primary: 86 32 0;
    --m3-scheme-primary-container: 195 81 0;
    --m3-scheme-on-primary-container: 255 255 255;
    --m3-scheme-inverse-primary: 160 65 0;
    --m3-scheme-secondary: 255 182 147;
    --m3-scheme-on-secondary: 86 32 0;
    --m3-scheme-secondary-container: 106 46 10;
    --m3-scheme-on-secondary-container: 255 201 177;
    --m3-scheme-tertiary: 226 216 85;
    --m3-scheme-on-tertiary: 53 49 0;
    --m3-scheme-tertiary-container: 183 174 46;
    --m3-scheme-on-tertiary-container: 36 33 0;
    --m3-scheme-error: 255 180 171;
    --m3-scheme-on-error: 105 0 5;
    --m3-scheme-error-container: 147 0 10;
    --m3-scheme-on-error-container: 255 218 214;
    --m3-scheme-background: 28 17 11;
    --m3-scheme-on-background: 246 221 211;
    --m3-scheme-surface: 28 17 11;
    --m3-scheme-on-surface: 246 221 211;
    --m3-scheme-surface-variant: 89 66 55;
    --m3-scheme-on-surface-variant: 225 192 177;
    --m3-scheme-inverse-surface: 246 221 211;
    --m3-scheme-inverse-on-surface: 60 45 38;
    --m3-scheme-outline: 168 138 125;
    --m3-scheme-outline-variant: 89 66 55;
    --m3-scheme-shadow: 0 0 0;
    --m3-scheme-scrim: 0 0 0;
    --m3-scheme-surface-dim: 28 17 11;
    --m3-scheme-surface-bright: 69 54 47;
    --m3-scheme-surface-container-lowest: 23 11 6;
    --m3-scheme-surface-container-low: 37 25 19;
    --m3-scheme-surface-container: 42 29 22;
    --m3-scheme-surface-container-high: 53 39 32;
    --m3-scheme-surface-container-highest: 65 49 43;
    --m3-scheme-surface-tint: 255 182 147;
  }
}
```
