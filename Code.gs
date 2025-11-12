/**
 * Google Apps Script voor Battlekart Dashboard
 * 
 * Deze script leest data uit een Google Sheet en retourneert deze als JSON
 * voor gebruik in de dashboard frontend.
 */

// Vervang dit met de ID van je Google Sheet
// Je vindt de ID in de URL van je Google Sheet:
// https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
// Voorbeeld: https://docs.google.com/spreadsheets/d/1IcufTmf0ZaYLLBBzuPYr91F371lThHGrVqR4OydxGxQ/edit
// De ID is: 1IcufTmf0ZaYLLBBzuPYr91F371lThHGrVqR4OydxGxQ
const SHEET_ID = '1IcufTmf0ZaYLLBBzuPYr91F371lThHGrVqR4OydxGxQ'; // Vervang met je spreadsheet ID
const SHEET_NAME = 'Dashboard'; // Naam van het tabblad in de sheet
const KUISMACHINE_LOGS_SHEET_NAME = 'Kuismachine Logs'; // Naam van het tabblad voor kuismachine logs (wordt automatisch aangemaakt)

/**
 * HTTP GET handler - Retourneert dashboard data als JSON
 */
function doGet(e) {
    try {
        // Valideer SHEET_ID
        if (!SHEET_ID || SHEET_ID === 'YOUR_SHEET_ID_HERE') {
            const errorResponse = createErrorResponse('SHEET_ID is niet geconfigureerd. Controleer Code.gs');
            const output = errorResponse.getContent();
            return ContentService
                .createTextOutput(output)
                .setMimeType(ContentService.MimeType.JSON)
                .setHeaders({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                });
        }
        
        // Open de spreadsheet
        let spreadsheet;
        try {
            // Probeer eerst te controleren of de spreadsheet bestaat
            spreadsheet = SpreadsheetApp.openById(SHEET_ID);
            // Test of we toegang hebben door de naam op te halen
            const spreadsheetName = spreadsheet.getName();
            Logger.log('Spreadsheet geopend: ' + spreadsheetName);
        } catch (openError) {
            Logger.log('Error opening spreadsheet. SHEET_ID: ' + SHEET_ID);
            Logger.log('Error details: ' + openError.toString());
            Logger.log('Error stack: ' + (openError.stack || 'No stack trace'));
            
            let errorMessage = 'Kan spreadsheet niet openen. ';
            if (openError.toString().includes('Unexpected error')) {
                errorMessage += 'Mogelijke oorzaken:\n';
                errorMessage += '1. De spreadsheet bestaat niet of de SHEET_ID is verkeerd\n';
                errorMessage += '2. De Google Apps Script heeft geen toegang tot de spreadsheet\n';
                errorMessage += '3. De spreadsheet is niet gedeeld met het account dat de script uitvoert\n';
                errorMessage += '\nControleer:\n';
                errorMessage += '- Of de spreadsheet ID correct is: ' + SHEET_ID + '\n';
                errorMessage += '- Of je de spreadsheet hebt gedeeld met je Google account\n';
                errorMessage += '- Of je de permissies hebt verleend aan de Google Apps Script';
            } else {
                errorMessage += 'Fout: ' + openError.toString();
            }
            
            const errorResponse = createErrorResponse(errorMessage);
            const output = errorResponse.getContent();
            return ContentService
                .createTextOutput(output)
                .setMimeType(ContentService.MimeType.JSON)
                .setHeaders({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                });
        }
        
        const sheet = spreadsheet.getSheetByName(SHEET_NAME);
        
        if (!sheet) {
            const errorResponse = createErrorResponse('Sheet niet gevonden: ' + SHEET_NAME);
            const output = errorResponse.getContent();
            return ContentService
                .createTextOutput(output)
                .setMimeType(ContentService.MimeType.JSON)
                .setHeaders({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                });
        }
        
        // Haal alle data op (behalve header row)
        const data = sheet.getDataRange().getValues();
        
        if (data.length <= 1) {
            const successResponse = createSuccessResponse([]);
            const output = successResponse.getContent();
            return ContentService
                .createTextOutput(output)
                .setMimeType(ContentService.MimeType.JSON)
                .setHeaders({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                });
        }
        
        // Skip header row (eerste rij)
        const headers = data[0];
        const rows = data.slice(1);
        
        // Map kolommen naar indices
        const columnMap = createColumnMap(headers);
        
        // Converteer rijen naar tool objecten
        const tools = rows.map(row => {
            return {
                id: getValue(row, columnMap, 'Tool ID'),
                title: getValue(row, columnMap, 'Tool Titel'),
                frequency: getValue(row, columnMap, 'Regelmaat'),
                lastUpdatedDate: getValue(row, columnMap, 'Laatste Invuldatum'),
                lastUpdatedTime: getValue(row, columnMap, 'Laatste Invultijd'),
                lastUpdatedBy: getValue(row, columnMap, 'Door Wie Ingevuld'),
                link: getValue(row, columnMap, 'Link')
            };
        }).filter(tool => tool.id && tool.title); // Filter lege rijen
        
        const successResponse = createSuccessResponse(tools);
        const output = successResponse.getContent();
        return ContentService
            .createTextOutput(output)
            .setMimeType(ContentService.MimeType.JSON)
            .setHeaders({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
        
    } catch (error) {
        Logger.log('Error in doGet: ' + error.toString());
        const errorResponse = createErrorResponse('Fout bij het ophalen van data: ' + error.toString());
        const output = errorResponse.getContent();
        return ContentService
            .createTextOutput(output)
            .setMimeType(ContentService.MimeType.JSON)
            .setHeaders({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
    }
}

/**
 * Handle OPTIONS request voor CORS preflight
 */
function doOptions() {
    return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
}

/**
 * HTTP POST handler - Voor toekomstig gebruik (bijv. update laatste invuldatum)
 */
function doPost(e) {
    try {
        const postData = JSON.parse(e.postData.contents);
        const action = postData.action;
        
        let result;
        
        if (action === 'update') {
            // Update laatste invuldatum voor een tool
            const toolId = postData.toolId;
            const date = postData.date;
            const time = postData.time;
            const user = postData.user;
            
            result = updateToolLastUpdate(toolId, date, time, user);
        } else if (action === 'saveKuismachineLog') {
            result = saveKuismachineLog(postData);
        } else {
            result = createErrorResponse('Onbekende actie: ' + action);
        }
        
        // Voeg CORS headers toe
        const output = result.getContent();
        return ContentService
            .createTextOutput(output)
            .setMimeType(ContentService.MimeType.JSON)
            .setHeaders({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
        
    } catch (error) {
        Logger.log('Error in doPost: ' + error.toString());
        const errorResponse = createErrorResponse('Fout bij verwerken van request: ' + error.toString());
        const output = errorResponse.getContent();
        return ContentService
            .createTextOutput(output)
            .setMimeType(ContentService.MimeType.JSON)
            .setHeaders({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
    }
}

/**
 * Update laatste invuldatum voor een tool
 */
function updateToolLastUpdate(toolId, date, time, user) {
    try {
        const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
        const sheet = spreadsheet.getSheetByName(SHEET_NAME);
        
        if (!sheet) {
            return createErrorResponse('Sheet niet gevonden');
        }
        
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const columnMap = createColumnMap(headers);
        
        // Zoek de rij met het juiste tool ID
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const currentToolId = getValue(row, columnMap, 'Tool ID');
            
            if (currentToolId === toolId) {
                // Update de waarden
                if (columnMap['Laatste Invuldatum'] !== undefined) {
                    sheet.getRange(i + 1, columnMap['Laatste Invuldatum'] + 1).setValue(date);
                }
                if (columnMap['Laatste Invultijd'] !== undefined) {
                    sheet.getRange(i + 1, columnMap['Laatste Invultijd'] + 1).setValue(time);
                }
                if (columnMap['Door Wie Ingevuld'] !== undefined) {
                    sheet.getRange(i + 1, columnMap['Door Wie Ingevuld'] + 1).setValue(user);
                }
                
                return createSuccessResponse({ message: 'Updated successfully' });
            }
        }
        
        return createErrorResponse('Tool niet gevonden: ' + toolId);
        
    } catch (error) {
        Logger.log('Error updating tool: ' + error.toString());
        return createErrorResponse('Fout bij updaten: ' + error.toString());
    }
}

/**
 * Maak een map van kolomnamen naar indices
 */
function createColumnMap(headers) {
    const map = {};
    headers.forEach((header, index) => {
        if (header && header.toString().trim() !== '') {
            map[header.toString().trim()] = index;
        }
    });
    return map;
}

/**
 * Haal waarde op uit een rij op basis van kolomnaam
 */
function getValue(row, columnMap, columnName) {
    const index = columnMap[columnName];
    if (index !== undefined && row[index] !== undefined) {
        const value = row[index];
        // Converteer Date objecten naar string
        if (value instanceof Date) {
            return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        }
        return value.toString().trim();
    }
    return '';
}

/**
 * Maak een succesvolle JSON response
 */
function createSuccessResponse(data) {
    const response = {
        success: true
    };
    
    // Als data een object is met specifieke properties, voeg die toe
    // Anders behandel het als tools array (voor backwards compatibility)
    if (Array.isArray(data)) {
        response.tools = data;
    } else {
        Object.assign(response, data);
    }
    
    return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Maak een error JSON response
 */
function createErrorResponse(message) {
    return ContentService
        .createTextOutput(JSON.stringify({
            success: false,
            error: message
        }))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test functie om spreadsheet toegang te testen
 * Voer deze functie handmatig uit vanuit de Apps Script editor om te testen
 */
function testSpreadsheetAccess() {
    try {
        Logger.log('Testing spreadsheet access...');
        Logger.log('SHEET_ID: ' + SHEET_ID);
        
        const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
        const spreadsheetName = spreadsheet.getName();
        Logger.log('SUCCESS: Spreadsheet geopend: ' + spreadsheetName);
        
        const sheets = spreadsheet.getSheets();
        Logger.log('Aantal tabbladen: ' + sheets.length);
        sheets.forEach(function(sheet) {
            Logger.log('- Tabblad: ' + sheet.getName());
        });
        
        return 'SUCCESS: Spreadsheet toegang werkt!';
    } catch (error) {
        Logger.log('ERROR: ' + error.toString());
        Logger.log('Stack: ' + (error.stack || 'No stack trace'));
        return 'ERROR: ' + error.toString();
    }
}

/**
 * Sla kuismachine log op in spreadsheet
 */
function saveKuismachineLog(postData) {
    try {
        // Valideer SHEET_ID
        if (!SHEET_ID || SHEET_ID === 'YOUR_SHEET_ID_HERE') {
            return createErrorResponse('SHEET_ID is niet geconfigureerd. Controleer Code.gs');
        }
        
        let spreadsheet;
        try {
            spreadsheet = SpreadsheetApp.openById(SHEET_ID);
            const spreadsheetName = spreadsheet.getName();
            Logger.log('Spreadsheet geopend voor save: ' + spreadsheetName);
        } catch (openError) {
            Logger.log('Error opening spreadsheet voor save. SHEET_ID: ' + SHEET_ID);
            Logger.log('Error details: ' + openError.toString());
            
            let errorMessage = 'Kan spreadsheet niet openen. ';
            if (openError.toString().includes('Unexpected error')) {
                errorMessage += 'Controleer of de spreadsheet bestaat en gedeeld is met je Google account.';
            } else {
                errorMessage += 'Fout: ' + openError.toString();
            }
            
            return createErrorResponse(errorMessage);
        }
        
        // Zorg dat het tabblad bestaat
        let sheet = spreadsheet.getSheetByName(KUISMACHINE_LOGS_SHEET_NAME);
        if (!sheet) {
            sheet = spreadsheet.insertSheet(KUISMACHINE_LOGS_SHEET_NAME);
            // Voeg headers toe
            const headers = [
                'Datum',
                'Tijd',
                'Naam',
                'Kuismachine Gebruikt',
                'Kuismachine Uitgekuist',
                'Kuismachine Starttijd',
                'Kuismachine Eindtijd',
                'Stofzuiger Gebruikt',
                'Stofzuiger Uitgekuist',
                'Stofzuiger Starttijd',
                'Stofzuiger Eindtijd'
            ];
            sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
            // Format header row
            const headerRange = sheet.getRange(1, 1, 1, headers.length);
            headerRange.setFontWeight('bold');
            headerRange.setBackground('#667eea');
            headerRange.setFontColor('#ffffff');
        }
        
        // Controleer of headers bestaan, zo niet voeg ze toe
        const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        if (existingHeaders.length === 0 || existingHeaders[0] === '') {
            const headers = [
                'Datum',
                'Tijd',
                'Naam',
                'Kuismachine Gebruikt',
                'Kuismachine Uitgekuist',
                'Kuismachine Starttijd',
                'Kuismachine Eindtijd',
                'Stofzuiger Gebruikt',
                'Stofzuiger Uitgekuist',
                'Stofzuiger Starttijd',
                'Stofzuiger Eindtijd'
            ];
            sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
            const headerRange = sheet.getRange(1, 1, 1, headers.length);
            headerRange.setFontWeight('bold');
            headerRange.setBackground('#667eea');
            headerRange.setFontColor('#ffffff');
        }
        
        // Voeg nieuwe rij toe
        const newRow = [
            postData.datum || '',
            postData.tijd || '',
            postData.naam || '',
            postData.kuismachineGebruikt ? 'Ja' : 'Nee',
            postData.kuismachineUitgekuist ? 'Ja' : 'Nee',
            postData.kuismachineStarttijd || '',
            postData.kuismachineEindtijd || '',
            postData.stofzuigerGebruikt ? 'Ja' : 'Nee',
            postData.stofzuigerUitgekuist ? 'Ja' : 'Nee',
            postData.stofzuigerStarttijd || '',
            postData.stofzuigerEindtijd || ''
        ];
        
        const nextRow = sheet.getLastRow() + 1;
        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
        
        return createSuccessResponse({ 
            message: 'Kuismachine log succesvol opgeslagen',
            row: nextRow
        });
        
    } catch (error) {
        Logger.log('Error saving kuismachine log: ' + error.toString());
        return createErrorResponse('Fout bij opslaan van kuismachine log: ' + error.toString());
    }
}

