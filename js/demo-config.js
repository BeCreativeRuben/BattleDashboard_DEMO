/**
 * DEMO CONFIGURATIE
 * 
 * Dit bestand bevat alle demo/testdata voor de DEMO versie van het Battlekart Dashboard.
 * Deze versie is NIET verbonden met echte systemen.
 */

// DEMO MODE flag
const DEMO_MODE = true;

// Demo Firebase configuratie (NIET verbonden met echte database)
const DEMO_FIREBASE_CONFIG = {
    apiKey: "DEMO_API_KEY",
    authDomain: "demo-battlekart.firebaseapp.com",
    databaseURL: "https://demo-battlekart-default-rtdb.firebaseio.com",
    projectId: "demo-battlekart",
    storageBucket: "demo-battlekart.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:demo123",
    measurementId: "G-DEMO123"
};

// Mock Google Apps Script URL (retourneert demo data)
const DEMO_APPS_SCRIPT_URL = null; // Wordt niet gebruikt in demo mode

// Demo tool data met testdata
const DEMO_TOOLS_DATA = [
    {
        id: 'cash-payments',
        title: 'Cash & Payments Employees',
        frequency: 'daily',
        lastUpdatedDate: '2024-01-15',
        lastUpdatedTime: '09:30',
        lastUpdatedBy: 'Demo Gebruiker 1',
        link: '#demo-cash-payments'
    },
    {
        id: 'kart-daily-logboek',
        title: 'Kart Daily logboek',
        frequency: 'daily',
        lastUpdatedDate: '2024-01-15',
        lastUpdatedTime: '08:15',
        lastUpdatedBy: 'Demo Gebruiker 2',
        link: '#demo-kart-daily'
    },
    {
        id: 'daily-report',
        title: 'Daily Report',
        frequency: 'daily',
        lastUpdatedDate: '2024-01-14',
        lastUpdatedTime: '22:00',
        lastUpdatedBy: 'Demo Gebruiker 3',
        link: '#demo-daily-report'
    },
    {
        id: 'bk-panel',
        title: 'BK panel',
        frequency: 'daily',
        lastUpdatedDate: '2024-01-15',
        lastUpdatedTime: '07:45',
        lastUpdatedBy: 'Demo Gebruiker 1',
        link: '#demo-bk-panel'
    },
    {
        id: 'kuismachine-logs',
        title: 'Kuismachine logs',
        frequency: 'daily',
        lastUpdatedDate: '2024-01-15',
        lastUpdatedTime: '10:20',
        lastUpdatedBy: 'Demo Gebruiker 2',
        link: '#demo-kuismachine'
    },
    {
        id: 'stockcheck-bk',
        title: 'StockcheckBK',
        frequency: 'weekly',
        lastUpdatedDate: '2024-01-12',
        lastUpdatedTime: '14:30',
        lastUpdatedBy: 'Demo Gebruiker 1',
        link: '#demo-stockcheck'
    },
    {
        id: 'kart-weekly',
        title: 'Kart Weekly',
        frequency: 'weekly',
        lastUpdatedDate: '2024-01-10',
        lastUpdatedTime: '16:00',
        lastUpdatedBy: 'Demo Gebruiker 3',
        link: '#demo-kart-weekly'
    }
];

// Demo click logs (voor Firebase mock)
const DEMO_CLICK_LOGS = {
    'cash-payments': [
        {
            id: 'log1',
            userName: 'Demo Gebruiker 1',
            timestamp: new Date('2024-01-15T09:30:00').getTime(),
            dateTime: '15-01-2024 09:30'
        },
        {
            id: 'log2',
            userName: 'Demo Gebruiker 2',
            timestamp: new Date('2024-01-14T10:15:00').getTime(),
            dateTime: '14-01-2024 10:15'
        }
    ],
    'kart-daily-logboek': [
        {
            id: 'log1',
            userName: 'Demo Gebruiker 2',
            timestamp: new Date('2024-01-15T08:15:00').getTime(),
            dateTime: '15-01-2024 08:15'
        }
    ],
    'daily-report': [
        {
            id: 'log1',
            userName: 'Demo Gebruiker 3',
            timestamp: new Date('2024-01-14T22:00:00').getTime(),
            dateTime: '14-01-2024 22:00'
        }
    ],
    'bk-panel': [
        {
            id: 'log1',
            userName: 'Demo Gebruiker 1',
            timestamp: new Date('2024-01-15T07:45:00').getTime(),
            dateTime: '15-01-2024 07:45'
        }
    ],
    'kuismachine-logs': [
        {
            id: 'log1',
            userName: 'Demo Gebruiker 2',
            timestamp: new Date('2024-01-15T10:20:00').getTime(),
            dateTime: '15-01-2024 10:20'
        }
    ],
    'stockcheck-bk': [
        {
            id: 'log1',
            userName: 'Demo Gebruiker 1',
            timestamp: new Date('2024-01-12T14:30:00').getTime(),
            dateTime: '12-01-2024 14:30'
        }
    ],
    'kart-weekly': [
        {
            id: 'log1',
            userName: 'Demo Gebruiker 3',
            timestamp: new Date('2024-01-10T16:00:00').getTime(),
            dateTime: '10-01-2024 16:00'
        }
    ]
};

