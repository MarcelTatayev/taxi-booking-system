// Driver Classes - Complete Professional Driver Management System

// Base Driver Class
class Driver {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        
        // Persoonlijke gegevens
        this.personal = new DriverPersonalInfo(data.personal);
        
        // Documenten
        this.documents = new DriverDocuments(data.documents);
        
        // Voertuig
      
      
        this.vehicle = new DriverVehicle(data.vehicle);
        
        // Werk info
        this.workSchedule = new DriverSchedule(data.workSchedule);
        
        // Account
        this.account = new DriverAccount(data.account);
        
        // Status tracking
        this.status = new DriverStatus(data.status);
        
        // Verdiensten
        this.earnings = new DriverEarnings(data.earnings);
        
        // Timestamps
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }
    
    generateId() {
        return 'DRV_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    validate() {
        const errors = [];
        
        // Validate all sub-classes
        errors.push(...this.personal.validate());
        errors.push(...this.documents.validate());
        errors.push(...this.vehicle.validate());
        errors.push(...this.account.validate());
        
        return errors;
    }
    
    canAcceptRides() {
        return this.status.isActive && 
               this.documents.isVerified() && 
               this.vehicle.isValid();
    }
    
    toJSON() {
        return {
            id: this.id,
            personal: this.personal.toJSON(),
            documents: this.documents.toJSON(),
            vehicle: this.vehicle.toJSON(),
            workSchedule: this.workSchedule.toJSON(),
            account: this.account.toJSON(),
            status: this.status.toJSON(),
            earnings: this.earnings.toJSON(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

// Driver Personal Info Class
class DriverPersonalInfo {
    constructor(data = {}) {
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.dateOfBirth = data.dateOfBirth || '';
        this.bsn = data.bsn || '';
        this.phone = data.phone || '';
        this.email = data.email || '';
        this.address = new Address(data.address);
        this.emergencyContact = new EmergencyContact(data.emergencyContact);
        this.profilePhoto = data.profilePhoto || '';
    }
    
    getFullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }
    
    validate() {
        const errors = [];
        
        if (!this.firstName) errors.push('Voornaam is verplicht');
        if (!this.lastName) errors.push('Achternaam is verplicht');
        if (!this.phone) errors.push('Telefoonnummer is verplicht');
        if (!this.email) errors.push('Email is verplicht');
        if (!this.isValidEmail()) errors.push('Ongeldig email adres');
        
        errors.push(...this.address.validate());
        
        return errors;
    }
    
    isValidEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }
    
    toJSON() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.getFullName(),
            dateOfBirth: this.dateOfBirth,
            bsn: this.bsn,
            phone: this.phone,
            email: this.email,
            address: this.address.toJSON(),
            emergencyContact: this.emergencyContact.toJSON(),
            profilePhoto: this.profilePhoto
        };
    }
}

// Address Class
class Address {
    constructor(data = {}) {
        this.street = data.street || '';
        this.houseNumber = data.houseNumber || '';
        this.postalCode = data.postalCode || '';
        this.city = data.city || '';
        this.country = data.country || 'Nederland';
    }
    
    validate() {
        const errors = [];
        
        if (!this.street) errors.push('Straatnaam is verplicht');
        if (!this.houseNumber) errors.push('Huisnummer is verplicht');
        if (!this.postalCode) errors.push('Postcode is verplicht');
        if (!this.city) errors.push('Plaats is verplicht');
        
        return errors;
    }
    
    getFullAddress() {
        return `${this.street} ${this.houseNumber}, ${this.postalCode} ${this.city}`;
    }
    
    toJSON() {
        return {
            street: this.street,
            houseNumber: this.houseNumber,
            postalCode: this.postalCode,
            city: this.city,
            country: this.country,
            fullAddress: this.getFullAddress()
        };
    }
}

