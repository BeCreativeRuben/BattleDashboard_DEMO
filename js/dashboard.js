// Google Apps Script Web App URL - Deze moet worden aangepast na deployment
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyIVQeJVMrlLOYQV2-JL3bLwScmG7PUlZfN6qOjuBhc8YZ9WQrF75FmlO5-_zWW43Oh/exec';

// Laad dashboard bij pagina load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

/**
 * Laad dashboard data van Google Apps Script of localStorage
 */
async function loadDashboard() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const dashboardEl = document.getElementById('dashboard');
    
    // Toon loading state
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    dashboardEl.style.display = 'none';

    try {
        let tools = [];

        // Probeer eerst data op te halen van Google Apps Script
        if (APPS_SCRIPT_URL && APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
            try {
                const response = await fetch(APPS_SCRIPT_URL);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.success && data.tools) {
                    tools = data.tools;
                    // Sla data op in localStorage als backup
                    localStorage.setItem('dashboardData', JSON.stringify(tools));
                    localStorage.setItem('dashboardDataTimestamp', Date.now().toString());
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (fetchError) {
                console.warn('Failed to fetch from Apps Script, trying localStorage:', fetchError);
                // Fallback naar localStorage
                tools = loadFromLocalStorage();
            }
        } else {
            // Geen URL geconfigureerd, gebruik demo data
            tools = getDefaultTools();
            // Sla demo data op in localStorage voor consistentie
            localStorage.setItem('dashboardData', JSON.stringify(tools));
            localStorage.setItem('dashboardDataTimestamp', Date.now().toString());
        }

        // Toon dashboard
        displayTools(tools);
        loadingEl.style.display = 'none';
        dashboardEl.style.display = 'block';

    } catch (error) {
        console.error('Error loading dashboard:', error);
        
        // Probeer localStorage als laatste redmiddel
        const tools = loadFromLocalStorage();
        
        if (tools.length > 0) {
            displayTools(tools);
            loadingEl.style.display = 'none';
            dashboardEl.style.display = 'block';
        } else {
            // Geen data beschikbaar
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
        }
    }
}

/**
 * Laad data uit localStorage
 */
