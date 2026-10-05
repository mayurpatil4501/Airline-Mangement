// Client-side fallback storage when running on static deployments (e.g. Vercel) without backend
export const DEFAULT_AIRPORTS = [
  { code: 'JLG', name: 'Jalgaon Airport', city: 'Jalgaon', display: 'Jalgaon (JLG)' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai', display: 'Mumbai (BOM)' },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', display: 'Pune (PNQ)' },
  { code: 'NAG', name: 'Dr. Babasaheb Ambedkar Intl', city: 'Nagpur', display: 'Nagpur (NAG)' },
  { code: 'IXU', name: 'Aurangabad (Chhatrapati Sambhajinagar)', city: 'Aurangabad', display: 'Aurangabad (IXU)' },
  { code: 'DEL', name: 'Indira Gandhi Intl', city: 'Delhi', display: 'Delhi (DEL)' },
  { code: 'BLR', name: 'Kempegowda Intl', city: 'Bengaluru', display: 'Bengaluru (BLR)' },
  { code: 'HYD', name: 'Rajiv Gandhi Intl', city: 'Hyderabad', display: 'Hyderabad (HYD)' },
  { code: 'CCU', name: 'Netaji Subhash Chandra Bose Intl', city: 'Kolkata', display: 'Kolkata (CCU)' },
  { code: 'MAA', name: 'Chennai Intl', city: 'Chennai', display: 'Chennai (MAA)' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel Intl', city: 'Ahmedabad', display: 'Ahmedabad (AMD)' },
  { code: 'GOI', name: 'Manohar Intl (Goa)', city: 'Goa', display: 'Goa (GOI)' }
];

export const DEFAULT_CONFIG = {
  id: 1,
  basePrice: 1000,
  pricePerKm: 5.0,
  fuelPricePerLiter: 100.0,
  fuelConsumptionPerKm: 0.05,
  serviceCharge: 200.0,
  taxPercentage: 5.0,
  co2EmissionFactor: 2.52,
  emissionFactorUnit: 'kg CO2/L',
  highDemandOccupancyThreshold: 75.0,
  lowDemandOccupancyThreshold: 40.0,
  surgeAdjustmentPercent: 12.0,
  discountAdjustmentPercent: 10.0,
  minHistoricalBookingsRequired: 3
};

const INITIAL_DEMO_USERS = [
  {
    id: 1,
    name: 'Jalgaon Airline Chief Admin',
    email: 'admin@jalgaon.aero',
    password: 'Admin@12345',
    role: 'ADMIN',
    createdAt: '2026-10-01 00:00:00'
  },
  {
    id: 2,
    name: 'Passenger Demo',
    email: 'passenger@example.com',
    password: 'User@12345',
    role: 'USER',
    createdAt: '2026-10-01 00:00:00'
  }
];

const INITIAL_DEMO_FLIGHTS = [
  {
    id: 1,
    flightNumber: 'JA-101',
    airline: 'Jalgaon Airline',
    aircraft: 'ATR 72-600',
    source: 'Jalgaon (JLG)',
    destination: 'Mumbai (BOM)',
    departureDate: '2026-10-08',
    departureTime: '08:00',
    arrivalDate: '2026-10-08',
    arrivalTime: '09:15',
    totalSeats: 72,
    availableSeats: 68,
    distance: 384,
    basePrice: 1000,
    fuelPricePerLiter: 100,
    fuelConsumptionPerKm: 0.05,
    pricePerKm: 5,
    serviceCharge: 200,
    taxPercentage: 5,
    calculatedPrice: 5292,
    status: 'Scheduled',
    fuelConsumedLiters: 19.2,
    totalEstimatedCo2Kg: 48.38,
    carbonMetrics: {
      fuelConsumedLiters: 19.2,
      totalCo2Kg: 48.38,
      co2PerPaxKg: 0.67,
      rating: 'A+'
    }
  },
  {
    id: 2,
    flightNumber: 'JA-205',
    airline: 'Jalgaon Airline',
    aircraft: 'Airbus A320neo',
    source: 'Jalgaon (JLG)',
    destination: 'Delhi (DEL)',
    departureDate: '2026-10-09',
    departureTime: '11:30',
    arrivalDate: '2026-10-09',
    arrivalTime: '13:45',
    totalSeats: 180,
    availableSeats: 142,
    distance: 980,
    basePrice: 1000,
    fuelPricePerLiter: 100,
    fuelConsumptionPerKm: 0.05,
    pricePerKm: 5,
    serviceCharge: 200,
    taxPercentage: 5,
    calculatedPrice: 11550,
    status: 'Scheduled',
    fuelConsumedLiters: 49.0,
    totalEstimatedCo2Kg: 123.48,
    carbonMetrics: {
      fuelConsumedLiters: 49.0,
      totalCo2Kg: 123.48,
      co2PerPaxKg: 0.69,
      rating: 'A'
    }
  },
  {
    id: 3,
    flightNumber: 'JA-310',
    airline: 'Jalgaon Airline',
    aircraft: 'ATR 72-600',
    source: 'Pune (PNQ)',
    destination: 'Hyderabad (HYD)',
    departureDate: '2026-10-06',
    departureTime: '14:00',
    arrivalDate: '2026-10-06',
    arrivalTime: '15:20',
    totalSeats: 72,
    availableSeats: 55,
    distance: 540,
    basePrice: 1000,
    fuelPricePerLiter: 100,
    fuelConsumptionPerKm: 0.05,
    pricePerKm: 5,
    serviceCharge: 200,
    taxPercentage: 5,
    calculatedPrice: 6930,
    status: 'Scheduled',
    fuelConsumedLiters: 27.0,
    totalEstimatedCo2Kg: 68.04,
    carbonMetrics: {
      fuelConsumedLiters: 27.0,
      totalCo2Kg: 68.04,
      co2PerPaxKg: 0.95,
      rating: 'B+'
    }
  }
];

class MockStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('jalgaon_mock_users')) {
      localStorage.setItem('jalgaon_mock_users', JSON.stringify(INITIAL_DEMO_USERS));
    }
    if (!localStorage.getItem('jalgaon_mock_flights')) {
      localStorage.setItem('jalgaon_mock_flights', JSON.stringify(INITIAL_DEMO_FLIGHTS));
    }
    if (!localStorage.getItem('jalgaon_mock_bookings')) {
      localStorage.setItem('jalgaon_mock_bookings', JSON.stringify([]));
    }
    if (!localStorage.getItem('jalgaon_mock_tickets')) {
      localStorage.setItem('jalgaon_mock_tickets', JSON.stringify([]));
    }
    if (!localStorage.getItem('jalgaon_mock_config')) {
      localStorage.setItem('jalgaon_mock_config', JSON.stringify(DEFAULT_CONFIG));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('jalgaon_mock_users') || '[]');
  }
  setUsers(users) {
    localStorage.setItem('jalgaon_mock_users', JSON.stringify(users));
  }

  getFlights() {
    return JSON.parse(localStorage.getItem('jalgaon_mock_flights') || '[]');
  }
  setFlights(flights) {
    localStorage.setItem('jalgaon_mock_flights', JSON.stringify(flights));
  }

  getBookings() {
    return JSON.parse(localStorage.getItem('jalgaon_mock_bookings') || '[]');
  }
  setBookings(bookings) {
    localStorage.setItem('jalgaon_mock_bookings', JSON.stringify(bookings));
  }

  getTickets() {
    return JSON.parse(localStorage.getItem('jalgaon_mock_tickets') || '[]');
  }
  setTickets(tickets) {
    localStorage.setItem('jalgaon_mock_tickets', JSON.stringify(tickets));
  }

  getConfig() {
    return JSON.parse(localStorage.getItem('jalgaon_mock_config') || JSON.stringify(DEFAULT_CONFIG));
  }
  setConfig(config) {
    localStorage.setItem('jalgaon_mock_config', JSON.stringify(config));
  }
}

export const mockStore = new MockStore();
