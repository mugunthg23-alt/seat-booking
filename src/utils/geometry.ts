import { ScreenLayout, SeatInfo, ViewQualityMetrics } from '../types';

export function calculateSeatCoordinates(
  row: string,
  num: number,
  layout: ScreenLayout,
  tier: 'Silver' | 'Gold' | 'Platinum',
  price: number
): SeatInfo {
  const rowIndex = layout.rows.indexOf(row);
  const totalRows = layout.rows.length;
  const seatsPerRow = layout.seatsPerRow;

  // Aisle offsets
  let aisleOffset = 0;
  layout.aisleGapsAfter.forEach((gap) => {
    if (num > gap) {
      aisleOffset += 0.8; // 0.8m gap for walkways
    }
  });

  const seatSpacing = 0.65; // 65cm per seat
  const rawX = (num - 1) * seatSpacing + aisleOffset;
  const totalRowWidth = (seatsPerRow - 1) * seatSpacing + layout.aisleGapsAfter.length * 0.8;
  const x = rawX - totalRowWidth / 2;

  // Rake angle elevation
  const rakeRadians = (layout.rakeAngleDeg * Math.PI) / 180;
  const zFromFirstRow = rowIndex * layout.rowDistanceMeters;
  const z = layout.screenDistanceMeters + zFromFirstRow;

  // Stepped height calculation (floor rises with rake angle)
  const floorY = Math.tan(rakeRadians) * zFromFirstRow;
  const eyeHeight = 1.15; // 1.15m eye level from seat base
  const y = floorY + eyeHeight;

  // Accessibility flags: front row corners are wheelchair accessible
  const isAccessible = row === layout.rows[0] && (num === 1 || num === seatsPerRow);

  return {
    id: `${row}-${num}`,
    row,
    number: num,
    tier,
    price,
    isAccessible,
    x,
    y,
    z,
  };
}

export function computeViewQuality(seat: SeatInfo, layout: ScreenLayout): ViewQualityMetrics {
  // Screen center is at (0, layout.screenHeightMeters / 2, 0)
  const screenCenterY = layout.screenHeightMeters * 0.45;
  const dx = seat.x;
  const dy = screenCenterY - seat.y;
  const dz = seat.z;

  const distanceMeters = Math.hypot(dx, dy, dz);

  // Horizontal angle relative to normal
  const horizontalAngleDeg = Math.round(Math.abs(Math.atan2(dx, dz) * (180 / Math.PI)) * 10) / 10;
  const verticalAngleDeg = Math.round(Math.abs(Math.atan2(dy, dz) * (180 / Math.PI)) * 10) / 10;

  // Apparent horizontal field of view of the screen
  const fovRad = 2 * Math.atan(layout.screenWidthMeters / (2 * seat.z));
  const fieldOfViewDeg = Math.round(fovRad * (180 / Math.PI));

  let label: ViewQualityMetrics['label'] = 'Ideal distance';
  let description = '';

  if (horizontalAngleDeg > 20) {
    label = 'Side angle';
    description = `${horizontalAngleDeg}° off-center angle. Good unobstructed view, slight side perspective.`;
  } else if (seat.z < layout.screenDistanceMeters + 1.8) {
    label = 'Close to screen';
    description = `Intense ${fieldOfViewDeg}° immersive field of view. Close sightlines for high-octane spectacle.`;
  } else if (seat.z > layout.screenDistanceMeters + layout.rowDistanceMeters * (layout.rows.length - 2.5)) {
    label = 'Far back';
    description = `Elevated wide panoramic view (${fieldOfViewDeg}° FOV). Balanced house perspective.`;
  } else {
    label = 'Ideal distance';
    description = `Optimal SMPTE/THX zone (${fieldOfViewDeg}° FOV). Center sweet-spot for picture and audio balance.`;
  }

  return {
    label,
    distanceMeters: Math.round(distanceMeters * 10) / 10,
    horizontalAngleDeg,
    verticalAngleDeg,
    fieldOfViewDeg,
    description,
  };
}

// Procedural high-contrast cinema canvas texture with authentic movie poster artwork
import { getMoviePosterCanvas } from './posters';

