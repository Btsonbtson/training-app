# Training Program App

Treadmill + Chair Tai Chi + Army Chair HIIT · React + Vite

## Εκκίνηση

```bash
# 1. Εγκατάσταση dependencies
npm install

# 2. Development server
npm run dev

# 3. Build για production
npm run build
```

Άνοιξε στο browser: http://localhost:5173

## Project Structure

```
src/
├── data/
│   ├── treadmill.js       ← 35 treadmill workouts (5 φάσεις)
│   ├── bodyweight.js      ← 30 bodyweight sessions (TC + Army)
│   └── illustrations.jsx  ← SVG illustrations για κάθε άσκηση
├── components/
│   └── WorkoutCard.jsx    ← TreadmillCard + BodyweightCard
├── hooks/
│   └── useStorage.js      ← localStorage persistence hook
├── App.jsx                ← Main app, tabs, state
├── index.css              ← CSS variables, dark mode
└── main.jsx               ← Entry point
```

## Επεκτάσεις με το Cursor

### 1. Supabase αντί για localStorage
Άλλαξε το `useStorage.js` να κάνει calls σε Supabase:
```js
import { supabase } from './supabase'
// Αντικατέστησε localStorage.getItem/setItem με supabase queries
```

### 2. HIIT Timer
Πρόσθεσε timer component στο `BodyweightCard`:
```jsx
// 9 λεπτά: 2' warmup → 6' HIIT (work/rest intervals) → 1' cool
```

### 3. Εβδομαδιαίο πλάνο
Πρόσθεσε calendar view που οργανώνει treadmill + bodyweight ανά εβδομάδα.

### 4. Export PDF
Χρησιμοποίησε `react-pdf` ή `jsPDF` για export του ημερολογίου.

### 5. Dark mode toggle
Το CSS υποστηρίζει ήδη dark mode via `prefers-color-scheme`.
Πρόσθεσε manual toggle με `data-theme` attribute.