// Demo kuismachine logs
const DEMO_KUISMACHINE_LOGS = [
    {
        id: 'log1',
        userName: 'Demo Gebruiker 2',
        timestamp: new Date('2024-01-15T10:20:00').getTime(),
        dateTime: '15-01-2024 10:20',
        kuismachineGebruikt: true,
        kuismachinePisteA: true,
        kuismachinePisteB: true,
        kuismachineUitgekuist: true,
        kuismachineBegintijd: '210,3',
        kuismachineEindtijd: '210,8',
        kuismachineReden: '',
        stofzuigerGebruikt: true,
        stofzuigerPisteA: true,
        stofzuigerPisteB: false,
        stofzuigerUitgekuist: true,
        stofzuigerBegintijd: '42,2',
        stofzuigerEindtijd: '42,5',
        stofzuigerReden: ''
    },
    {
        id: 'log2',
        userName: 'Demo Gebruiker 1',
        timestamp: new Date('2024-01-14T09:15:00').getTime(),
        dateTime: '14-01-2024 09:15',
        kuismachineGebruikt: true,
        kuismachinePisteA: true,
        kuismachinePisteB: false,
        kuismachineUitgekuist: false,
        kuismachineBegintijd: '209,5',
        kuismachineEindtijd: '209,9',
        kuismachineReden: 'Geen tijd gehad om uit te kuisen',
        stofzuigerGebruikt: false,
        stofzuigerPisteA: false,
        stofzuigerPisteB: false,
        stofzuigerUitgekuist: false,
        stofzuigerBegintijd: '',
        stofzuigerEindtijd: '',
        stofzuigerReden: ''
    }
];

// Demo kart daily checks
const DEMO_KART_DAILY_CHECKS = {
    '2024-01-15': {
        'check1': {
            userName: 'Demo Gebruiker 2',
            timestamp: new Date('2024-01-15T08:15:00').getTime(),
            dateTime: '15-01-2024 08:15',
            karts: {
                '1': { hasProblem: false, reason: '', comments: '' },
                '2': { hasProblem: true, reason: 'Rem werkt niet goed', comments: 'Rempedaal voelt zacht aan' },
                '3': { hasProblem: false, reason: '', comments: '' },
                '4': { hasProblem: true, reason: 'Batterij laadt niet op', comments: '' },
                '5': { hasProblem: false, reason: '', comments: '' }
            },
            allKartsCleaned: true,
            generalComments: 'Alle karts zijn gecheckt en gekuist'
        }
    },
    '2024-01-14': {
        'check1': {
            userName: 'Demo Gebruiker 1',
            timestamp: new Date('2024-01-14T07:30:00').getTime(),
            dateTime: '14-01-2024 07:30',
            karts: {
                '1': { hasProblem: false, reason: '', comments: '' },
                '2': { hasProblem: false, reason: '', comments: '' },
                '3': { hasProblem: true, reason: 'Band lekt', comments: 'Kleine lekkage bij achterwiel' },
                '4': { hasProblem: false, reason: '', comments: '' },
                '5': { hasProblem: false, reason: '', comments: '' }
            },
            allKartsCleaned: true,
            generalComments: ''
        }
    }
};

// Demo feedback
const DEMO_FEEDBACK = [
    {
        id: 'feedback1',
        userName: 'Demo Gebruiker 1',
        timestamp: new Date('2024-01-14T15:30:00').getTime(),
        dateTime: '14-01-2024 15:30',
        type: 'feature',
        title: 'Nieuwe functie voorbeeld',
        description: 'Dit is een voorbeeld van feedback in de demo versie.',
        email: 'demo@example.com'
    },
    {
        id: 'feedback2',
        userName: 'Demo Gebruiker 2',
        timestamp: new Date('2024-01-13T11:20:00').getTime(),
        dateTime: '13-01-2024 11:20',
        type: 'bug',
        title: 'Bug voorbeeld',
        description: 'Dit is een voorbeeld van een bug melding.',
        email: ''
    }
];