// Emergency Contact Class
class EmergencyContact {
    constructor(data = {}) {
        this.name = data.name || '';
        this.relationship = data.relationship || '';
        this.phone = data.phone || '';
    }
    
    validate() {
        const errors = [];
        
        if (this.name && !this.phone) {
            errors.push('Noodcontact telefoonnummer is verplicht');
        }
        
        return errors;
    }
    
    toJSON() {
        return {
            name: this.name,
            relationship: this.relationship,
            phone: this.phone
        };
    }
}

// Driver Documents Class
class DriverDocuments {
    constructor(data = {}) {
        this.driverLicense = new DriverLicense(data.driverLicense);
        this.taxiPass = new TaxiPass(data.taxiPass);
        this.verificationStatus = data.verificationStatus || 'pending';
        this.verifiedBy = data.verifiedBy || null;
        this.verifiedAt = data.verifiedAt || null;
    }
    
    isVerified() {
        return this.verificationStatus === 'verified' &&
               this.driverLicense.isValid() &&
               this.taxiPass.isValid();
    }
    
    validate() {
        const errors = [];
        
        errors.push(...this.driverLicense.validate());
        errors.push(...this.taxiPass.validate());
        
        return errors;
    }
    
    toJSON() {
        return {
            driverLicense: this.driverLicense.toJSON(),
            taxiPass: this.taxiPass.toJSON(),
            verificationStatus: this.verificationStatus,
            verifiedBy: this.verifiedBy,
            verifiedAt: this.verifiedAt,
            isVerified: this.isVerified()
        };
    }
}

// Driver License Class
class DriverLicense {
    constructor(data = {}) {
        this.number = data.number || '';
        this.issueDate = data.issueDate || '';
        this.expiryDate = data.expiryDate || '';
        this.categories = data.categories || ['B'];
        this.documentPhoto = data.documentPhoto || '';
    }
    
    isValid() {
        if (!this.expiryDate) return false;
        const expiry = new Date(this.expiryDate);
        return expiry > new Date();
    }
    
    validate() {
        const errors = [];
        
        if (!this.number) errors.push('Rijbewijs nummer is verplicht');
        if (!this.expiryDate) errors.push('Rijbewijs vervaldatum is verplicht');
        if (!this.isValid()) errors.push('Rijbewijs is verlopen');
        
        return errors;
    }
    
    toJSON() {
        return {
            number: this.number,
            issueDate: this.issueDate,
            expiryDate: this.expiryDate,
            categories: this.categories,
            documentPhoto: this.documentPhoto,
            isValid: this.isValid()
        };
    }
}

// Taxi Pass Class
class TaxiPass {
    constructor(data = {}) {
        this.number = data.number || '';
        this.issueDate = data.issueDate || '';
        this.expiryDate = data.expiryDate || '';
        this.issuingAuthority = data.issuingAuthority || '';
        this.documentPhoto = data.documentPhoto || '';
    }
    
    isValid() {
        if (!this.expiryDate) return false;
        const expiry = new Date(this.expiryDate);
        return expiry > new Date();
    }
    
    validate() {
        return [];
    }
    
    toJSON() {
        return {
            number: this.number,
            issueDate: this.issueDate,
            expiryDate: this.expiryDate,
            issuingAuthority: this.issuingAuthority,
            documentPhoto: this.documentPhoto,
            isValid: this.isValid()
        };
    }
}

// VOG (Verklaring Omtrent Gedrag) Class
class VOG {
    constructor(data = {}) {
        this.issueDate = data.issueDate || '';
        this.documentNumber = data.documentNumber || '';
        this.documentPhoto = data.documentPhoto || '';
    }
    
    isValid() {
        if (!this.issueDate) return false;
        const issue = new Date(this.issueDate);
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
        return issue > threeYearsAgo;
    }
    
    validate() {
        return [];
    }
    
    toJSON() {
        return {
            issueDate: this.issueDate,
            documentNumber: this.documentNumber,
            documentPhoto: this.documentPhoto,
            isValid: this.isValid()
        };
    }
}

