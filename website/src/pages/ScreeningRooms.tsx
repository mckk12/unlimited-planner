// // showcase screening rooms for every cinema with descriptions for best sits
// import seats from "./seats.json";

// import { useMemo } from "react";

// const sits = JSON.parse(JSON.stringify(seats));

export default function ScreeningRooms() {
  return (
  <div>
    <h1 className="text-3xl font-bold mb-4">Screening Rooms</h1>
    <p className="mb-6">Explore the seating arrangements of various cinemas and find the best seats for your next movie experience.</p>
    <p className="mb-4"> Page currently in construction.</p>
  </div>);
}
  
// const { rd, S } = sits;

//   const prepared = useMemo(() => {
//     const seats: { key: string; x: any; y: any; seatNumber: any; rowNumber: any; isAccessible: boolean; tg: any; rotation: any; }[] = [];
//     const radius = rd?.seatRadius ?? 20;

//     let minX = Infinity;
//     let minY = Infinity;
//     let maxX = -Infinity;
//     let maxY = -Infinity;

//     Object.values(S || {}).forEach((section) => {
//       Object.values(section.G || {}).forEach((group) => {
//         const groupX = group?.rd?.x ?? 0;
//         const groupY = group?.rd?.y ?? 0;
//         const rotation = group?.rd?.rotate ?? 0;

//         Object.values(group.R || {}).forEach((row) => {
//           Object.values(row.S || {}).forEach((seat, index) => {
//             const x = groupX + (seat?.rd?.cx ?? 0);
//             const y = groupY + (seat?.rd?.cy ?? 0);

//             minX = Math.min(minX, x - radius);
//             minY = Math.min(minY, y - radius);
//             maxX = Math.max(maxX, x + radius);
//             maxY = Math.max(maxY, y + radius);

//             seats.push({
//               key: `${section.n}-${groupX}-${groupY}-${row.n}-${seat.n}-${index}`,
//               x,
//               y,
//               seatNumber: seat.n,
//               rowNumber: row.n,
//               isAccessible: !!(seat as any)?.hc,
//               tg: seat.tg,
//               rotation,
//             });
//           });
//         });
//       });
//     });

//     if (!seats.length) {
//       minX = 0;
//       minY = 0;
//       maxX = 500;
//       maxY = 300;
//     }

//     const padding = 20;

//     return {
//       seats,
//       viewBox: {
//         x: minX - padding,
//         y: minY - padding,
//         width: maxX - minX + padding * 2,
//         height: maxY - minY + padding * 2,
//       },
//       radius,
//     };
//   }, [S, rd]);

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: 1200,
//         margin: "0 auto",
//         background: "#111",
//         padding: 16,
//         borderRadius: 12,
//       }}
//     >
//       <svg
//         width="100%"
//         viewBox={`${prepared.viewBox.x} ${prepared.viewBox.y} ${prepared.viewBox.width} ${prepared.viewBox.height}`}
//         preserveAspectRatio="xMidYMid meet"
//         style={{ display: "block", background: "#1a1a1a" }}
//       >
//         {prepared.seats.map((seat) => (
//           <g
//             key={seat.key}
//             onClick={() =>
//               console.log(`Rząd ${seat.rowNumber}, miejsce ${seat.seatNumber}`)
//             }
//             style={{ cursor: "pointer" }}
//           >
//             <circle
//               cx={seat.x}
//               cy={seat.y}
//               r={prepared.radius}
//               fill={seat.isAccessible ? "#22c55e" : "#3b82f6"}
//               stroke="#fff"
//               strokeWidth="2"
//             />
//             <text
//               x={seat.x}
//               y={seat.y}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fontSize="14"
//               fill="#fff"
//               pointerEvents="none"
//             >
//               {seat.seatNumber}
//             </text>
//           </g>
//         ))}
//       </svg>
//     </div>
//   );
// }