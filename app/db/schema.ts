import { pgTable, uuid, text, integer, date , timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const userRoleEnum = pgEnum("user-role", ["user", "admin"]);
export const roomStatusEnum = pgEnum("room_status", ["active", "maintenance", "inactive"]);
export const reservationStatusEnum = pgEnum("reservation_status", ["reserved", "cancelled", "occupied" ,'rejected','done']);


export const users = pgTable("users", {
  id: text("id").primaryKey(), 
  email: varchar("email").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  detail: text("detail"),
  capacity: integer("capacity").default(1).notNull(),
  location: text("location"),
  image: text("image"),
  status: roomStatusEnum("status").default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }), 
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), 
  date: date('date') ,
  startTime: integer("start_time").notNull(), 
  endTime: integer("end_time").notNull(),
  status: reservationStatusEnum("status").default("reserved"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});


// 1 User จองได้หลาย Reservations (One-to-Many)
export const usersRelations = relations(users, ({ many }) => ({
  reservations: many(reservations),
}));

// 1 Room มีได้หลาย Reservations (One-to-Many)
export const roomsRelations = relations(rooms, ({ many }) => ({
  reservations: many(reservations),
}));

// 1 Reservation เป็นของ 1 User และ 1 Room (Many-to-One)
export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, {
    fields: [reservations.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [reservations.roomId],
    references: [rooms.id],
  }),
}));