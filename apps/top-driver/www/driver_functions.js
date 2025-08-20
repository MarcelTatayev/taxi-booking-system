        function saveNewDriver() {
            console.log('Saving new driver with complete data...');
            
            if (!driverManager) {
                alert('Driver systeem wordt nog geladen, probeer over een paar seconden opnieuw.');
                return;
            }
            
            try {
                // Get all form data
                const driverData = {
                    personal: {
                        firstName: document.getElementById('driverFirstName').value.trim(),
                        lastName: document.getElementById('driverLastName').value.trim(),
                        email: document.getElementById('driverEmail').value.trim(),
                        phone: document.getElementById('driverPhone').value.trim(),
                        dateOfBirth: document.getElementById('driverBirthDate').value,
                        bsn: document.getElementById('driverBSN').value.trim(),
                        address: {
                            street: document.getElementById('driverStreet').value.trim(),
                            houseNumber: document.getElementById('driverHouseNumber').value.trim(),
                            postalCode: document.getElementById('driverPostalCode').value.trim(),
                            city: document.getElementById('driverCity').value.trim()
                        }
                    },
                    documents: {
                        driverLicense: {
                            number: document.getElementById('driverLicenseNumber').value.trim(),
                            expiryDate: document.getElementById('driverLicenseExpiry').value
                        },
                        taxiPass: {
                            number: document.getElementById('taxiPassNumber').value.trim(),
                            expiryDate: document.getElementById('taxiPassExpiry').value
                        }
                    },
                    vehicle: {
                        brand: document.getElementById('vehicleBrand').value.trim(),
                        model: document.getElementById('vehicleModel').value.trim(),
                        licensePlate: document.getElementById('vehicleLicensePlate').value.trim(),
                        color: document.getElementById('vehicleColor').value.trim(),
                        seats: parseInt(document.getElementById('vehicleSeats').value) || 4,
                        vehicleType: document.getElementById('vehicleType').value
                    },
                    account: {
                        username: document.getElementById('driverUsername').value.trim(),
                        password: document.getElementById('driverPassword').value.trim()
                    }
                };
                
                // Add the driver using DriverManager
                const newDriver = driverManager.addDriver(driverData);
                
                alert(`✅ Chauffeur ${newDriver.personal.getFullName()} succesvol toegevoegd!`);
                console.log('New driver added:', newDriver);
                
                // Close modal and refresh list
                closeDriverModal();
                refreshDriversList();
                
            } catch (error) {
                console.error('Error adding driver:', error);
                alert(`❌ Fout bij toevoegen chauffeur: ${error.message}`);
            }
        }
        window.showAddDriverModal = showAddDriverModal;
        window.closeDriverModal = closeDriverModal;
        window.saveNewDriver = saveNewDriver;
        
        
        
        
        // Refresh drivers list - Define immediately
        function refreshDriversList() {
            if (!driverManager) {
                console.error('Driver manager not initialized');
                return;
            }
            
            const tbody = document.getElementById('driversTableBody');
            if (!tbody) return;
            
            tbody.innerHTML = '';
            
            const drivers = driverManager.getAllDrivers();
            
            if (drivers.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" style="padding: 40px; text-align: center; color: #6c757d;">
                            <div style="font-size: 48px; margin-bottom: 10px;">🚖</div>
                            <div style="font-size: 18px;">Nog geen chauffeurs toegevoegd</div>
                            <div style="font-size: 14px; margin-top: 5px;">Klik op "Nieuwe Chauffeur Toevoegen" om te beginnen</div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            drivers.forEach(driver => {
                const row = createDriverTableRow(driver);
                tbody.appendChild(row);
            });
            
            updateDriverStats();
        }
        window.refreshDriversList = refreshDriversList;
        
        // Load driver classes
        const script = document.createElement('script');
        script.src = 'driver-classes.js';
        document.head.appendChild(script);
        
        // Initialize driver manager after classes are loaded
        script.onload = function() {
            console.log('Driver classes loaded successfully');
            driverManager = new window.DriverClasses.DriverManager();
            
            // Update driver stats on page load
            updateDriverStats();
        };
        
        
        
        // Create driver table row
        function createDriverTableRow(driver) {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #dee2e6';
            
            // Status indicator
            const statusColors = {
                'online': '#28a745',
                'busy': '#ffc107',
                'break': '#17a2b8',
                'offline': '#6c757d'
            };
            
            const statusText = {
                'online': 'Online',
                'busy': 'Bezig',
                'break': 'Pauze',
                'offline': 'Offline'
            };
            
            tr.innerHTML = `
                <td class="section-padding">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 10px; height: 10px; border-radius: 50%; background: ${statusColors[driver.status.currentStatus]}"></div>
                        <span>${statusText[driver.status.currentStatus]}</span>
                    </div>
                </td>
                <td style="padding: 15px; font-weight: 500;">${driver.personal.getFullName()}</td>
                <td class="section-padding">${driver.personal.phone}</td>
                <td class="section-padding">${driver.personal.email}</td>
                <td class="section-padding">${driver.vehicle.displayName || 'Geen voertuig'}</td>
                <td class="section-padding">
                    ${driver.documents.isVerified() ? 
                        '<span style="color: #28a745;">✅ Geverifieerd</span>' : 
                        '<span style="color: #dc3545;">⏳ Verificatie nodig</span>'}
                </td>
                <td class="section-padding">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span style="color: #ffc107;">⭐</span>
                        <span>${driver.status.rating.toFixed(1)}</span>
                        <span style="color: #6c757d; font-size: 12px;">(${driver.status.ratingCount})</span>
                    </div>
                </td>
                <td style="padding: 15px; text-align: center;">
                    <button onclick="editDriver('${driver.id}')" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 5px;">
                        ✏️ Bewerk
                    </button>
                    <button onclick="deleteDriver('${driver.id}')" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                        🗑️ Verwijder
                    </button>
                </td>
            `;
            
            return tr;
        }
        
        
        // WORKING DRIVER FUNCTIONS
        
        // Sample driver data
        drivers = JSON.parse(localStorage.getItem('taxiDrivers') || '[]');
        
        function addNewDriverWorking() {
            // WERKENDE VERSIE - GEKOPIEERD UIT SIMPLE-TEST
            const name = prompt('Naam van de nieuwe chauffeur:');
            if (!name) return;
            
            const phone = prompt('Telefoonnummer:', '+32');
            if (!phone) return;
            
            const email = prompt('Email adres:', name.toLowerCase().replace(' ', '.') + '@email.com');
            if (!email) return;
            
            const vehicle = prompt('Voertuig:', 'Toyota Prius');
            if (!vehicle) return;
            
            const newDriver = {
                id: 'DRV_' + Date.now(),
                name: name,
                phone: phone,
                email: email,
                vehicle: vehicle,
                status: 'offline',
                rating: 5.0,
                verified: true
            };
            
            // Get current drivers from localStorage
            let drivers = JSON.parse(localStorage.getItem('taxiDrivers') || '[]');
            drivers.push(newDriver);
            localStorage.setItem('taxiDrivers', JSON.stringify(drivers));
            
            // Refresh the drivers list
            if (typeof loadDriversList === 'function') {
                loadDriversList();
            }
            
            alert('✅ Chauffeur toegevoegd aan systeem!\n\nNaam: ' + name + '\nTelefoon: ' + phone + '\nEmail: ' + email + '\nVoertuig: ' + vehicle);
        }
    </script>
</body>
</html>
