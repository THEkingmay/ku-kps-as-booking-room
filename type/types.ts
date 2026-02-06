type UserRole = 'admin' | 'user';
type RoomStatus = 'active' | 'maintenance' | 'inactive';
type ReservationStatus = 
  | 'reserved' 
  | 'occupied' 
  | 'done' 
  | 'cancelled' 
  | 'rejected';

export interface User {
  id: string;             // Text (PK)
  created_at: string;    
  email: string;
  role: UserRole;
  name: string;
  image: string | null; 
}

export interface Room {
  id: string;             // UUID
  name: string;
  detail: string | null;  
  capacity: number;
  location: string | null;
  image: string | null;
  status: RoomStatus;
  created_at: string;
}

export interface Reservation {
  id: string;             // UUID
  room_id: string;        // UUID (FK)
  user_id: string;        // Text (FK)
  date: string;           // Date string (YYYY-MM-DD)
  start_time: number;     // Integer (0-23)
  end_time: number;       // Integer (0-23)
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
}