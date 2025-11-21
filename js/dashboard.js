// Link data met alle tools en links
const tools = [
    // Dagelijkse taken
    {
        id: 'cash-payments',
        title: 'Cash & Payments Employees',
        url: 'https://docs.google.com/spreadsheets/d/1NRhb54013pCnwgjNvl6OgvL7UAzP_xarv601Va_DFNY/edit?gid=263458102#gid=263458102',
        frequency: 'daily'
    },
    {
        id: 'kart-daily-logboek',
        title: 'Kart Daily logboek',
        url: 'Kart Logboek v.xlsx',
        isFile: true,
        frequency: 'daily'
    },
    {
        id: 'daily-report',
        title: 'Daily Report',
        url: 'Dagreport.docx',
        isFile: true,
        frequency: 'daily'
    },
    {
        id: 'bk-panel',
        title: 'BK panel',
        url: 'https://oauth.battlekart.com/authorize?client_id=d66a502f0a4b7690ed5808e0b559010b&redirect_uri=https%3A%2F%2Fpanel.battlekart.com%2F&response_type=id_token&scope=openid+profile+email&state=33be5a04e47045b69f25360d57512097&brand_id=2&flow=',
        frequency: 'daily'
    },
    {
        id: 'kuismachine-website',
        title: 'Kuismachine website',
        url: 'https://becreativeruben.github.io/BK_Overview_Demo/',
        frequency: 'daily'
    },
    {
        id: 'kuismachine-logs',
        title: 'Kuismachine logs',
        url: '#',
        isFile: true,
        frequency: 'daily'
    },
    // Wekelijkse taken
    {
        id: 'stockcheck-bk',
        title: 'StockcheckBK',
        url: 'https://becreativeruben.github.io/StockCheckBK_V2/',
        frequency: 'weekly'
    },
    {
        id: 'kart-weekly',
        title: 'Kart Weekly',
        url: 'https://becreativeruben.github.io/WeeklyKartCheck/',
        logboekUrl: 'https://docs.google.com/spreadsheets/d/1sCTKJzF1b7pZ5bB1AFD8Y-Hzx2HXI4x5AhVMNVi6gM8/edit',
        frequency: 'weekly',
        hasMultipleLinks: true
    }
];

// Laad dashboard bij pagina load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

/**
 * Laad dashboard en toon alle tools
 */
function loadDashboard() {
    const container = document.getElementById('tools-container');
    container.innerHTML = '';

    // Sorteer tools: eerst dagelijks, dan wekelijks
    const dailyTools = tools.filter(tool => tool.frequency === 'daily');
    const weeklyTools = tools.filter(tool => tool.frequency === 'weekly');

    // Toon dagelijkse taken
    dailyTools.forEach(tool => {
        const toolCard = createToolCard(tool);
        container.appendChild(toolCard);
    });

    // Voeg scheidingslijn toe tussen dagelijkse en wekelijkse taken
    if (dailyTools.length > 0 && weeklyTools.length > 0) {
        const divider = document.createElement('div');
        divider.className = 'frequency-divider';
        divider.innerHTML = '<div class="divider-line"></div><div class="divider-text">Wekelijkse taken</div><div class="divider-line"></div>';
        container.appendChild(divider);
    }

    // Toon wekelijkse taken
    weeklyTools.forEach(tool => {
        const toolCard = createToolCard(tool);
        container.appendChild(toolCard);
    });
}

/**
 * Maak een tool card element
 */
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.setAttribute('data-tool-id', tool.id);
    
    // Haal laatste klik tijd op
    const lastClick = getLastClick(tool.id);
    const lastClickText = lastClick 
        ? formatDateTime(lastClick) 
        : 'Nog niet geklikt';
    
    // Bereken "X geleden" tag
    const timeAgoText = lastClick ? getTimeAgo(lastClick) : null;
    
    // Frequency badge
    const frequencyBadge = tool.frequency === 'daily' 
        ? '<span class="frequency-badge frequency-daily">Dagelijks</span>'
        : '<span class="frequency-badge frequency-weekly">Wekelijks</span>';

    // Voor Kart Weekly: twee knoppen
    let actionsHTML = '';
    if (tool.hasMultipleLinks && tool.logboekUrl) {
        actionsHTML = `
            <a href="${escapeHtml(tool.url)}" 
               class="tool-link-button" 
               target="_blank"
               onclick="handleLinkClick('${tool.id}', event)">
                → Ga naar tool
            </a>
            <a href="${escapeHtml(tool.logboekUrl)}" 
               class="tool-link-button tool-link-button-secondary" 
               target="_blank"
               onclick="handleLinkClick('${tool.id}-logboek', event)">
                → Ga naar logboek
            </a>
        `;
    } else if (tool.url && tool.url !== '#') {
        actionsHTML = `
            <a href="${escapeHtml(tool.url)}" 
               class="tool-link-button" 
               target="_blank"
               onclick="handleLinkClick('${tool.id}', event)">
                → Ga naar tool
            </a>
        `;
    } else {
        actionsHTML = '<span class="tool-link-button disabled">Binnenkort beschikbaar</span>';
    }

    card.innerHTML = `
        <div class="tool-header">
            <div class="tool-title">${escapeHtml(tool.title)}</div>
            ${frequencyBadge}
        </div>
        ${timeAgoText ? `<div class="time-ago-tag">${escapeHtml(timeAgoText)}</div>` : ''}
        <div class="tool-info">
            <div class="info-item">
                <span class="info-label">Laatst geklikt:</span>
                <span class="info-value ${!lastClick ? 'empty' : ''}">${escapeHtml(lastClickText)}</span>
            </div>
        </div>
        <div class="tool-actions">
            ${actionsHTML}
        </div>
    `;

    return card;
}

