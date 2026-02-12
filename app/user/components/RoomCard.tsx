import { Users, MapPin } from "lucide-react";
import Image from "next/image";

import type { Room } from "../pages/all-room-display";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm transition-all active:scale-95 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {room.image ? (
          <Image
            src={room.image}
            alt={room.name}
            fill 
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
            <span className="text-sm font-bold opacity-30">No Image</span>
          </div>
        )}
        
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-2">
            <h3 className="truncate text-base font-bold text-slate-800 group-hover:text-green-600">
            {room.name}
            </h3>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
            <div className="flex items-center">
                <Users className="mr-1 h-3.5 w-3.5 text-slate-400" />
                <span>{room.capacity}</span>
            </div>
            {room.location && (
                <div className="flex items-center">
                    <MapPin className="mr-1 h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate max-w-[80px]">{room.location}</span>
                </div>
            )}
        </div>
        {room.detail && (
          <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed mt-auto">
            {room.detail}
          </p>
        )}
      </div>
    </div>
  );
}