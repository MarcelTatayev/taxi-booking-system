// Vehicle data storage
let vehicles = [
    {
        id: 'saloon',
        name: 'Saloon',
        description: 'Comfort sedan for daily use',
        capacity: 4,
        rate: 55,
        status: 'active'
    },
    {
        id: 'estate',
        name: 'Estate',
        description: 'Station wagon with extra space',
        capacity: 4,
        rate: 65,
        status: 'active'
    },
    {
        id: 'minivan',
        name: 'Minivan',
        description: 'Perfect voor grotere groepen',
        capacity: 7,
        rate: 85,
        status: 'active'
    },
    {
        id: 'minivan-long',
        name: 'Minivan Long',
        description: 'Extra lange versie',
        capacity: 8,
        rate: 95,
        status: 'active'
    }
];

let editingVehicleId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadVehicles();
    syncToStep2();
});

function loadVehicles() {
    const saved = localStorage.getItem('taxiVehicles');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                vehicles = parsed;
            }
        } catch (e) {
            console.error('Error loading vehicles from localStorage:', e);
        }
    }
    renderVehicles();
}

function renderVehicles() {
    const grid = document.getElementById('vehiclesGrid');
    if (!grid) return;
    
    if (vehicles.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #7f8c8d;">
                <div style="font-size: 64px; margin-bottom: 20px;">🚗</div>
                <h3>No Vehicles Found</h3>
                <p>Click "Add New Vehicle" to start building your fleet</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = vehicles.map(vehicle => `
        <div class="vehicle-card">
            <div class="vehicle-header">
                <div class="vehicle-icon">🚗</div>
                <h3 class="vehicle-name">${vehicle.name}</h3>
            </div>
            
            <div class="vehicle-details">
                <div class="vehicle-detail">
                    <span>Description:</span>
                    <strong>${vehicle.description}</strong>
                </div>
                <div class="vehicle-detail">
                    <span>Capacity:</span>
                    <strong>${vehicle.capacity} passengers</strong>
                </div>
                <div class="vehicle-detail">
                    <span>Hourly Rate:</span>
                    <strong>€${vehicle.rate}</strong>
                </div>
                <div class="vehicle-detail">
                    <span>Status:</span>
                    <span class="status-badge status-active">Active</span>
                </div>
            </div>
            
            <div class="vehicle-actions">
                <button class="btn btn-small" onclick="editVehicle('${vehicle.id}')">✏️ Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteVehicle('${vehicle.id}')">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function openAddVehicleModal() {
    editingVehicleId = null;
    document.getElementById('modalTitle').textContent = 'Add New Vehicle';
    document.getElementById('vehicleForm').reset();
    document.getElementById('vehicleModal').style.display = 'flex';
}

function editVehicle(id) {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;
    
    editingVehicleId = id;
    document.getElementById('modalTitle').textContent = 'Edit Vehicle';
    document.getElementById('vehicleName').value = vehicle.name;
    document.getElementById('vehicleDescription').value = vehicle.description;
    document.getElementById('vehicleCapacity').value = vehicle.capacity;
    document.getElementById('vehicleRate').value = vehicle.rate;
    document.getElementById('vehicleModal').style.display = 'flex';
}

function deleteVehicle(id) {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    vehicles = vehicles.filter(v => v.id !== id);
    saveVehicles();
    renderVehicles();
    syncToStep2();
}

function closeVehicleModal() {
    document.getElementById('vehicleModal').style.display = 'none';
    editingVehicleId = null;
}

function saveVehicles() {
    localStorage.setItem('taxiVehicles', JSON.stringify(vehicles));
    console.log('✅ Vehicles saved to localStorage');
}

function syncToStep2() {
    // Convert vehicles to Step2 format
    const step2Format = vehicles.map(vehicle => ({
        vehicle: {
            id: vehicle.id,
            name: vehicle.name,
            passengers: vehicle.capacity,
            description: vehicle.description
        },
        pricing: {
            hourlyRate: vehicle.rate,
            basePrice: vehicle.rate,
            currency: 'EUR'
        },
        active: vehicle.status === 'active'
    }));
    
    localStorage.setItem('vehiclePricing', JSON.stringify({
        vehicles: step2Format,
        lastUpdated: new Date().toISOString()
    }));
    
    // Also save in taxiVehicles format for compatibility
    localStorage.setItem('taxiVehicles', JSON.stringify(vehicles));
    
    console.log('✅ Vehicles synced to Step2 format:', step2Format);
    
    // Update sync status
    const status = document.getElementById('syncStatus');
    if (status) {
        status.innerHTML = `✅ Vehicle data synchronized with Step2 booking system (${new Date().toLocaleTimeString()})`;
        status.style.background = '#d4edda';
        status.style.color = '#155724';
    }
}

// Handle form submission
document.getElementById('vehicleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('vehicleName').value.trim();
    const description = document.getElementById('vehicleDescription').value.trim();
    const capacity = parseInt(document.getElementById('vehicleCapacity').value);
    const rate = parseFloat(document.getElementById('vehicleRate').value);
    
    if (!name || !capacity || !rate) {
        alert('Please fill in all required fields');
        return;
    }
    
    const vehicleData = {
        id: editingVehicleId || name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description: description || `${name} vehicle`,
        capacity,
        rate,
        status: 'active'
    };
    
    if (editingVehicleId) {
        // Edit existing
        const index = vehicles.findIndex(v => v.id === editingVehicleId);
        if (index !== -1) {
            vehicles[index] = vehicleData;
        }
    } else {
        // Add new
        vehicles.push(vehicleData);
    }
    
    saveVehicles();
    renderVehicles();
    syncToStep2();
    closeVehicleModal();
    
    // Show success message
    const status = document.getElementById('syncStatus');
    if (status) {
        status.innerHTML = `✅ Vehicle "${name}" saved and synced successfully!`;
        status.style.background = '#d1ecf1';
        status.style.color = '#0c5460';
    }
});

// Close modal when clicking outside
document.getElementById('vehicleModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeVehicleModal();
    }
});