# Firebase Setup Instructies

Dit dashboard gebruikt Firebase Realtime Database voor real-time synchronisatie tussen verschillende devices.

## Stap 1: Firebase Project Aanmaken

1. Ga naar [Firebase Console](https://console.firebase.google.com/)
2. Klik op "Add project" of selecteer een bestaand project
3. Volg de wizard om je project aan te maken
4. Noteer de project naam

## Stap 2: Realtime Database Aanmaken

1. In je Firebase project, klik op "Realtime Database" in het linker menu
2. Klik op "Create Database"
3. Kies een locatie (bijv. `europe-west1` voor Nederland)
4. Kies "Start in test mode" (voor nu, we kunnen later security rules toevoegen)
5. Klik "Enable"

## Stap 3: Web App Toevoegen

1. In je Firebase project, klik op het web icoon (`</>`) naast "Project Overview"
2. Geef je app een naam (bijv. "Battlekart Dashboard")
3. Klik "Register app"
4. **Kopieer de Firebase configuratie** die wordt getoond

## Stap 4: Configuratie Toevoegen

1. Open `index.html` in je editor
2. Zoek naar de `firebaseConfig` object (rond regel 10-17)
3. Vervang de placeholder waarden met je eigen Firebase configuratie:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",              // Vervang met jouw apiKey
    authDomain: "YOUR_AUTH_DOMAIN",      // Vervang met jouw authDomain
    databaseURL: "YOUR_DATABASE_URL",     // Vervang met jouw databaseURL
    projectId: "YOUR_PROJECT_ID",        // Vervang met jouw projectId
    storageBucket: "YOUR_STORAGE_BUCKET", // Vervang met jouw storageBucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Vervang met jouw messagingSenderId
    appId: "YOUR_APP_ID"                  // Vervang met jouw appId
};
```

## Stap 5: Database Security Rules (Optioneel maar Aanbevolen)

1. Ga naar "Realtime Database" > "Rules" in Firebase Console
2. Vervang de regels met:

```json
{
  "rules": {
    "clicks": {
      ".read": true,
      ".write": true
    }
  }
}
```

Dit geeft iedereen lees- en schrijftoegang tot de clicks data. Voor productie kun je dit later aanpassen met authenticatie.

## Stap 6: Testen

1. Open je website in twee verschillende browsers/tabs
2. Klik op een link in de eerste browser
3. De tweede browser zou automatisch moeten updaten met de nieuwe klik tijd!

## Troubleshooting

- **Firebase niet geladen**: Check de browser console (F12) voor errors
- **Geen real-time updates**: Zorg dat beide browsers dezelfde Firebase configuratie gebruiken
- **localStorage fallback**: Als Firebase niet werkt, gebruikt de app automatisch localStorage (maar dan geen sync tussen devices)

## Kosten

Firebase Realtime Database heeft een gratis tier:
- 1 GB opslag
- 10 GB downloads per maand
- 100 simultane verbindingen

Voor 2 PC's op het werk is dit ruim voldoende!

## Terugzetten naar Alleen localStorage

Als je Firebase wilt uitschakelen:
1. Verwijder of comment de Firebase SDK script tag in `index.html`
2. De app gebruikt automatisch alleen localStorage

