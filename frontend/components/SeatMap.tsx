
import React from 'react';
import { Seat, SeatType, SeatStatus } from '../types';
import { Monitor, BookOpen, Armchair, Ban, Plus } from 'lucide-react';

interface SeatMapProps {
  seats: Seat[];
  bookingsForSlot: string[]; // List of seat IDs booked in currently selected slot
  onSeatClick: (seat: Seat) => void;
  selectedSeatId: string | null;
  isAdmin?: boolean;
  isEditMode?: boolean;
  onEmptySlotClick?: (x: number, y: number) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ 
  seats, 
  bookingsForSlot, 
  onSeatClick, 
  selectedSeatId, 
  isAdmin = false,
  isEditMode = false,
  onEmptySlotClick
}) => {
  
  const getSeatStatus = (seat: Seat): SeatStatus => {
    if (seat.isMaintenance) return SeatStatus.MAINTENANCE;
    if (bookingsForSlot.includes(seat.id)) return SeatStatus.BOOKED;
    return SeatStatus.AVAILABLE;
  };

  const getSeatStyleConfig = (type: SeatType, status: SeatStatus, isSelected: boolean, rotation: number) => {
    const baseClass = "relative w-full aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300";
    
    // 1. Determine Icon
    let Icon = Armchair;
    if (type === SeatType.PC) Icon = Monitor;
    if (type === SeatType.QUIET) Icon = BookOpen;

    // Apply rotation via style object to wrapper
    const style = { transform: `rotate(${rotation}deg)` };

    // 2. Determine Style based on State
    if (isSelected) {
      return {
        className: `${baseClass} bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-105 z-10`,
        icon: <Icon size={20} strokeWidth={2.5} />,
        style
      };
    }

    if (status === SeatStatus.MAINTENANCE) {
      return {
        className: `${baseClass} bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed`,
        icon: <Ban size={18} />,
        style
      };
    }

    if (status === SeatStatus.BOOKED && !isEditMode) {
      return {
        className: `${baseClass} bg-red-900/20 border-red-900/30 text-red-500 cursor-not-allowed`,
        icon: <Icon size={20} />,
        style
      };
    }

    // 3. Available State - Type specific styling
    switch (type) {
      case SeatType.PC:
        return {
          className: `${baseClass} bg-teal-950/40 border-teal-900/60 text-teal-400 hover:border-teal-500 hover:bg-teal-900/60 hover:shadow-lg hover:shadow-teal-900/20 cursor-pointer`,
          icon: <Icon size={20} />,
          style
        };
      case SeatType.QUIET:
        return {
          className: `${baseClass} bg-yellow-900/20 border-yellow-900/40 text-yellow-500 hover:border-yellow-600 hover:bg-yellow-900/40 hover:shadow-lg hover:shadow-yellow-900/20 cursor-pointer`,
          icon: <Icon size={20} />,
          style
        };
      default: // Standard
        return {
          className: `${baseClass} bg-slate-800 border-slate-700 text-slate-400 hover:border-primary/50 hover:text-white hover:bg-slate-700 hover:shadow-lg hover:shadow-primary/5 cursor-pointer`,
          icon: <Icon size={20} />,
          style
        };
    }
  };

  // Grid Generation Logic
  const COLS = 15; // Increased columns for the wider room layout
  const maxRow = Math.max(8, ...seats.map(s => s.y));
  const rows = isEditMode ? maxRow + 2 : maxRow + 1;

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < COLS; x++) {
        const seat = seats.find(s => s.x === x && s.y === y);
        const cellKey = `${x}-${y}`;

        if (seat) {
          const status = getSeatStatus(seat);
          const isSelected = selectedSeatId === seat.id;
          // In Edit Mode, we allow clicking even if booked/maintenance
          const isClickable = isAdmin || (status === SeatStatus.AVAILABLE);
          const config = getSeatStyleConfig(seat.type, status, isSelected, seat.rotation || 0);

          grid.push(
             <button
               key={cellKey}
               onClick={() => isClickable && onSeatClick(seat)}
               disabled={!isClickable}
               className={config.className}
               style={config.style}
               title={`${seat.type} - ${status} (Rot: ${seat.rotation}°)`}
             >
               {config.icon}
               <span className="text-[10px] font-bold mt-1 opacity-80">{seat.label}</span>
               {seat.isMaintenance && isAdmin && !isEditMode && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border-2 border-white"></span>
                  </span>
               )}
             </button>
          );
        } else {
          // Empty Slot
          if (isEditMode) {
             grid.push(
               <button
                 key={cellKey}
                 onClick={() => onEmptySlotClick && onEmptySlotClick(x, y)}
                 className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
               >
                 <Plus size={20} />
               </button>
             );
          } else {
             // Placeholder for alignment in non-edit mode
             grid.push(<div key={cellKey} className="w-full aspect-square" />);
          }
        }
      }
    }
    return grid;
  };

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <div className={`min-w-[800px] p-8 bg-dark-950/50 rounded-2xl border border-slate-800/60 transition-all ${isEditMode ? 'ring-2 ring-primary ring-offset-2 ring-offset-dark-900' : ''}`}>
        
        {/* Enhanced Legend */}
        {!isEditMode && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-dark-950 rounded-xl border border-slate-800 shadow-sm">
             <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-3 h-3 rounded-full bg-slate-700"></div> Maintenance
                   </div>
                   <div className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-3 h-3 rounded-full bg-red-900/50 border border-red-900"></div> Booked
                   </div>
                   <div className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/40"></div> Selected
                   </div>
                </div>
             </div>
             
             <div className="col-span-1 md:col-span-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Seat Types (Available)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   <div className="flex items-center gap-3 p-2 rounded-lg bg-dark-950 border border-slate-800">
                      <div className="p-2 rounded bg-teal-900/20 text-teal-400 border border-teal-900/30"><Monitor size={14}/></div>
                      <div className="text-sm">
                         <div className="font-medium text-slate-300">PC Station</div>
                         <div className="text-xs text-slate-500">Computer access</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-2 rounded-lg bg-dark-950 border border-slate-800">
                      <div className="p-2 rounded bg-yellow-900/20 text-yellow-500 border border-yellow-900/30"><BookOpen size={14}/></div>
                      <div className="text-sm">
                         <div className="font-medium text-slate-300">Quiet Zone</div>
                         <div className="text-xs text-slate-500">Silent study area</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-2 rounded-lg bg-dark-950 border border-slate-800">
                      <div className="p-2 rounded bg-slate-800 text-slate-400 border border-slate-700"><Armchair size={14}/></div>
                      <div className="text-sm">
                         <div className="font-medium text-slate-300">Standard</div>
                         <div className="text-xs text-slate-500">General seating</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {isEditMode && (
           <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm flex items-center justify-center animate-in fade-in">
              <span className="font-medium mr-2">Edit Mode Active:</span> Click a seat to select it. Click empty slots to add or move seats.
           </div>
        )}

        {/* Grid Area */}
        <div className="relative">
          {/* Updated grid columns to 15 */}
          <div className="grid grid-cols-15 gap-3 mx-auto max-w-5xl perspective-[1000px]" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
             {renderGrid()}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2">
            <div className="h-1 bg-slate-800 w-1/3 rounded-full shadow-inner"></div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-medium flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              Entrance
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            </div>
        </div>

      </div>
    </div>
  );
};