// Medical Certificate Class
class MedicalCertificate {
    constructor(data = {}) {
        this.issueDate = data.issueDate || '';
        this.expiryDate = data.expiryDate || '';
        this.doctorName = data.doctorName || '';
        this.documentPhoto = data.documentPhoto || '';
    }
    
    isValid() {
        if (!this.expiryDate) return true; // Optional document
        const expiry = new Date(this.expiryDate);
        return expiry > new Date();
    }
    
    toJSON() {
        return {
            issueDate: this.issueDate,
            expiryDate: this.expiryDate,
            doctorName: this.doctorName,
            documentPhoto: this.documentPhoto,
            isValid: this.isValid()
        };
    }
}

// Driver Vehicle Class
class DriverVehicle {
    constructor(data = {}) {
        this.brand = data.brand || '';
        this.model = data.model || '';
        this.year = data.year || '';
        this.licensePlate = data.licensePlate || '';
        this.color = data.color || '';
        this.seats = data.seats || 4;
        this.vehicleType = data.vehicleType || 'sedan';
        this.photos = data.photos || [];
    }
    
    isValid() {
        return true; // Always valid without insurance and apk
    }
    
    validate() {
        return [];
    }
    
    toJSON() {
        return {
            brand: this.brand,
            model: this.model,
            year: this.year,
            licensePlate: this.licensePlate,
            color: this.color,
            seats: this.seats,
            vehicleType: this.vehicleType,
            photos: this.photos,
            displayName: `${this.brand} ${this.model} (${this.licensePlate})`
        };
    }
}

// Vehicle Insurance Class
class VehicleInsurance {
    constructor(data = {}) {
        this.company = data.company || '';
        this.policyNumber = data.policyNumber || '';
        this.expiryDate = data.expiryDate || '';
        this.coverage = data.coverage || 'WA+';
        this.documentPhoto = data.documentPhoto || '';
    }
    
    isValid() {
        if (!this.expiryDate) return false;
        const expiry = new Date(this.expiryDate);
        return expiry > new Date();
    }
    
    validate() {
        return [];
    }
    
    toJSON() {
        return {
            company: this.company,
            policyNumber: this.policyNumber,
            expiryDate: this.expiryDate,
            coverage: this.coverage,
            documentPhoto: this.documentPhoto,
            isValid: this.isValid()
        };
    }
}

// Vehicle APK Class
class VehicleAPK {
    constructor(data = {}) {
        this.expiryDate = data.expiryDate || '';
        this.documentPhoto = data.documentPhoto || '';
    }
    
    isValid() {
        if (!this.expiryDate) return false;
        const expiry = new Date(this.expiryDate);
        return expiry > new Date();
    }
    
    validate() {
        return [];
    }
    
    toJSON() {
        return {
            expiryDate: this.expiryDate,
            documentPhoto: this.documentPhoto,
            isValid: this.isValid()
        };
    }
}

// Driver Schedule Class
class DriverSchedule {
    constructor(data = {}) {
        this.monday = new WorkDay(data.monday);
        this.tuesday = new WorkDay(data.tuesday);
        this.wednesday = new WorkDay(data.wednesday);
        this.thursday = new WorkDay(data.thursday);
        this.friday = new WorkDay(data.friday);
        this.saturday = new WorkDay(data.saturday);
        this.sunday = new WorkDay(data.sunday);
        this.vacations = data.vacations || [];
    }
    
    isWorkingToday() {
        const today = new Date();
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
        return this[dayName].isActive;
    }
    
    getCurrentShift() {
        if (!this.isWorkingToday()) return null;
        
        const now = new Date();
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        return this[dayName].getShiftForTime(now);
    }
    
