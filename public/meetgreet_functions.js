        function initializeMeetAndGreet() {
            // Load Meet and Greet settings from localStorage
            const savedLocations = localStorage.getItem('meetAndGreetLocations');
            if (savedLocations) {
                meetAndGreetLocations = JSON.parse(savedLocations);
            } else {
                // Save default locations to localStorage for first time use
                console.log('💾 No Meet & Greet locations found, saving defaults to localStorage');
                localStorage.setItem('meetAndGreetLocations', JSON.stringify(meetAndGreetLocations));
            }
            
            // Update Meet & Greet surcharge price from Item Surcharge
            updateMeetGreetSurchargeInfo();
            
            // Load locations when Meet and Greet section is shown
            if (document.getElementById('meet-and-greet-section')) {
                renderLocationTabs();
            }
        }

        function updateMeetGreetSurchargeInfo() {
            // Find Meet & Greet item in surchargeItems
            const meetGreetItem = surchargeItems.fixed.find(item => item.id === 'meet-greet');
            if (meetGreetItem) {
                const priceElement = document.getElementById('meetGreetSurchargePrice');
                const statusElement = document.getElementById('meetGreetSurchargeStatus');
                
                if (priceElement) {
                    priceElement.textContent = meetGreetItem.price.toFixed(2);
                }
                
                if (statusElement) {
                    if (meetGreetItem.enabled) {
                        statusElement.textContent = 'Actief';
                        statusElement.style.background = '#28a745';
                        statusElement.style.color = 'white';
                    } else {
                        statusElement.textContent = 'Uitgeschakeld';
                        statusElement.style.background = '#dc3545';
                        statusElement.style.color = 'white';
                    }
                }
            }
        }

        function switchLocationTab(type) {
            // Update tab appearance
            document.querySelectorAll('.location-tab').forEach(tab => {
                if (tab.dataset.type === type) {
                    tab.style.background = '#007bff';
                    tab.style.color = 'white';
                } else {
                    tab.style.background = '#6c757d';
                    tab.style.color = 'white';
                }
            });
            
            // Show/hide tab content
            document.querySelectorAll('.location-tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            document.getElementById(type + 'Tab').style.display = 'block';
            
            // Render locations for selected type
            renderLocations(type);
        }

        function renderLocationTabs() {
            // Default to airports tab
            switchLocationTab('airports');
        }

        function renderLocations(type) {
            const container = document.getElementById(type + 'List');
            const locations = meetAndGreetLocations[type] || [];
            
            if (locations.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div style="font-size: 48px; margin-bottom: 20px;">📍</div>
                        <p>Nog geen ${type === 'airports' ? 'luchthavens' : type === 'stations' ? 'stations' : 'hotels'} toegevoegd.</p>
                        <p style="font-size: 14px;">Klik op "+ Nieuwe ${type === 'airports' ? 'Luchthaven' : type === 'stations' ? 'Station' : 'Hotel'}" om te beginnen.</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = locations.map((location, index) => `
                <div style="border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 15px; background: ${location.enabled ? 'white' : '#f8f9fa'};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div style="flex: 1;">
                            <h5 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 16px;">
                                ${getLocationIcon(type)} ${location.name}
                            </h5>
                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 14px;">${location.fullName}</p>
                            ${location.code ? `<span style="background: #007bff; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: 600;">${location.code}</span>` : ''}
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button onclick="editLocation('${type}', ${index})" style="background: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">✏️ Edit</button>
                            <button onclick="deleteLocation('${type}', ${index})" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️</button>
                        </div>
                    </div>
                    
                    <div class="section-margin">
                        <p style="margin: 0; color: #495057; font-size: 14px;"><strong>Adres:</strong> ${location.address}</p>
                    </div>
                    
                    <div class="section-margin">
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
                            <input type="checkbox" ${location.meetGreetEnabled ? 'checked' : ''} onchange="toggleLocationMeetGreet('${type}', ${index}, this.checked)">
                            <span>🤝 Meet & Greet service actief</span>
                        </label>
                    </div>
                    
                    ${location.meetGreetEnabled ? `
                    <div style="background: #e8f5e9; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745;">
                        <h6 style="margin: 0 0 10px 0; color: #155724;">📝 Ophaalinstructies</h6>
                        <textarea onchange="updatePickupInstructions('${type}', ${index}, this.value)" 
                                  style="width: 100%; padding: 8px; border: 1px solid #c3e6cb; border-radius: 4px; resize: vertical; min-height: 60px; font-size: 13px;"
                                  placeholder="Beschrijf waar de klant opgehaald wordt...">${location.pickupInstructions || ''}</textarea>
                    </div>
                    ` : ''}
                </div>
            `).join('');
        }

        function getLocationIcon(type) {
            switch(type) {
                case 'airports': return '✈️';
                case 'stations': return '🚉';
                case 'hotels': return '🏨';
                default: return '📍';
            }
        }

        function addNewLocation(type) {
            showAddLocationModal(type);
        }

        function showAddLocationModal(type) {
            const typeLabels = {
                'airports': 'Luchthaven',
                'stations': 'Station', 
                'hotels': 'Hotel'
            };
            
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            
            modal.innerHTML = `
                <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #e9ecef; padding-bottom: 15px;">
                        <h3 style="margin: 0; color: #2c3e50; font-size: 24px;">
                            ${getLocationIcon(type)} Nieuwe ${typeLabels[type]} Toevoegen
                        </h3>
                        <button onclick="closeAddLocationModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6c757d;">×</button>
                    </div>
                    
                    <form id="addLocationForm" onsubmit="submitNewLocation(event, '${type}')">
                        <div class="section-margin-lg">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #495057;">
                                📍 Naam van de ${typeLabels[type].toLowerCase()}:
                            </label>
                            <input type="text" id="locationName" required 
                                   placeholder="Bijv. Brussels Airport" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 16px;">
                        </div>
                        
                        <div class="section-margin-lg">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #495057;">
                                🏠 Volledig adres:
                            </label>
                            <input type="text" id="locationAddress" required 
                                   placeholder="Bijv. A201, 1930 Zaventem, Belgium" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 16px;">
                        </div>
                        
                        ${type === 'airports' ? `
                        <div class="section-margin-lg">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #495057;">
                                ✈️ Luchthaven code (optioneel):
                            </label>
                            <input type="text" id="locationCode" 
                                   placeholder="Bijv. BRU" 
                                   style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 16px; text-transform: uppercase;" 
                                   maxlength="4">
                        </div>
                        ` : ''}
                        
                        <div class="section-margin-lg">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #495057;">
                                📝 Ophaalinstructies:
                            </label>
                            <textarea id="locationInstructions" 
                                      placeholder="Bijv. Onze chauffeur wacht op u in de aankomsthal met een naambord."
                                      style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 16px; min-height: 80px; resize: vertical;">${getDefaultPickupInstructions(type)}</textarea>
                        </div>
                        
                        <div style="margin-bottom: 25px; background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="meetGreetEnabled" checked 
                                       style="margin-right: 10px; transform: scale(1.2);">
                                <span style="font-weight: 600; color: #155724;">
                                    🤝 Meet & Greet service inschakelen voor deze locatie
                                </span>
                            </label>
                            <p style="margin: 8px 0 0 0; font-size: 14px; color: #155724;">
                                Wanneer iemand boekt vanaf deze locatie wordt automatisch €5.00 Meet & Greet toeslag toegevoegd.
                            </p>
                        </div>
                        
                        <div style="display: flex; gap: 15px; justify-content: flex-end;">
                            <button type="button" onclick="closeAddLocationModal()" 
                                    style="padding: 12px 24px; border: 2px solid #6c757d; background: white; color: #6c757d; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                Annuleren
                            </button>
                            <button type="submit" 
                                    style="padding: 12px 24px; border: none; background: #28a745; color: white; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                ${typeLabels[type]} Toevoegen
                            </button>
                        </div>
                    </form>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.getElementById('locationName').focus();
        }

        function closeAddLocationModal() {
            const modal = document.querySelector('[style*="position: fixed"][style*="z-index: 10000"]');
            if (modal) {
                modal.remove();
            }
        }

        function submitNewLocation(event, type) {
            event.preventDefault();
            
            const name = document.getElementById('locationName').value.trim();
            const address = document.getElementById('locationAddress').value.trim();
            const code = document.getElementById('locationCode')?.value.trim().toUpperCase() || '';
            const instructions = document.getElementById('locationInstructions').value.trim();
            const meetGreetEnabled = document.getElementById('meetGreetEnabled').checked;
            
            if (!name || !address) {
                alert('Naam en adres zijn verplicht.');
                return;
            }
            
            const newLocation = {
                id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                name: name,
                fullName: name,
                address: address,
                enabled: true,
                meetGreetEnabled: meetGreetEnabled,
                pickupInstructions: instructions || getDefaultPickupInstructions(type)
            };
            
            if (code) {
                newLocation.code = code;
            }
            
            if (!meetAndGreetLocations[type]) {
                meetAndGreetLocations[type] = [];
            }
            
            meetAndGreetLocations[type].push(newLocation);
            renderLocations(type);
            closeAddLocationModal();
            
            console.log(`✅ Nieuwe ${type} locatie toegevoegd:`, newLocation);
            
            // Show success message
            showNotification(`✅ ${newLocation.name} succesvol toegevoegd!`, 'success');
        }

        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10001;
                font-weight: 600;
                max-width: 400px;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 4000);
        }

        function getDefaultPickupInstructions(type) {
            switch(type) {
                case 'airports':
                    return 'Onze chauffeur wacht op u in de aankomsthal met een naambord.';
                case 'stations':
                    return 'Onze chauffeur wacht bij de hoofdingang van het station.';
                case 'hotels':
                    return 'Onze chauffeur wacht in de lobby van het hotel.';
                default:
                    return 'Onze chauffeur wacht op de afgesproken locatie.';
            }
        }

        function toggleLocationMeetGreet(type, index, enabled) {
            meetAndGreetLocations[type][index].meetGreetEnabled = enabled;
            renderLocations(type);
            console.log(`🤝 Meet & Greet ${enabled ? 'ingeschakeld' : 'uitgeschakeld'} voor ${meetAndGreetLocations[type][index].name}`);
        }

        function updatePickupInstructions(type, index, instructions) {
            meetAndGreetLocations[type][index].pickupInstructions = instructions;
            console.log(`📝 Ophaalinstructies bijgewerkt voor ${meetAndGreetLocations[type][index].name}`);
        }

        function editLocation(type, index) {
            const location = meetAndGreetLocations[type][index];
            
            const newName = prompt('Naam:', location.name);
            if (newName === null) return;
            
            const newAddress = prompt('Adres:', location.address);
            if (newAddress === null) return;
            
            let newCode = location.code || '';
            if (type === 'airports') {
                newCode = prompt('Luchthaven code:', newCode) || '';
            }
            
            // Update location
            location.name = newName;
            location.fullName = newName;
            location.address = newAddress;
            if (newCode) {
                location.code = newCode.toUpperCase();
            }
            
            renderLocations(type);
            console.log(`✏️ Locatie bijgewerkt:`, location);
        }

        function deleteLocation(type, index) {
            const location = meetAndGreetLocations[type][index];
            if (confirm(`Weet je zeker dat je "${location.name}" wilt verwijderen?`)) {
                meetAndGreetLocations[type].splice(index, 1);
                renderLocations(type);
                console.log(`🗑️ Locatie verwijderd: ${location.name}`);
            }
        }

        function saveMeetAndGreetSettings() {
            try {
                // Save to localStorage
                localStorage.setItem('meetAndGreetLocations', JSON.stringify(meetAndGreetLocations));
                
                // Show success message
                const statusDiv = document.getElementById('meetGreetStatus');
                statusDiv.style.display = 'block';
                statusDiv.style.background = '#d4edda';
                statusDiv.style.color = '#155724';
                statusDiv.style.border = '1px solid #c3e6cb';
                statusDiv.innerHTML = '✅ Meet & Greet instellingen succesvol opgeslagen!';
                
                // Hide after 3 seconds
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 3000);
                
                console.log('✅ Meet & Greet settings saved:', meetAndGreetLocations);
                
                // Update surcharge info
                updateMeetGreetSurchargeInfo();
                
            } catch (error) {
                console.error('❌ Failed to save Meet & Greet settings:', error);
                
                const statusDiv = document.getElementById('meetGreetStatus');
                statusDiv.style.display = 'block';
                statusDiv.style.background = '#f8d7da';
                statusDiv.style.color = '#721c24';
                statusDiv.style.border = '1px solid #f5c6cb';
                statusDiv.innerHTML = '❌ Fout bij opslaan van instellingen: ' + error.message;
            }
        }

        // Function to check if a location requires Meet & Greet
        function checkMeetAndGreetRequired(fromLocation) {
            const allLocations = [
                ...meetAndGreetLocations.airports,
                ...meetAndGreetLocations.stations,
                ...meetAndGreetLocations.hotels
            ];
            
            // Check if the pickup location matches any registered Meet & Greet location
            for (const location of allLocations) {
                if (!location.enabled || !location.meetGreetEnabled) continue;
                
                // Simple text matching - in production you might want more sophisticated matching
                const locationNames = [
                    location.name.toLowerCase(),
                    location.fullName.toLowerCase(),
                    location.code?.toLowerCase()
                ].filter(Boolean);
                
                const fromLoc = fromLocation.toLowerCase();
                
                for (const locName of locationNames) {
                    if (fromLoc.includes(locName) || locName.includes(fromLoc)) {
                        return {
                            required: true,
                            location: location,
                            instructions: location.pickupInstructions
                        };
                    }
                }
            }
            
            return { required: false };
        }
        

        window.inspectSelectedSurcharges = function() {