/**
 * Handle link click - log de klik tijd
 */
function handleLinkClick(toolId, event) {
    // Log de klik tijd
    const now = new Date();
    
    // Voor logboek clicks, sla op onder de basis toolId
    const baseToolId = toolId.replace('-logboek', '');
    saveLastClick(baseToolId, now);
    
    // Update de weergave
    updateLastClickDisplay(baseToolId, now);
}

/**
 * Sla laatste klik tijd op in localStorage
 */
function saveLastClick(toolId, dateTime) {
    try {
        const clickData = {
            timestamp: dateTime.getTime(),
            dateTime: dateTime.toISOString()
        };
        localStorage.setItem(`lastClick_${toolId}`, JSON.stringify(clickData));
    } catch (error) {
        console.error('Error saving click data:', error);
    }
}

/**
 * Haal laatste klik tijd op uit localStorage
 */
function getLastClick(toolId) {
    try {
        const stored = localStorage.getItem(`lastClick_${toolId}`);
        if (stored) {
            const data = JSON.parse(stored);
            return new Date(data.timestamp);
        }
    } catch (error) {
        console.error('Error loading click data:', error);
    }
    return null;
}

/**
 * Update de weergave van laatste klik tijd
 */
function updateLastClickDisplay(toolId, dateTime) {
    // Voor logboek clicks, gebruik de basis toolId
    const baseToolId = toolId.replace('-logboek', '');
    const card = document.querySelector(`.tool-card[data-tool-id="${baseToolId}"]`);
    if (card) {
        const infoValue = card.querySelector('.info-value');
        if (infoValue) {
            infoValue.textContent = formatDateTime(dateTime);
            infoValue.classList.remove('empty');
        }
        
        // Update time-ago tag
        const timeAgoTag = card.querySelector('.time-ago-tag');
        if (timeAgoTag) {
            timeAgoTag.textContent = getTimeAgo(dateTime);
        } else if (dateTime) {
            // Voeg time-ago tag toe als deze nog niet bestaat
            const toolHeader = card.querySelector('.tool-header');
            if (toolHeader && toolHeader.nextElementSibling) {
                const newTag = document.createElement('div');
                newTag.className = 'time-ago-tag';
                newTag.textContent = getTimeAgo(dateTime);
                toolHeader.parentNode.insertBefore(newTag, toolHeader.nextElementSibling);
            }
        }
    }
}

/**
 * Format datum en tijd voor weergave
 */
function formatDateTime(date) {
    if (!date) return '';
    
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) {
            return date.toString();
        }
        
        return dateObj.toLocaleString('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return date.toString();
    }
}

/**
 * Bereken "X geleden" tekst
 */
function getTimeAgo(date) {
    if (!date) return '';
    
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) {
            return '';
        }
        
        const now = new Date();
        const diffMs = now - dateObj;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);
        
        if (diffSeconds < 60) {
            return 'Zojuist';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} ${diffMinutes === 1 ? 'minuut' : 'minuten'} geleden`;
        } else if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? 'uur' : 'uren'} geleden`;
        } else if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? 'dag' : 'dagen'} geleden`;
        } else if (diffWeeks < 4) {
            return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weken'} geleden`;
        } else if (diffMonths < 12) {
            return `${diffMonths} ${diffMonths === 1 ? 'maand' : 'maanden'} geleden`;
        } else {
            const diffYears = Math.floor(diffMonths / 12);
            return `${diffYears} ${diffYears === 1 ? 'jaar' : 'jaren'} geleden`;
        }
    } catch (error) {
        return '';
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