    toJSON() {
        return {
            monday: this.monday.toJSON(),
            tuesday: this.tuesday.toJSON(),
            wednesday: this.wednesday.toJSON(),
            thursday: this.thursday.toJSON(),
            friday: this.friday.toJSON(),
            saturday: this.saturday.toJSON(),
            sunday: this.sunday.toJSON(),
            vacations: this.vacations
        };
    }
}

// Work Day Class
class WorkDay {
    constructor(data = {}) {
        this.isActive = data.isActive !== undefined ? data.isActive : false;
        this.shifts = data.shifts || [{start: '08:00', end: '18:00'}];
    }
    
    getShiftForTime(time) {
        const timeStr = time.toTimeString().substr(0, 5);
        
        for (const shift of this.shifts) {
            if (timeStr >= shift.start && timeStr <= shift.end) {
                return shift;
            }
        }
        
        return null;
    }
    
    toJSON() {
        return {
            isActive: this.isActive,
            shifts: this.shifts
        };
    }
}

// Driver Account Class
class DriverAccount {
    constructor(data = {}) {
        this.username = data.username || '';
        this.password = data.password || ''; // Should be hashed
        this.pin = data.pin || '';
        this.twoFactorEnabled = data.twoFactorEnabled || false;
        this.lastLogin = data.lastLogin || null;
        this.loginAttempts = data.loginAttempts || 0;
        this.isLocked = data.isLocked || false;
    }
    
    validate() {
        const errors = [];
        
        if (!this.username) errors.push('Gebruikersnaam is verplicht');
        if (!this.password) errors.push('Wachtwoord is verplicht');
        if (this.pin && this.pin.length !== 4) errors.push('PIN moet 4 cijfers zijn');
        
        return errors;
    }
    
    checkCredentials(username, password) {
        // In production, compare hashed passwords
        return this.username === username && this.password === password && !this.isLocked;
    }
    
    recordLogin() {
        this.lastLogin = new Date();
        this.loginAttempts = 0;
    }
    
    recordFailedLogin() {
        this.loginAttempts++;
        if (this.loginAttempts >= 5) {
            this.isLocked = true;
        }
    }
    
    toJSON() {
        return {
            username: this.username,
            password: this.password, // Should not expose in real app
            pin: this.pin,
            twoFactorEnabled: this.twoFactorEnabled,
            lastLogin: this.lastLogin,
            loginAttempts: this.loginAttempts,
            isLocked: this.isLocked
        };
    }
}

// Driver Status Class
class DriverStatus {
    constructor(data = {}) {
        this.currentStatus = data.currentStatus || 'offline'; // online, busy, break, offline
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.lastOnline = data.lastOnline || null;
        this.currentRideId = data.currentRideId || null;
        this.currentLocation = data.currentLocation || null;
        this.totalRides = data.totalRides || 0;
        this.todayRides = data.todayRides || 0;
        this.rating = data.rating || 5.0;
        this.ratingCount = data.ratingCount || 0;
    }
    
    setOnline() {
        this.currentStatus = 'online';
        this.lastOnline = new Date();
    }
    
    setOffline() {
        this.currentStatus = 'offline';
    }
    
    setBusy(rideId) {
        this.currentStatus = 'busy';
        this.currentRideId = rideId;
    }
    
    setAvailable() {
        this.currentStatus = 'online';
        this.currentRideId = null;
    }
    
    setBreak() {
        this.currentStatus = 'break';
    }
    
    updateLocation(lat, lng) {
        this.currentLocation = {
            latitude: lat,
            longitude: lng,
            timestamp: new Date()
        };
    }
    
    addRating(rating) {
        const totalRating = this.rating * this.ratingCount;
        this.ratingCount++;
        this.rating = (totalRating + rating) / this.ratingCount;
    }
    
    toJSON() {
        return {
            currentStatus: this.currentStatus,
            isActive: this.isActive,
            lastOnline: this.lastOnline,
            currentRideId: this.currentRideId,
            currentLocation: this.currentLocation,
            totalRides: this.totalRides,
            todayRides: this.todayRides,
            rating: this.rating,
            ratingCount: this.ratingCount
        };
    }
}