// Demo anoniem feedback
const DEMO_ANONYMOUS_FEEDBACK = {
    'anon1': {
        number: 1,
        text: 'Dit is anoniem feedback voorbeeld #1'
    },
    'anon2': {
        number: 2,
        text: 'Dit is anoniem feedback voorbeeld #2'
    }
};

// Mock Firebase Database (in-memory)
class MockFirebaseDatabase {
    constructor() {
        this.data = {
            logs: {},
            'logs/kuismachine-logs': {},
            'logs/kart-daily-checks': {},
            feedback: {},
            'anonymous-feedback': {}
        };
        
        // Initialiseer met demo data
        this.initializeDemoData();
        
        this.listeners = {};
    }
    
    initializeDemoData() {
        // Click logs
        Object.keys(DEMO_CLICK_LOGS).forEach(toolId => {
            this.data[`logs/${toolId}`] = {};
            DEMO_CLICK_LOGS[toolId].forEach(log => {
                this.data[`logs/${toolId}`][log.id] = log;
            });
        });
        
        // Kuismachine logs
        DEMO_KUISMACHINE_LOGS.forEach(log => {
            this.data['logs/kuismachine-logs'][log.id] = log;
        });
        
        // Kart daily checks
        Object.keys(DEMO_KART_DAILY_CHECKS).forEach(date => {
            this.data['logs/kart-daily-checks'][date] = DEMO_KART_DAILY_CHECKS[date];
        });
        
        // Feedback
        DEMO_FEEDBACK.forEach(feedback => {
            this.data['feedback'][feedback.id] = feedback;
        });
        
        // Anoniem feedback
        Object.keys(DEMO_ANONYMOUS_FEEDBACK).forEach(id => {
            this.data['anonymous-feedback'][id] = DEMO_ANONYMOUS_FEEDBACK[id];
        });
    }
    
    ref(path) {
        return {
            path: path,
            database: this
        };
    }
    
    get(ref) {
        return Promise.resolve({
            exists: () => {
                const data = this.getDataAtPath(ref.path);
                return data !== null && data !== undefined;
            },
            val: () => {
                return this.getDataAtPath(ref.path);
            }
        });
    }
    
    set(ref, value) {
        this.setDataAtPath(ref.path, value);
        this.triggerListeners(ref.path);
        return Promise.resolve();
    }
    
    push(ref, value) {
        const newId = 'demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const newPath = ref.path + '/' + newId;
        this.setDataAtPath(newPath, value);
        this.triggerListeners(ref.path);
        return Promise.resolve({
            key: newId
        });
    }
    
    onValue(ref, callback) {
        if (!this.listeners[ref.path]) {
            this.listeners[ref.path] = [];
        }
        this.listeners[ref.path].push(callback);
        
        // Trigger immediately with current value
        const currentValue = this.getDataAtPath(ref.path);
        callback({
            exists: () => currentValue !== null && currentValue !== undefined,
            val: () => currentValue
        });
    }
    
    getDataAtPath(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.data;
        
        for (const part of parts) {
            if (current[part] === undefined) {
                return null;
            }
            current = current[part];
        }
        
        // Als het een object is met alleen null waarden, return null
        if (current && typeof current === 'object' && !Array.isArray(current)) {
            const hasData = Object.values(current).some(v => v !== null && v !== undefined);
            if (!hasData) {
                return null;
            }
        }
        
        return current;
    }
    
    setDataAtPath(path, value) {
        const parts = path.split('/').filter(p => p);
        let current = this.data;
        
        // Navigeer naar de juiste locatie, maak objecten aan waar nodig
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part] || typeof current[part] !== 'object') {
                current[part] = {};
            }
            current = current[part];
        }
        
        // Zet de waarde
        const lastPart = parts[parts.length - 1];
        if (value === null) {
            // Verwijder de waarde
            delete current[lastPart];
        } else {
            current[lastPart] = value;
        }
    }
    
    triggerListeners(path) {
        if (this.listeners[path]) {
            const value = this.getDataAtPath(path);
            this.listeners[path].forEach(callback => {
                callback({
                    exists: () => value !== null && value !== undefined,
                    val: () => value
                });
            });
        }
    }
}

// Maak mock Firebase beschikbaar
window.mockFirebaseDatabase = new MockFirebaseDatabase();

