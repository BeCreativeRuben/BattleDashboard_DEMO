# Battlekart Dashboard - DEMO Versie

Dit is een **DEMO versie** van het Battlekart Dashboard met testdata. Deze versie is **NIET verbonden** met echte systemen en kan veilig worden gebruikt voor demonstraties en testen.

## 🔵 DEMO Mode Features

### Wat is anders in DEMO mode?

1. **Mock Firebase Database**
   - Gebruikt een in-memory database in plaats van echte Firebase
   - Alle data wordt alleen lokaal opgeslagen (niet gesynchroniseerd)
   - Testdata is vooraf ingeladen

2. **Demo Links**
   - Alle externe links zijn vervangen door demo links
   - Klikken op links toont een demo melding in plaats van naar externe sites te gaan
   - Geen verbinding met echte Google Sheets, SharePoint, of andere systemen

3. **Testdata**
   - Vooraf gegenereerde testdata voor alle tools
   - Demo gebruikersnamen en timestamps
   - Realistische voorbeelden van logs en checks

4. **DEMO Banner**
   - Duidelijke banner bovenaan de pagina die aangeeft dat dit een demo versie is

## 📊 Testdata Overzicht

### Tools met Testdata
- **Cash & Payments**: Laatste update door "Demo Gebruiker 1" op 15-01-2024 09:30
- **Kart Daily Logboek**: Laatste check door "Demo Gebruiker 2" op 15-01-2024 08:15
- **Daily Report**: Laatste update door "Demo Gebruiker 3" op 14-01-2024 22:00
- **BK Panel**: Laatste klik door "Demo Gebruiker 1" op 15-01-2024 07:45
- **Kuismachine Logs**: 2 demo logs met verschillende scenario's
- **StockcheckBK**: Wekelijkse check door "Demo Gebruiker 1" op 12-01-2024
- **Kart Weekly**: Wekelijkse check door "Demo Gebruiker 3" op 10-01-2024

### Demo Gebruikers
- Demo Gebruiker 1
- Demo Gebruiker 2
- Demo Gebruiker 3

## 🚀 Gebruik

### DEMO Mode Activeren

De DEMO mode is standaard **ACTIEF** in deze versie. Dit wordt gecontroleerd door de `DEMO_MODE` constante in `js/demo-config.js`.

### DEMO Mode Uitschakelen

Om terug te gaan naar de echte versie:

1. Open `js/demo-config.js`
2. Verander `const DEMO_MODE = true;` naar `const DEMO_MODE = false;`
3. Herlaad de pagina

**LET OP**: Als je DEMO mode uitschakelt, moet je ook de Firebase configuratie in `index.html` aanpassen naar je echte Firebase project.

## 📁 Bestandsstructuur

```
BK_Overview_Demo/
├── index.html              # Hoofdpagina (aangepast voor DEMO mode)
├── js/
│   ├── demo-config.js      # DEMO configuratie en testdata
│   ├── dashboard.js        # Dashboard logica (aangepast voor DEMO)
│   ├── logs.js            # Logs pagina
│   └── debug-errors.js   # Error handling
├── css/
│   ├── style.css          # Styling
│   └── logs.css          # Logs pagina styling
└── DEMO_README.md         # Dit bestand
```

## 🔧 Technische Details

### Mock Firebase Database

De mock Firebase database (`MockFirebaseDatabase` class) simuleert Firebase Realtime Database functionaliteit:

- `ref(path)`: Maakt een database referentie
- `get(ref)`: Haalt data op
- `set(ref, value)`: Slaat data op
- `push(ref, value)`: Voegt nieuwe data toe met automatische ID
- `onValue(ref, callback)`: Luistert naar wijzigingen (real-time simulatie)

### Data Structuur

De demo data volgt dezelfde structuur als de echte Firebase database:

```
logs/
  ├── {toolId}/
  │   └── {logId}/
  ├── kuismachine-logs/
  │   └── {logId}/
  └── kart-daily-checks/
      └── {date}/
          └── {checkId}/
feedback/
  └── {feedbackId}/
anonymous-feedback/
  └── {feedbackId}/
```

## ⚠️ Belangrijke Opmerkingen

1. **Geen Echte Data**: Alle data in DEMO mode is testdata en wordt niet opgeslagen in echte systemen
2. **Geen Synchronisatie**: Wijzigingen worden alleen lokaal opgeslagen en verdwijnen bij pagina refresh
3. **Geen Externe Verbindingen**: Geen verbinding met Google Sheets, SharePoint, of andere externe systemen
4. **Veilig voor Testen**: Perfect voor demonstraties, trainingen, en ontwikkeling zonder risico op echte data

## 🎯 Gebruik Cases

Deze DEMO versie is ideaal voor:

- **Demonstraties**: Laat het dashboard zien zonder toegang tot echte systemen
- **Trainingen**: Leer nieuwe gebruikers zonder risico op echte data
- **Ontwikkeling**: Test nieuwe features zonder echte Firebase verbinding
- **Presentaties**: Toon functionaliteit aan stakeholders

## 📝 Licentie

Deze DEMO versie is bedoeld voor intern gebruik en demonstraties.

---

**Gemaakt voor Battlekart Dashboard - DEMO Versie**