// Driver Earnings Class
class DriverEarnings {
    constructor(data = {}) {
        this.totalEarnings = data.totalEarnings || 0;
        this.todayEarnings = data.todayEarnings || 0;
        this.weekEarnings = data.weekEarnings || 0;
        this.monthEarnings = data.monthEarnings || 0;
        this.pendingPayout = data.pendingPayout || 0;
        this.transactions = data.transactions || [];
        this.commissionRate = data.commissionRate || 0.20; // 20% commission
    }
    
    addRideEarning(rideAmount) {
        const driverAmount = rideAmount * (1 - this.commissionRate);
        const commission = rideAmount * this.commissionRate;
        
        const transaction = {
            id: 'TRX_' + Date.now(),
            type: 'ride',
            rideAmount: rideAmount,
            driverAmount: driverAmount,
            commission: commission,
            timestamp: new Date()
        };
        
        this.transactions.push(transaction);
        this.totalEarnings += driverAmount;
        this.todayEarnings += driverAmount;
        this.weekEarnings += driverAmount;
        this.monthEarnings += driverAmount;
        this.pendingPayout += driverAmount;
        
        return transaction;
    }
    
    processPayout(amount) {
        if (amount > this.pendingPayout) {
            throw new Error('Payout amount exceeds pending balance');
        }
        
        const transaction = {
            id: 'PAY_' + Date.now(),
            type: 'payout',
            amount: amount,
            timestamp: new Date()
        };
        
        this.transactions.push(transaction);
        this.pendingPayout -= amount;
        
        return transaction;
    }
    
    getEarningsReport(period = 'today') {
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(0);
        }
        
        const relevantTransactions = this.transactions.filter(t => 
            new Date(t.timestamp) >= startDate && t.type === 'ride'
        );
        
        const totalAmount = relevantTransactions.reduce((sum, t) => sum + t.driverAmount, 0);
        const rideCount = relevantTransactions.length;
        
        return {
            period: period,
            totalAmount: totalAmount,
            rideCount: rideCount,
            averagePerRide: rideCount > 0 ? totalAmount / rideCount : 0,
            transactions: relevantTransactions
        };
    }
    
    toJSON() {
        return {
            totalEarnings: this.totalEarnings,
            todayEarnings: this.todayEarnings,
            weekEarnings: this.weekEarnings,
            monthEarnings: this.monthEarnings,
            pendingPayout: this.pendingPayout,
            transactions: this.transactions,
            commissionRate: this.commissionRate
        };
    }
}

// Driver Manager Class (Singleton)
class DriverManager {
    constructor() {
        if (DriverManager.instance) {
            return DriverManager.instance;
        }
        
        this.drivers = this.loadDrivers();
        DriverManager.instance = this;
    }
    
