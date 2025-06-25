document.addEventListener('DOMContentLoaded', () => {
    // Setze Deutsch als Standardsprache
    document.getElementById('languageSelect').value = 'de';
    changeLanguage('de');

    // Weichenadressen Elemente
    const addressInput = document.getElementById('addressInput');
    const addButton = document.getElementById('addButton');
    const addressList = document.getElementById('addressList');
    const addressToDelete = document.getElementById('addressToDelete');
    const deleteButton = document.getElementById('deleteButton');
    const saveButton = document.getElementById('saveButton');
    const saveAsButton = document.getElementById('saveAsButton');
    const loadButton = document.getElementById('loadButton');
    const message = document.getElementById('message');
    const clearAllButton = document.getElementById('clearAllButton');

    // Fahrstraßen Elemente
    const routeAddressInput = document.getElementById('routeAddressInput');
    const routeAddButton = document.getElementById('routeAddButton');
    const routeAddressList = document.getElementById('routeAddressList');
    const routeAddressToDelete = document.getElementById('routeAddressToDelete');
    const routeDeleteButton = document.getElementById('routeDeleteButton');
    const routeSaveButton = document.getElementById('routeSaveButton');
    const routeSaveAsButton = document.getElementById('routeSaveAsButton');
    const routeLoadButton = document.getElementById('routeLoadButton');
    const routeMessage = document.getElementById('routeMessage');
    const routeClearAllButton = document.getElementById('routeClearAllButton');

    let addresses = [];
    let routeAddresses = [];

    // Funktionen zum Formatieren des Dateinamens
    const getFormattedDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    };

    const getDefaultFileName = (prefix) => {
        return `${getFormattedDateTime()}-${prefix}.txt`;
    };

    // Weichenadressen Funktionen
    const addAddress = () => {
        const value = parseInt(addressInput.value);
        if (isNaN(value) || value < 1 || value > 1023) {
            message.textContent = `Ungültige Eingabe "${addressInput.value}". Bitte gib eine Zahl zwischen 1 und 1023 ein.`;
            addressInput.value = '';
            return;
        }

        if (addresses.includes(value)) {
            message.textContent = `Die Adresse ${value} wurde bereits eingegeben.`;
            addressInput.value = '';
            return;
        }

        addresses.push(value);
        addresses.sort((a, b) => a - b);
        updateAddressList();
        updateDeleteDropdown();
        addressInput.value = '';
        message.textContent = '';
    };

    // Fahrstraßen Funktionen
    const addRouteAddress = () => {
        const value = parseInt(routeAddressInput.value);
        if (isNaN(value) || value < 1 || value > 1023) {
            routeMessage.textContent = `Ungültige Eingabe "${routeAddressInput.value}". Bitte gib eine Zahl zwischen 1 und 1023 ein.`;
            routeAddressInput.value = '';
            return;
        }

        if (routeAddresses.includes(value)) {
            routeMessage.textContent = `Die Adresse ${value} wurde bereits eingegeben.`;
            routeAddressInput.value = '';
            return;
        }

        if (addresses.includes(value)) {
            routeMessage.textContent = `Die Adresse ${value} wird bereits als Weichenadresse verwendet.`;
            routeAddressInput.value = '';
            return;
        }

        routeAddresses.push(value);
        routeAddresses.sort((a, b) => a - b);
        updateRouteAddressList();
        updateRouteDeleteDropdown();
        routeAddressInput.value = '';
        routeMessage.textContent = '';
    };

    // Listen aktualisieren
    const updateAddressList = () => {
        addressList.innerHTML = addresses.map(address => 
            `<span class="address-item">${address}</span>`
        ).join('');
    };

    const updateRouteAddressList = () => {
        routeAddressList.innerHTML = routeAddresses.map(address => 
            `<span class="address-item">${address}</span>`
        ).join('');
        // Aktualisiere auch das Dropdown-Menü für die Fahrstraßenauswahl
        updateRouteSelect();
    };

    // Dropdowns zum Löschen aktualisieren
    const updateDeleteDropdown = () => {
        const currentLang = document.getElementById('languageSelect').value;
        const deleteText = translations[currentLang].deleteOption;
        addressToDelete.innerHTML = `<option value="">${deleteText}</option>` +
            addresses.map(address => 
                `<option value="${address}">${address}</option>`
            ).join('');
    };

    const updateRouteDeleteDropdown = () => {
        const currentLang = document.getElementById('languageSelect').value;
        const deleteText = translations[currentLang].routeDeleteOption;
        routeAddressToDelete.innerHTML = `<option value="">${deleteText}</option>` +
            routeAddresses.map(address => 
                `<option value="${address}">${address}</option>`
            ).join('');
    };

    // Listen als Datei speichern
    const saveAddressList = (customFilename = null) => {
        const filename = customFilename || getDefaultFileName('Liste_aller_Magnetartikel');
        const content = "// BEGINN : MagnetArtikel\n" + 
                       addresses.join(';') + 
                       "\n// ENDE : MagnetArtikel";
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const saveRouteAddressList = (customFilename = null) => {
        const filename = customFilename || getDefaultFileName('Liste_aller_Fahrstrassen');
        const content = "// BEGINN : MagnetArtikel\n" + 
                       addresses.join(';') + 
                       "\n// ENDE : MagnetArtikel\n\n" +
                       "// BEGINN : Fahrstrasse\n" + 
                       routeAddresses.join(';') + 
                       "\n// ENDE :Fahrstrasse";
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Listen laden
    const loadAddressList = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                const content = event.target.result;
                const lines = content.split('\n');
                
                if (lines.length >= 3 && 
                    lines[0].trim() === "// BEGINN : MagnetArtikel" && 
                    lines[lines.length-1].trim() === "// ENDE : MagnetArtikel") {
                    const addressLine = lines.slice(1, -1).join('').trim();
                    const newAddresses = addressLine.split(';')
                        .map(str => parseInt(str.trim()))
                        .filter(num => !isNaN(num) && num >= 1 && num <= 1023);
                    
                    // Prüfe auf Konflikte mit Fahrstraßen-Adressen
                    const conflicts = newAddresses.filter(addr => routeAddresses.includes(addr));
                    if (conflicts.length > 0) {
                        message.textContent = `Konflikt: Adressen ${conflicts.join(', ')} sind bereits als Fahrstraßen-Adressen in Verwendung.`;
                        return;
                    }
                    
                    addresses = newAddresses;
                    updateAddressList();
                    updateDeleteDropdown();
                    message.textContent = 'Liste erfolgreich geladen.';
                } else {
                    message.textContent = 'Ungültiges Dateiformat.';
                }
                
                setTimeout(() => {
                    message.textContent = '';
                }, 2000);
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    };

    const loadRouteAddressList = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                const content = event.target.result;
                const lines = content.split('\n');
                
                // Suche nach dem Fahrstraßen-Block
                let routeStartIndex = -1;
                let routeEndIndex = -1;
                let magnetStartIndex = -1;
                let magnetEndIndex = -1;

                lines.forEach((line, index) => {
                    if (line.trim() === "// BEGINN : MagnetArtikel") {
                        magnetStartIndex = index;
                    } else if (line.trim() === "// ENDE : MagnetArtikel") {
                        magnetEndIndex = index;
                    } else if (line.trim() === "// BEGINN : Fahrstrasse") {
                        routeStartIndex = index;
                    } else if (line.trim() === "// ENDE :Fahrstrasse") {
                        routeEndIndex = index;
                    }
                });

                // Lade Magnetartikel
                if (magnetStartIndex !== -1 && magnetEndIndex !== -1) {
                    const magnetLine = lines.slice(magnetStartIndex + 1, magnetEndIndex).join('').trim();
                    addresses = magnetLine.split(';')
                        .map(str => parseInt(str.trim()))
                        .filter(num => !isNaN(num) && num >= 1 && num <= 1023);
                    updateAddressList();
                    updateDeleteDropdown();
                }

                // Lade Fahrstraßen
                if (routeStartIndex !== -1 && routeEndIndex !== -1) {
                    const routeLine = lines.slice(routeStartIndex + 1, routeEndIndex).join('').trim();
                    const newRouteAddresses = routeLine.split(';')
                        .map(str => parseInt(str.trim()))
                        .filter(num => !isNaN(num) && num >= 1 && num <= 1023);
                    
                    // Prüfe auf Konflikte mit Weichen-Adressen
                    const conflicts = newRouteAddresses.filter(addr => addresses.includes(addr));
                    if (conflicts.length > 0) {
                        routeMessage.textContent = `Konflikt: Adressen ${conflicts.join(', ')} sind bereits als Weichen-Adressen in Verwendung.`;
                        return;
                    }
                    
                    routeAddresses = newRouteAddresses;
                    updateRouteAddressList();
                    updateRouteDeleteDropdown();
                    routeMessage.textContent = 'Listen erfolgreich geladen.';
                } else {
                    routeMessage.textContent = 'Fahrstraßen-Block nicht gefunden.';
                }
                
                setTimeout(() => {
                    routeMessage.textContent = '';
                }, 2000);
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    };

    // Alle Eingaben löschen
    const clearAllAddresses = () => {
        if (addresses.length === 0) {
            message.textContent = 'Die Liste ist bereits leer.';
            return;
        }
        
        if (confirm('Möchtest du wirklich alle Weichen-Adressen löschen?')) {
            addresses = [];
            updateAddressList();
            updateDeleteDropdown();
            message.textContent = 'Alle Eingaben wurden gelöscht.';
            setTimeout(() => {
                message.textContent = '';
            }, 2000);
        }
    };

    const clearAllRouteAddresses = () => {
        if (routeAddresses.length === 0) {
            routeMessage.textContent = 'Die Liste ist bereits leer.';
            return;
        }
        
        if (confirm('Möchtest du wirklich alle Fahrstraßen-Adressen löschen?')) {
            routeAddresses = [];
            updateRouteAddressList();
            updateRouteDeleteDropdown();
            routeMessage.textContent = 'Alle Eingaben wurden gelöscht.';
            setTimeout(() => {
                routeMessage.textContent = '';
            }, 2000);
        }
    };

    // Funktion zum Ändern der Sprache
    function changeLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key] !== undefined) {
                element.textContent = translations[lang][key];
            } else {
                element.textContent = '';
            }
        });

        // Aktualisiere Platzhaltertexte
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
    }

    // Event-Listener für Sprachauswahl
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
        // Aktualisiere auch die Dropdown-Menüs bei Sprachwechsel
        updateDeleteDropdown();
        updateRouteDeleteDropdown();
    });

    // Event Listeners für Weichenadressen
    addButton.addEventListener('click', addAddress);
    addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addAddress();
        }
    });

    deleteButton.addEventListener('click', () => {
        const value = parseInt(addressToDelete.value);
        if (value) {
            addresses = addresses.filter(a => a !== value);
            updateAddressList();
            updateDeleteDropdown();
        }
    });

    saveButton.addEventListener('click', () => saveAddressList());
    saveAsButton.addEventListener('click', () => {
        const filename = prompt('Dateiname eingeben:', getDefaultFileName('Liste_aller_Magnetartikel'));
        if (filename) {
            saveAddressList(filename);
        }
    });
    loadButton.addEventListener('click', loadAddressList);
    clearAllButton.addEventListener('click', clearAllAddresses);

    // Event Listeners für Fahrstraßen
    routeAddButton.addEventListener('click', addRouteAddress);
    routeAddressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addRouteAddress();
        }
    });

    routeDeleteButton.addEventListener('click', () => {
        const value = parseInt(routeAddressToDelete.value);
        if (value) {
            routeAddresses = routeAddresses.filter(a => a !== value);
            updateRouteAddressList();
            updateRouteDeleteDropdown();
        }
    });

    routeSaveButton.addEventListener('click', () => saveRouteAddressList());
    routeSaveAsButton.addEventListener('click', () => {
        const filename = prompt('Dateiname eingeben:', getDefaultFileName('Liste_aller_Fahrstrassen'));
        if (filename) {
            saveRouteAddressList(filename);
        }
    });
    routeLoadButton.addEventListener('click', loadRouteAddressList);
    routeClearAllButton.addEventListener('click', clearAllRouteAddresses);

    // Automatischer Fokus auf Eingabefeld
    addressInput.focus();

    // Verknüpfungselemente
    const newRouteButton = document.getElementById('newRouteButton');
    const editRouteButton = document.getElementById('editRouteButton');
    const deleteRouteButton = document.getElementById('deleteRouteButton');
    const loadRoutesButton = document.getElementById('loadRoutesButton');
    const saveRoutesButton = document.getElementById('saveRoutesButton');
    const editContainer = document.querySelector('.edit-container');
    const routeSelect = document.getElementById('routeSelect');
    const magnetArticleSelect = document.getElementById('magnetArticleSelect');
    const stateSelect = document.getElementById('stateSelect');
    const addConnectionButton = document.getElementById('addConnectionButton');
    const routeConnectionsList = document.getElementById('routeConnectionsList');

    // Datenstruktur für Fahrstraßen-Verknüpfungen
    let routeConnections = new Map(); // Format: Map<number, Array<{magnet: number, state: number}>>
    let usedMagnets = new Set(); // Speichert die bereits verwendeten Magnete für die aktuelle Fahrstraße
    let editModeActive = false;

    // Hilfsfunktionen für die Verknüpfungen
    const updateStateSelect = () => {
        const routeNumber = parseInt(routeSelect.value);
        const magnetNumber = parseInt(magnetArticleSelect.value);
        const connections = routeConnections.get(routeNumber) || [];
        const existingConnection = connections.find(conn => conn.magnet === magnetNumber);

        // Setze die Optionen basierend darauf, ob der Magnetartikel bereits in der Fahrstraße existiert
        stateSelect.innerHTML = `
            <option value="0">0</option>
            <option value="1">1</option>
            ${existingConnection ? '<option value="delete">löschen</option>' : ''}
        `;

        // Wenn eine bestehende Verbindung existiert, setze den aktuellen Zustand
        if (existingConnection) {
            stateSelect.value = existingConnection.state.toString();
        } else {
            stateSelect.value = "0";
        }
    };

    const updateRouteSelect = (onlyExisting = false) => {
        const currentLang = document.getElementById('languageSelect').value;
        const placeholder = translations[currentLang].selectRoute;
        
        let availableRoutes = onlyExisting 
            ? Array.from(routeConnections.keys()) 
            : routeAddresses;

        availableRoutes.sort((a, b) => a - b);
        
        routeSelect.innerHTML = `<option value="">${placeholder}</option>` +
            availableRoutes.map(address => 
                `<option value="${address}">${address}</option>`
            ).join('');
    };

    const updateMagnetArticleSelect = () => {
        const currentRoute = parseInt(routeSelect.value);
        magnetArticleSelect.innerHTML = '<option value="">Magnetartikel auswählen</option>';
        
        // Alle Magnetartikel anzeigen, wenn wir im Edit-Modus sind
        if (editModeActive) {
            addresses.forEach(address => {
                magnetArticleSelect.innerHTML += `<option value="${address}">${address}</option>`;
            });
        } else {
            // Im "Neue Fahrstraße" Modus nur unbenutzte Magnetartikel anzeigen
            addresses
                .filter(address => !usedMagnets.has(address))
                .forEach(address => {
                    magnetArticleSelect.innerHTML += `<option value="${address}">${address}</option>`;
                });
        }
        
        // Aktualisiere die Zustandsauswahl
        updateStateSelect();
    };

    const displayRouteConnections = () => {
        routeConnectionsList.innerHTML = '';
        const sortedRoutes = Array.from(routeConnections.keys()).sort((a, b) => a - b);
        
        sortedRoutes.forEach(routeNumber => {
            const connections = routeConnections.get(routeNumber);
            
            let listText = `${routeNumber}`;  // Entferne die Längenangabe aus der Anzeige
            connections.forEach(conn => {
                listText += `; ${conn.magnet}; ${conn.state}`;
            });
            
            const routeDiv = document.createElement('div');
            routeDiv.className = 'route-item';
            routeDiv.textContent = listText;
            routeConnectionsList.appendChild(routeDiv);
        });
    };

    const resetEditForm = () => {
        routeSelect.value = '';
        magnetArticleSelect.value = '';
        stateSelect.value = '0';
        usedMagnets.clear();
        updateMagnetArticleSelect();
    };

    // Event Handler für die Verknüpfungen
    newRouteButton.addEventListener('click', () => {
        editModeActive = false;
        editContainer.style.display = 'block';
        resetEditForm();
        updateRouteSelect(false); // Zeige alle möglichen Fahrstraßen
        addConnectionButton.textContent = 'Hinzufügen';
    });

    editRouteButton.addEventListener('click', () => {
        editModeActive = true;
        editContainer.style.display = 'block';
        updateRouteSelect(true); // Zeige nur Fahrstraßen mit existierenden Verknüpfungen
        addConnectionButton.textContent = 'Änderungen speichern';
    });

    deleteRouteButton.addEventListener('click', () => {
        const currentLang = document.getElementById('languageSelect').value;
        const promptText = translations[currentLang].deleteRoutePrompt;
        const routeNumber = parseInt(prompt(promptText));
        if (!isNaN(routeNumber) && routeConnections.has(routeNumber)) {
            routeConnections.delete(routeNumber);
            displayRouteConnections();
        }
    });

    routeSelect.addEventListener('change', () => {
        usedMagnets.clear();
        const selectedRoute = parseInt(routeSelect.value);
        if (selectedRoute && routeConnections.has(selectedRoute)) {
            routeConnections.get(selectedRoute).forEach(conn => {
                usedMagnets.add(conn.magnet);
            });
        }
        updateMagnetArticleSelect();
    });

    magnetArticleSelect.addEventListener('change', () => {
        updateStateSelect();
    });

    addConnectionButton.addEventListener('click', () => {
        const routeNumber = parseInt(routeSelect.value);
        const magnetNumber = parseInt(magnetArticleSelect.value);
        const state = stateSelect.value;

        if (!routeNumber || !magnetNumber) {
            alert('Bitte wähle eine Fahrstraße und einen Magnetartikel aus.');
            return;
        }

        if (!routeConnections.has(routeNumber)) {
            routeConnections.set(routeNumber, []);
        }

        if (state === 'delete') {
            // Lösche den ausgewählten Magnetartikel aus der Fahrstraße
            const connections = routeConnections.get(routeNumber);
            const newConnections = connections.filter(conn => conn.magnet !== magnetNumber);
            if (newConnections.length === 0) {
                routeConnections.delete(routeNumber);
            } else {
                routeConnections.set(routeNumber, newConnections);
            }
        } else {
            // Aktualisiere oder füge neue Verbindung hinzu
            const connections = routeConnections.get(routeNumber);
            const existingIndex = connections.findIndex(conn => conn.magnet === magnetNumber);
            
            if (existingIndex !== -1) {
                // Aktualisiere bestehende Verbindung
                connections[existingIndex].state = parseInt(state);
            } else {
                // Füge neue Verbindung hinzu
                connections.push({
                    magnet: magnetNumber,
                    state: parseInt(state)
                });
            }
        }

        usedMagnets.clear();
        if (routeConnections.has(routeNumber)) {
            routeConnections.get(routeNumber).forEach(conn => {
                usedMagnets.add(conn.magnet);
            });
        }
        
        updateMagnetArticleSelect();
        displayRouteConnections();

        // Nach dem Speichern die Eingabefelder zurücksetzen und im Edit-Modus bleiben
        editModeActive = true;
        updateRouteSelect(true); // Zeige nur Fahrstraßen mit existierenden Verknüpfungen
        routeSelect.value = ''; // Setze Fahrstraße zurück
        magnetArticleSelect.value = ''; // Setze Magnetartikel zurück
        updateMagnetArticleSelect(); // Aktualisiere die Magnetartikel-Liste
        addConnectionButton.textContent = 'Änderungen speichern';
    });

    // Speichern und Laden der Verknüpfungen
    saveRoutesButton.addEventListener('click', () => {
        const magnetArtContent = "// BEGINN : MagnetArtikel\n" + 
                               addresses.join(',') + 
                               "\n// ENDE : MagnetArtikel\n\n";

        const fahrStrassenContent = "// BEGINN : FahrStrassen\n" + 
                                  routeAddresses.join(',') + 
                                  "\n// ENDE : FahrStrassen\n\n";

        let shortArraysContent = "// BEGINN : ShortArrays\n";
        const sortedRoutes = Array.from(routeConnections.keys()).sort((a, b) => b - a);
        sortedRoutes.forEach(routeNumber => {
            const connections = routeConnections.get(routeNumber);
            // Die tatsächliche Länge der Liste berechnen:
            // 1 (Fahrstraßennummer) + 1 (Längenangabe) + connections.length * 2 (Magnet+Zustand)
            const totalLength = (1 + 1 + connections.length * 2);
            const elements = [`${routeNumber}`, `${totalLength}`];
            connections.forEach(conn => {
                elements.push(`${conn.magnet}`, `${conn.state}`);
            });
            shortArraysContent += `short w${routeNumber}[] = {${elements.join(', ')}};\n`;
        });
        shortArraysContent += "// ENDE : ShortArrays\n\n";

        let caseZeilenContent = "   // BEGINN : CaseZeilen\n";
        sortedRoutes.forEach(routeNumber => {
            caseZeilenContent += `   case ${routeNumber}: {schalteEineWeichenStrasse(w${routeNumber}); break;}\n`;
        });
        caseZeilenContent += "   // ENDE : CaseZeilen";

        const content = magnetArtContent + fahrStrassenContent + shortArraysContent + caseZeilenContent;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getDefaultFileName('Fahrstrassen_Konfiguration');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    loadRoutesButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                const content = event.target.result;
                const lines = content.split('\n');
                
                // Parse MagnetArtikel
                let inMagnetArtikel = false;
                let inFahrStrassen = false;
                let inShortArrays = false;

                addresses = []; // Leere die bestehende Liste
                routeAddresses = []; // Leere die bestehende Liste
                routeConnections.clear(); // Leere die bestehenden Verknüpfungen

                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine === "// BEGINN : MagnetArtikel") {
                        inMagnetArtikel = true;
                    } else if (trimmedLine === "// ENDE : MagnetArtikel") {
                        inMagnetArtikel = false;
                    } else if (trimmedLine === "// BEGINN : FahrStrassen") {
                        inFahrStrassen = true;
                    } else if (trimmedLine === "// ENDE : FahrStrassen") {
                        inFahrStrassen = false;
                    } else if (trimmedLine === "// BEGINN : ShortArrays") {
                        inShortArrays = true;
                    } else if (trimmedLine === "// ENDE : ShortArrays") {
                        inShortArrays = false;
                    } else if (inMagnetArtikel && trimmedLine) {
                        // Lade MagnetArtikel
                        addresses = trimmedLine.split(',')
                            .map(str => parseInt(str.trim()))
                            .filter(num => !isNaN(num));
                    } else if (inFahrStrassen && trimmedLine) {
                        // Lade FahrStrassen
                        routeAddresses = trimmedLine.split(',')
                            .map(str => parseInt(str.trim()))
                            .filter(num => !isNaN(num));
                    } else if (inShortArrays && trimmedLine.startsWith("short w")) {
                        // Parse ShortArrays wie bisher
                        const match = line.match(/short w(\d+)\[\] = {(.+)};/);
                        if (match) {
                            const routeNumber = parseInt(match[1]);
                            const values = match[2].split(',').map(v => parseInt(v.trim()));
                            const connections = [];
                            
                            for (let i = 2; i < values.length; i += 2) {
                                connections.push({
                                    magnet: values[i],
                                    state: values[i + 1]
                                });
                            }
                            
                            routeConnections.set(routeNumber, connections);
                        }
                    }
                });

                // Aktualisiere alle Listen und Anzeigen
                updateAddressList();
                updateDeleteDropdown();
                updateRouteAddressList();
                updateRouteDeleteDropdown();
                displayRouteConnections();
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    });

    // Arduino Export Funktionen
    const createArduinoButton = document.getElementById('createArduinoButton');
    const downloadArduinoButton = document.getElementById('downloadArduinoButton');
    const arduinoPreview = document.getElementById('arduinoPreview');
    let generatedArduinoCode = '';

    // Arduino Code erstellen
    createArduinoButton.addEventListener('click', async () => {
        // Teil 1: Lade den Kopf-Code
        const response1 = await fetch('arduino_code_parts/wr_01_code_kopf.txt');
        const codePart1 = await response1.text();
        
        // Teil 2: Generiere die ShortArrays aus den gespeicherten Fahrstraßen
        let shortArraysContent = "// BEGINN : ShortArrays\n";
        const sortedRoutes = Array.from(routeConnections.keys()).sort((a, b) => a - b);
        sortedRoutes.forEach(routeNumber => {
            const connections = routeConnections.get(routeNumber);
            // Die tatsächliche Länge der Liste berechnen:
            // 1 (Fahrstraßennummer) + 1 (Längenangabe) + connections.length * 2 (Magnet+Zustand)
            const totalLength = (1 + 1 + connections.length * 2);
            const elements = [`${routeNumber}`, `${totalLength}`];
            connections.forEach(conn => {
                elements.push(`${conn.magnet}`, `${conn.state}`);
            });
            shortArraysContent += `short w${routeNumber}[] = {${elements.join(', ')}};\n`;
        });
        shortArraysContent += "// ENDE : ShortArrays\n\n";
        
        // Teil 3: Lade den Setup-Loop-Code
        const response2 = await fetch('arduino_code_parts/wr_02_code_setup_loop.txt');
        const codePart3 = await response2.text();
        
        // Teil 4: Generiere die CaseZeilen aus den gespeicherten Fahrstraßen
        let caseZeilenContent = "   // BEGINN : CaseZeilen\n";
        sortedRoutes.forEach(routeNumber => {
            caseZeilenContent += `   case ${routeNumber}: {schalteEineWeichenStrasse(w${routeNumber}); break;}\n`;
        });
        caseZeilenContent += "   // ENDE : CaseZeilen\n\n";

        // Teil 5: Lade den Ende-Code
        const response3 = await fetch('arduino_code_parts/wr_03_code_ende.txt');
        const codePart5 = await response3.text();

        // Kombiniere alle Code-Teile in der richtigen Reihenfolge
        generatedArduinoCode = codePart1 + '\n\n' +    // Teil 1
                             shortArraysContent +       // Teil 2
                             codePart3 + '\n' +        // Teil 3
                             caseZeilenContent +       // Teil 4
                             codePart5;                // Teil 5

        // Zeige den Code in der Vorschau
        arduinoPreview.textContent = generatedArduinoCode;
    });

    // Arduino Code herunterladen
    downloadArduinoButton.addEventListener('click', () => {
        if (!generatedArduinoCode) {
            alert('Bitte zuerst den Arduino Code erstellen.');
            return;
        }

        const blob = new Blob([generatedArduinoCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getDefaultFileName('Weichenrouter') + '.ino';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});