function loadFromLocalStorage() {
    try {
        const storedData = localStorage.getItem('dashboardData');
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    
    // Return default/empty tools als fallback
    return getDefaultTools();
}

/**
 * Toon tools in het dashboard
 */
function displayTools(tools) {
    const container = document.getElementById('tools-container');
    container.innerHTML = '';

    if (tools.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: white; padding: 40px;">Geen tools beschikbaar.</p>';
        return;
    }

    tools.forEach(tool => {
        const toolCard = createToolCard(tool);
        container.appendChild(toolCard);
    });
}

/**
 * Controleer of een tool actie vereist vandaag
 */
function needsActionToday(tool) {
    if (!tool.lastUpdatedDate || tool.lastUpdatedDate === '') {
        return true; // Nooit ingevuld
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastUpdate = new Date(tool.lastUpdatedDate);
    lastUpdate.setHours(0, 0, 0, 0);

    if (tool.frequency === 'Dagelijks') {
        // Voor dagelijkse taken: moet vandaag zijn
        return lastUpdate.getTime() < today.getTime();
    } else if (tool.frequency === 'Wekelijks') {
        // Voor wekelijkse taken: moet binnen de laatste 7 dagen zijn
        const daysDiff = Math.floor((today - lastUpdate) / (1000 * 60 * 60 * 24));
        return daysDiff >= 7;
    }

    return false;
}

/**
 * Maak een tool card element
 */
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    
    const needsAction = tool.needsAction !== undefined ? tool.needsAction : needsActionToday(tool);
    if (needsAction) {
        card.classList.add('needs-action');
    } else {
        card.classList.add('completed');
    }

    const hasLastUpdate = tool.lastUpdatedDate && tool.lastUpdatedDate !== '';
    const lastUpdateDate = hasLastUpdate ? formatDate(tool.lastUpdatedDate) : 'Nog niet ingevuld';
    const lastUpdateTime = hasLastUpdate && tool.lastUpdatedTime ? tool.lastUpdatedTime : '';
    const lastUpdatedBy = tool.lastUpdatedBy && tool.lastUpdatedBy !== '' ? tool.lastUpdatedBy : 'N/A';

    const statusBadge = needsAction 
        ? '<span class="status-badge status-pending">⚠️ Actie vereist</span>'
        : '<span class="status-badge status-completed">✓ Voltooid</span>';

    card.innerHTML = `
        <div class="tool-header">
            <div>
                <div class="tool-title">${escapeHtml(tool.title)}</div>
            </div>
            <span class="tool-frequency">${escapeHtml(tool.frequency)}</span>
        </div>
        ${statusBadge}
        <div class="tool-info">
            <div class="info-item">
                <span class="info-label">Laatste invuldatum:</span>
                <span class="info-value ${!hasLastUpdate ? 'empty' : ''}">${escapeHtml(lastUpdateDate)}</span>
            </div>
            ${lastUpdateTime ? `
            <div class="info-item">
                <span class="info-label">Tijd:</span>
                <span class="info-value">${escapeHtml(lastUpdateTime)}</span>
            </div>
            ` : ''}
            <div class="info-item">
                <span class="info-label">Door:</span>
                <span class="info-value ${!tool.lastUpdatedBy || tool.lastUpdatedBy === '' ? 'empty' : ''}">${escapeHtml(lastUpdatedBy)}</span>
            </div>
        </div>
        <div class="tool-actions">
            ${tool.id === 'kuismachine-logs' ? `
            <button class="check-button ${needsAction ? 'check-button-pending' : 'check-button-completed'}" onclick="window.open('https://docs.google.com/spreadsheets/d/1IcufTmf0ZaYLLBBzuPYr91F371lThHGrVqR4OydxGxQ/edit#gid=0', '_blank')">
                ${needsAction ? '✓ Check nu' : '✓ Opnieuw checken'}
            </button>
            <button class="check-button check-button-primary" onclick="openKuismachineLogsOverlay()">
                📝 Invoeren
            </button>
            ` : `
            <button class="check-button ${needsAction ? 'check-button-pending' : 'check-button-completed'}" onclick="handleCheck('${tool.id}')">
                ${needsAction ? '✓ Check nu' : '✓ Opnieuw checken'}
            </button>
            ${tool.link && tool.link !== '#' ? `
            <a href="${escapeHtml(tool.link)}" class="tool-link-button">→ Ga naar tool</a>
            ` : `
            <span class="tool-link-button disabled">Binnenkort beschikbaar</span>
            `}
            `}
        </div>
    `;

    return card;
}

/**
 * Handle check button click
 */
function handleCheck(toolId) {
    // In een echte implementatie zou dit de tool als voltooid markeren
    console.log(`Checking tool: ${toolId}`);
    alert(`Tool "${toolId}" wordt nu gecheckt. In productie zou dit de status updaten.`);
    // Optioneel: reload dashboard om status te updaten
    // loadDashboard();
}

/**
 * Open kuismachine logs overlay
 */
function openKuismachineLogsOverlay() {
    const overlay = document.getElementById('kuismachine-logs-overlay');
    const form = document.getElementById('kuismachine-logs-form');
    const errorDiv = document.getElementById('form-error');
    
    // Reset formulier
    form.reset();
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    // Verberg machine velden
    document.getElementById('kuismachine-fields').style.display = 'none';
    document.getElementById('stofzuiger-fields').style.display = 'none';
    
    // Vul automatisch datum en tijd
    const now = new Date();
    const dateStr = now.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('datum').value = dateStr;
    document.getElementById('tijd').value = timeStr;
    
    // Toon overlay
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Sluit kuismachine logs overlay
 */
function closeKuismachineLogsOverlay() {
    const overlay = document.getElementById('kuismachine-logs-overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
}

/**
 * Toggle machine fields op basis van checkbox
 */
function toggleMachineFields(machineType) {
    const checkbox = document.getElementById(`${machineType}-gebruikt`);
    const fields = document.getElementById(`${machineType}-fields`);
    
    if (checkbox.checked) {
        fields.style.display = 'block';
    } else {
        fields.style.display = 'none';
        // Reset velden
        document.getElementById(`${machineType}-uitgekuist`).checked = false;
        document.getElementById(`${machineType}-starttijd`).value = '';
        document.getElementById(`${machineType}-eindtijd`).value = '';
    }
}

/**
 * Valideer tijd formaat (HH:MM)
 */
function validateTimeFormat(time) {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}

/**
 * Converteer tijd string naar minuten sinds middernacht voor vergelijking
 */
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Valideer formulier data
 */
function validateKuismachineLogsForm(formData) {
    const errors = [];
    
    // Naam is verplicht
    if (!formData.naam || formData.naam.trim() === '') {
        errors.push('Naam is verplicht');
    }
    
    // Minimaal één machine moet gebruikt zijn
    if (!formData.kuismachineGebruikt && !formData.stofzuigerGebruikt) {
        errors.push('Selecteer minimaal één machine (kuismachine of stofzuiger)');
    }
    
    // Valideer kuismachine velden als gebruikt
    if (formData.kuismachineGebruikt) {
        if (!formData.kuismachineStarttijd || formData.kuismachineStarttijd.trim() === '') {
            errors.push('Kuismachine starttijd is verplicht');
        } else if (!validateTimeFormat(formData.kuismachineStarttijd)) {
            errors.push('Kuismachine starttijd moet in formaat HH:MM zijn (bijv. 14:30)');
        }
        
        if (!formData.kuismachineEindtijd || formData.kuismachineEindtijd.trim() === '') {
            errors.push('Kuismachine eindtijd is verplicht');
        } else if (!validateTimeFormat(formData.kuismachineEindtijd)) {
            errors.push('Kuismachine eindtijd moet in formaat HH:MM zijn (bijv. 15:45)');
        }
        
        // Eindtijd moet na starttijd zijn
        if (formData.kuismachineStarttijd && formData.kuismachineEindtijd) {
            if (validateTimeFormat(formData.kuismachineStarttijd) && validateTimeFormat(formData.kuismachineEindtijd)) {
                if (timeToMinutes(formData.kuismachineEindtijd) <= timeToMinutes(formData.kuismachineStarttijd)) {
                    errors.push('Kuismachine eindtijd moet na starttijd zijn');
                }
            }
        }
    }
    
    // Valideer stofzuiger velden als gebruikt
    if (formData.stofzuigerGebruikt) {
        if (!formData.stofzuigerStarttijd || formData.stofzuigerStarttijd.trim() === '') {
            errors.push('Stofzuiger starttijd is verplicht');
        } else if (!validateTimeFormat(formData.stofzuigerStarttijd)) {
            errors.push('Stofzuiger starttijd moet in formaat HH:MM zijn (bijv. 14:30)');
        }
        
        if (!formData.stofzuigerEindtijd || formData.stofzuigerEindtijd.trim() === '') {
            errors.push('Stofzuiger eindtijd is verplicht');
        } else if (!validateTimeFormat(formData.stofzuigerEindtijd)) {
            errors.push('Stofzuiger eindtijd moet in formaat HH:MM zijn (bijv. 15:45)');
        }
        
        // Eindtijd moet na starttijd zijn
        if (formData.stofzuigerStarttijd && formData.stofzuigerEindtijd) {
            if (validateTimeFormat(formData.stofzuigerStarttijd) && validateTimeFormat(formData.stofzuigerEindtijd)) {
                if (timeToMinutes(formData.stofzuigerEindtijd) <= timeToMinutes(formData.stofzuigerStarttijd)) {
                    errors.push('Stofzuiger eindtijd moet na starttijd zijn');
                }
            }
        }
    }
    
    return errors;
}

/**
 * Handle kuismachine logs formulier submit
 */
async function handleKuismachineLogsSubmit(event) {
    event.preventDefault();
    
    const errorDiv = document.getElementById('form-error');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    // Verzamel formulier data
    const formData = {
        naam: document.getElementById('naam').value.trim(),
        kuismachineGebruikt: document.getElementById('kuismachine-gebruikt').checked,
        kuismachineUitgekuist: document.getElementById('kuismachine-uitgekuist').checked,
        kuismachineStarttijd: document.getElementById('kuismachine-starttijd').value.trim(),
        kuismachineEindtijd: document.getElementById('kuismachine-eindtijd').value.trim(),
        stofzuigerGebruikt: document.getElementById('stofzuiger-gebruikt').checked,
        stofzuigerUitgekuist: document.getElementById('stofzuiger-uitgekuist').checked,
        stofzuigerStarttijd: document.getElementById('stofzuiger-starttijd').value.trim(),
        stofzuigerEindtijd: document.getElementById('stofzuiger-eindtijd').value.trim()
    };
    
    // Valideer
    const errors = validateKuismachineLogsForm(formData);
    if (errors.length > 0) {
        errorDiv.textContent = errors.join('. ');
        errorDiv.style.display = 'block';
        return;
    }
    
    // Voeg datum en tijd toe
    const now = new Date();
    formData.datum = now.toISOString().split('T')[0];
    formData.tijd = now.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Disable submit button
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Opslaan...';
    
    try {
        // Stuur data naar Google Apps Script
        if (APPS_SCRIPT_URL && APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'saveKuismachineLog',
                    ...formData
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Success - sluit overlay en toon melding
                alert('Kuismachine log succesvol opgeslagen!');
                closeKuismachineLogsOverlay();
                // Optioneel: reload dashboard
                // loadDashboard();
            } else {
                throw new Error(result.error || 'Onbekende fout bij opslaan');
            }
        } else {
            // Demo mode - toon melding
            console.log('Demo mode - formulier data:', formData);
            alert('Demo mode: Formulier data zou worden opgeslagen:\n' + JSON.stringify(formData, null, 2));
            closeKuismachineLogsOverlay();
        }
    } catch (error) {
        console.error('Error saving kuismachine log:', error);
        errorDiv.textContent = 'Fout bij opslaan: ' + error.message;
        errorDiv.style.display = 'block';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

/**
 * Format datum voor weergave
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Als het geen geldige datum is, probeer het als string te tonen
            return dateString;
        }
        
        return date.toLocaleDateString('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Escape HTML om XSS te voorkomen
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Default tools voor als er geen data beschikbaar is
 */
function getDefaultTools() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekString = lastWeek.toISOString().split('T')[0];

    return [
        {
            id: 'stockcheck',
            title: 'Stockcheck Document',
            frequency: 'Wekelijks',
            lastUpdatedDate: lastWeekString,
            lastUpdatedTime: '14:30',
            lastUpdatedBy: 'Jan Janssen',
            link: '#',
            needsAction: false // Al gedaan deze week
        },
        {
            id: 'weekly-kart',
            title: 'Weekly Kart Check',
            frequency: 'Wekelijks',
            lastUpdatedDate: lastWeekString,
            lastUpdatedTime: '15:45',
            lastUpdatedBy: 'Maria de Vries',
            link: '#',
            needsAction: false // Al gedaan deze week
        },
        {
            id: 'cash-tracking',
            title: 'Cash-tracking',
            frequency: 'Dagelijks',
            lastUpdatedDate: todayString,
            lastUpdatedTime: '09:15',
            lastUpdatedBy: 'Piet Bakker',
            link: '#',
            needsAction: false // Al gedaan vandaag
        },
        {
            id: 'cash-payments',
            title: 'Cash & Payments',
            frequency: 'Dagelijks',
            lastUpdatedDate: yesterdayString,
            lastUpdatedTime: '17:30',
            lastUpdatedBy: 'Lisa Smit',
            link: '#',
            needsAction: true // Nog niet gedaan vandaag
        },
        {
            id: 'kuismachine-logs',
            title: 'Kuismachine Logs',
            frequency: 'Dagelijks',
            lastUpdatedDate: yesterdayString,
            lastUpdatedTime: '16:00',
            lastUpdatedBy: 'Tom de Boer',
            link: '#',
            needsAction: true // Nog niet gedaan vandaag
        },
        {
            id: 'daily-kartcheck',
            title: 'Daily Kartcheck',
            frequency: 'Dagelijks',
            lastUpdatedDate: todayString,
            lastUpdatedTime: '08:00',
            lastUpdatedBy: 'Anna van der Berg',
            link: '#',
            needsAction: false // Al gedaan vandaag
        },
        {
            id: 'dagreports',
            title: 'Dagreports',
            frequency: 'Dagelijks',
            lastUpdatedDate: yesterdayString,
            lastUpdatedTime: '18:00',
            lastUpdatedBy: 'Mark Jansen',
            link: '#',
            needsAction: true // Nog niet gedaan vandaag
        }
    ];
}