export function createCinematicScreenCanvas(
  title: string,
  tagline: string,
  accentColor: string = '#C8A35B',
  movieId?: string
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2400;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d')!;

  // 1. Cinematic theatrical background
  const grad = ctx.createLinearGradient(0, 0, 2400, 1200);
  grad.addColorStop(0, '#060810');
  grad.addColorStop(0.25, '#121826');
  grad.addColorStop(0.75, '#181724');
  grad.addColorStop(1, '#070912');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2400, 1200);

  // 2. Anamorphic lens flare & projector illumination beam
  const flareGrad = ctx.createRadialGradient(1200, 600, 80, 1200, 600, 1100);
  flareGrad.addColorStop(0, 'rgba(255, 235, 175, 0.42)');
  flareGrad.addColorStop(0.4, 'rgba(200, 163, 91, 0.18)');
  flareGrad.addColorStop(1, 'rgba(6, 8, 16, 0)');
  ctx.fillStyle = flareGrad;
  ctx.fillRect(0, 0, 2400, 1200);

  // 3. Render the Authentic Movie Poster Image on Screen (Synchronous Canvas to Canvas)
  try {
    const posterCanvas = getMoviePosterCanvas(movieId || 'mov-1');
    const posterW = 540;
    const posterH = 810;
    const posterX = 220;
    const posterY = 195;

    // Poster soft back-glow & drop shadow
    ctx.shadowColor = 'rgba(200, 163, 91, 0.55)';
    ctx.shadowBlur = 45;
    ctx.drawImage(posterCanvas, posterX, posterY, posterW, posterH);
    ctx.shadowBlur = 0; // reset shadow

    // Polished gold cinema border around the theatrical poster
    ctx.strokeStyle = '#C8A35B';
    ctx.lineWidth = 6;
    ctx.strokeRect(posterX, posterY, posterW, posterH);

    // Inner subtle bright trim
    ctx.strokeStyle = 'rgba(255, 245, 215, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(posterX + 4, posterY + 4, posterW - 8, posterH - 8);

    // Right Side: Feature Presentation Typography & Specs
    const textStartX = 840;

    // Presentation Pill Badge
    ctx.fillStyle = accentColor;
    ctx.font = '700 28px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.letterSpacing = '8px';
    ctx.fillText('FEATURE PRESENTATION • NOW PLAYING', textStartX, 300);

    // Title (bold, crisp, high contrast)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 86px Georgia, serif';
    ctx.letterSpacing = '2px';

    // Wrap long titles if necessary
    if (title.length > 20) {
      const parts = title.split(':');
      if (parts.length > 1) {
        ctx.fillText(parts[0].toUpperCase(), textStartX, 410);
        ctx.fillStyle = accentColor;
        ctx.font = '800 58px Georgia, serif';
        ctx.fillText(parts.slice(1).join(':').trim().toUpperCase(), textStartX, 485);
      } else {
        ctx.font = '900 68px Georgia, serif';
        ctx.fillText(title.toUpperCase(), textStartX, 420);
      }
    } else {
      ctx.fillText(title.toUpperCase(), textStartX, 420);
    }

    // Tagline in elegant italics
    ctx.fillStyle = '#E5DFD5';
    ctx.font = 'italic 500 36px Georgia, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(`"${tagline}"`, textStartX, 560);

    // Gold divider rule
    ctx.strokeStyle = 'rgba(200, 163, 91, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(textStartX, 620);
    ctx.lineTo(2180, 620);
    ctx.stroke();

    // Cinema Format Badges
    ctx.fillStyle = '#FAF7F0';
    ctx.font = '700 24px monospace';
    ctx.letterSpacing = '3px';
    ctx.fillText('IMAX WITH LASER • 4K HIGH FRAME RATE', textStartX, 690);

    ctx.fillStyle = accentColor;
    ctx.fillText('DOLBY ATMOS 12.1 IMMERSIVE MULTI-CHANNEL SURROUND', textStartX, 740);

    ctx.fillStyle = 'rgba(226, 221, 211, 0.75)';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('SeatView Certified Sightline & Optimal Sound Field Architecture', textStartX, 810);

    // Verification Seal / Watermark
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(textStartX, 860, 480, 52);
    ctx.fillStyle = '#FAF7F0';
    ctx.font = '700 18px monospace';
    ctx.fillText('SEATVIEW 3D SIGHTLINE VERIFIED', textStartX + 30, 893);
  } catch {
    drawFallbackScreen(ctx, title, tagline, accentColor);
  }

  // 4. Subtle 2.39:1 scope cinema masking lines
  ctx.strokeStyle = 'rgba(200, 163, 91, 0.45)';
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 30, 2340, 1140);

  return canvas;
}

function drawFallbackScreen(
  ctx: CanvasRenderingContext2D,
  title: string,
  tagline: string,
  accentColor: string
) {
  ctx.fillStyle = accentColor;
  ctx.font = '700 30px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillText('SEATVIEW CINEMATIC PREVIEW • 4K LASER PROJECTION', 1200, 240);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 96px Georgia, serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(title.toUpperCase(), 1200, 540);

  ctx.fillStyle = 'rgba(243, 239, 230, 0.9)';
  ctx.font = 'italic 500 40px Georgia, serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(`"${tagline}"`, 1200, 640);
}
