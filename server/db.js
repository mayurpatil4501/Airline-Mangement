import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'jalgaon_airline.db'));

// Foreign keys & WAL mode
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Ensure tables exist with extended AI, operations, and carbon metrics
db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER', -- 'ADMIN' or 'USER'
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Global & configurable Pricing, Fuel, Carbon and AI Configuration
  CREATE TABLE IF NOT EXISTS pricing_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    basePrice REAL NOT NULL DEFAULT 1000,
    pricePerKm REAL NOT NULL DEFAULT 5,
    fuelPricePerLiter REAL NOT NULL DEFAULT 100,
    fuelConsumptionPerKm REAL NOT NULL DEFAULT 0.05,
    serviceCharge REAL NOT NULL DEFAULT 200,
    taxPercentage REAL NOT NULL DEFAULT 5,
    -- Carbon Emission Configuration
    co2EmissionFactor REAL NOT NULL DEFAULT 2.52, -- kg CO2 per liter of jet fuel
    emissionFactorUnit TEXT NOT NULL DEFAULT 'kg CO2/L',
    -- AI Recommendation Parameters
    highDemandOccupancyThreshold REAL NOT NULL DEFAULT 75.0, -- %
    lowDemandOccupancyThreshold REAL NOT NULL DEFAULT 40.0, -- %
    surgeAdjustmentPercent REAL NOT NULL DEFAULT 12.0, -- %
    discountAdjustmentPercent REAL NOT NULL DEFAULT 10.0, -- %
    minHistoricalBookingsRequired INTEGER NOT NULL DEFAULT 3,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Flights table with Carbon & Status Tracking
  CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flightNumber TEXT UNIQUE NOT NULL,
    airline TEXT NOT NULL,
    aircraft TEXT NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    departureDate TEXT NOT NULL,
    departureTime TEXT NOT NULL,
    arrivalDate TEXT NOT NULL,
    arrivalTime TEXT NOT NULL,
    totalSeats INTEGER NOT NULL,
    availableSeats INTEGER NOT NULL,
    distance REAL NOT NULL,
    basePrice REAL NOT NULL,
    fuelPricePerLiter REAL NOT NULL,
    fuelConsumptionPerKm REAL NOT NULL,
    pricePerKm REAL NOT NULL,
    serviceCharge REAL NOT NULL,
    taxPercentage REAL NOT NULL,
    calculatedPrice REAL NOT NULL,
    -- Operational Status: 'Scheduled', 'Boarding', 'Departed', 'Arrived', 'Delayed', 'Cancelled', 'ACTIVE', 'INACTIVE'
    status TEXT NOT NULL DEFAULT 'Scheduled',
    -- Environmental & Fuel Telemetry
    fuelConsumedLiters REAL NOT NULL DEFAULT 0,
    totalEstimatedCo2Kg REAL NOT NULL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Bookings table
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookingId TEXT UNIQUE NOT NULL,
    userId INTEGER NOT NULL,
    flightId INTEGER NOT NULL,
    passengerCount INTEGER NOT NULL,
    pricePerPassenger REAL NOT NULL,
    totalAmount REAL NOT NULL,
    bookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'CANCELLED', 'COMPLETED'
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flightId) REFERENCES flights(id) ON DELETE CASCADE
  );

  -- Passengers table
  CREATE TABLE IF NOT EXISTS passengers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookingId TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    seatNumber TEXT,
    FOREIGN KEY (bookingId) REFERENCES bookings(bookingId) ON DELETE CASCADE
  );

  -- Tickets table
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticketId TEXT UNIQUE NOT NULL,
    bookingId TEXT NOT NULL,
    pnr TEXT UNIQUE NOT NULL,
    passengerDetails TEXT NOT NULL,
    qrCodeData TEXT,
    estimatedCo2PerPaxKg REAL DEFAULT 0,
    issueDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    FOREIGN KEY (bookingId) REFERENCES bookings(bookingId) ON DELETE CASCADE
  );
`);

// Check and add missing columns if upgrading an existing DB file
function upgradeColumns() {
  const flightCols = db.prepare("PRAGMA table_info(flights)").all().map(c => c.name);
  if (!flightCols.includes('fuelConsumedLiters')) {
    db.exec("ALTER TABLE flights ADD COLUMN fuelConsumedLiters REAL NOT NULL DEFAULT 0");
  }
  if (!flightCols.includes('totalEstimatedCo2Kg')) {
    db.exec("ALTER TABLE flights ADD COLUMN totalEstimatedCo2Kg REAL NOT NULL DEFAULT 0");
  }

  const ticketCols = db.prepare("PRAGMA table_info(tickets)").all().map(c => c.name);
  if (!ticketCols.includes('estimatedCo2PerPaxKg')) {
    db.exec("ALTER TABLE tickets ADD COLUMN estimatedCo2PerPaxKg REAL DEFAULT 0");
  }

  const configCols = db.prepare("PRAGMA table_info(pricing_config)").all().map(c => c.name);
  if (!configCols.includes('co2EmissionFactor')) {
    db.exec("ALTER TABLE pricing_config ADD COLUMN co2EmissionFactor REAL NOT NULL DEFAULT 2.52");
    db.exec("ALTER TABLE pricing_config ADD COLUMN emissionFactorUnit TEXT NOT NULL DEFAULT 'kg CO2/L'");
    db.exec("ALTER TABLE pricing_config ADD COLUMN highDemandOccupancyThreshold REAL NOT NULL DEFAULT 75.0");
    db.exec("ALTER TABLE pricing_config ADD COLUMN lowDemandOccupancyThreshold REAL NOT NULL DEFAULT 40.0");
    db.exec("ALTER TABLE pricing_config ADD COLUMN surgeAdjustmentPercent REAL NOT NULL DEFAULT 12.0");
    db.exec("ALTER TABLE pricing_config ADD COLUMN discountAdjustmentPercent REAL NOT NULL DEFAULT 10.0");
    db.exec("ALTER TABLE pricing_config ADD COLUMN minHistoricalBookingsRequired INTEGER NOT NULL DEFAULT 3");
  }
}

upgradeColumns();

// Seed initial default config if not present
const configCount = db.prepare('SELECT count(*) as count FROM pricing_config').get().count;
if (configCount === 0) {
  db.prepare(`
    INSERT INTO pricing_config (
      id, basePrice, pricePerKm, fuelPricePerLiter, fuelConsumptionPerKm, serviceCharge, taxPercentage,
      co2EmissionFactor, emissionFactorUnit, highDemandOccupancyThreshold, lowDemandOccupancyThreshold,
      surgeAdjustmentPercent, discountAdjustmentPercent, minHistoricalBookingsRequired
    ) VALUES (1, 1000, 5.0, 100.0, 0.05, 200.0, 5.0, 2.52, 'kg CO2/L', 75.0, 40.0, 12.0, 10.0, 3)
  `).run();
}

// Seed initial Admin if not present
const adminExists = db.prepare("SELECT id FROM users WHERE email = 'admin@jalgaon.aero'").get();
if (!adminExists) {
  const salt = bcrypt.genSaltSync(10);
  const hashedAdminPassword = bcrypt.hashSync('Admin@12345', salt);
  db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, 'ADMIN')
  `).run('Jalgaon Airline Chief Admin', 'admin@jalgaon.aero', hashedAdminPassword);
}

console.log('✅ SQLite Database schema verified and up-to-date with Carbon & AI parameters.');

export default db;