    loadDrivers() {
        const saved = localStorage.getItem('taxiDrivers');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                return data.map(d => new Driver(d));
            } catch (error) {
                console.error('Error loading drivers:', error);
                return [];
            }
        }
        return [];
    }
    
    saveDrivers() {
        try {
            const data = this.drivers.map(d => d.toJSON());
            localStorage.setItem('taxiDrivers', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving drivers:', error);
            return false;
        }
    }
    
    addDriver(driverData) {
        const driver = new Driver(driverData);
        const errors = driver.validate();
        
        if (errors.length > 0) {
            throw new Error('Validation failed: ' + errors.join(', '));
        }
        
        // Check for duplicate username
        const existingUsername = this.drivers.find(d => 
            d.account.username === driver.account.username
        );
        if (existingUsername) {
            throw new Error('Gebruikersnaam bestaat al');
        }
        
        // Check for duplicate email
        const existingEmail = this.drivers.find(d => 
            d.personal.email === driver.personal.email
        );
        if (existingEmail) {
            throw new Error('Email adres bestaat al');
        }
        
        this.drivers.push(driver);
        this.saveDrivers();
        return driver;
    }
    
    updateDriver(driverId, updates) {
        const index = this.drivers.findIndex(d => d.id === driverId);
        if (index === -1) {
            throw new Error('Driver not found');
        }
        
        const driver = this.drivers[index];
        
        // Update nested objects properly
        if (updates.personal) {
            Object.assign(driver.personal, updates.personal);
        }
        if (updates.documents) {
            Object.assign(driver.documents, updates.documents);
        }
        if (updates.vehicle) {
            Object.assign(driver.vehicle, updates.vehicle);
        }
        if (updates.workSchedule) {
            Object.assign(driver.workSchedule, updates.workSchedule);
        }
        if (updates.account) {
            Object.assign(driver.account, updates.account);
        }
        if (updates.status) {
            Object.assign(driver.status, updates.status);
        }
        
        driver.updatedAt = new Date();
        
        this.saveDrivers();
        return driver;
    }
    
    deleteDriver(driverId) {
        const index = this.drivers.findIndex(d => d.id === driverId);
        if (index === -1) {
            throw new Error('Driver not found');
        }
        
        this.drivers.splice(index, 1);
        this.saveDrivers();
        return true;
    }
    
    getDriver(driverId) {
        return this.drivers.find(d => d.id === driverId);
    }
    
    getDriverByUsername(username) {
        return this.drivers.find(d => d.account.username === username);
    }
    
    getAllDrivers() {
        return this.drivers;
    }
    
    getActiveDrivers() {
        return this.drivers.filter(d => 
            d.status.isActive && 
            d.documents.isVerified()
        );
    }
    
    getOnlineDrivers() {
        return this.drivers.filter(d => 
            d.status.currentStatus === 'online'
        );
    }
    
    getAvailableDrivers() {
        return this.drivers.filter(d => 
            d.status.currentStatus === 'online' && 
            !d.status.currentRideId &&
            d.documents.isVerified()
        );
    }
    
    assignDriverToRide(driverId, rideId) {
        const driver = this.getDriver(driverId);
        if (!driver) {
            throw new Error('Driver not found');
        }
        
        if (!driver.canAcceptRides()) {
            throw new Error('Driver cannot accept rides');
        }
        
        driver.status.setBusy(rideId);
        this.saveDrivers();
        return driver;
    }
    
    completeRide(driverId, rideId, rideAmount) {
        const driver = this.getDriver(driverId);
        if (!driver) {
            throw new Error('Driver not found');
        }
        
        driver.status.setAvailable();
        driver.status.totalRides++;
        driver.status.todayRides++;
        
        // Add earnings
        const transaction = driver.earnings.addRideEarning(rideAmount);
        
        this.saveDrivers();
        return transaction;
    }
    
    searchDrivers(query) {
        const searchTerm = query.toLowerCase();
        
        return this.drivers.filter(d => {
            const fullName = d.personal.getFullName().toLowerCase();
            const email = d.personal.email.toLowerCase();
            const phone = d.personal.phone;
            const licensePlate = d.vehicle.licensePlate.toLowerCase();
            
            return fullName.includes(searchTerm) ||
                   email.includes(searchTerm) ||
                   phone.includes(searchTerm) ||
                   licensePlate.includes(searchTerm);
        });
    }
}

// Export all classes
if (typeof window !== 'undefined') {
    window.DriverClasses = {
        Driver,
        DriverPersonalInfo,
        Address,
        EmergencyContact,
        DriverDocuments,
        DriverLicense,
        TaxiPass,
        VOG,
        MedicalCertificate,
        DriverVehicle,
        VehicleInsurance,
        VehicleAPK,
        DriverSchedule,
        WorkDay,
        DriverAccount,
        DriverStatus,
        DriverEarnings,
        DriverManager
    };
}