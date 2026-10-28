export interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  color: string;
}

/**
 * Utilitas pembentuk dan penggerak bintang jatuh (shooting star) pada kanvas global.
 */
export function createShootingStar(width: number, height: number): ShootingStar {
  const colors = ['#22d3ee', '#a78bfa', '#f472b6', '#f8fafc'];
  return {
    x: Math.random() * width * 0.85,
    y: Math.random() * height * 0.45,
    length: 85 + Math.random() * 65,
    speed: 14 + Math.random() * 8,
    angle: Math.PI / 5 + (Math.random() - 0.5) * 0.18,
    opacity: 1,
    active: true,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

export function drawShootingStar(
  ctx: CanvasRenderingContext2D,
  star: ShootingStar,
): void {
  if (!star.active) return;

  const tailX = star.x - Math.cos(star.angle) * star.length;
  const tailY = star.y - Math.sin(star.angle) * star.length;

  const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
  grad.addColorStop(0, star.color);
  grad.addColorStop(0.3, 'rgba(34, 211, 238, 0.45)');
  grad.addColorStop(1, 'rgba(5, 3, 15, 0)');

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(star.x, star.y);
  ctx.lineTo(tailX, tailY);
  ctx.stroke();

  // Titik kepala bintang jatuh
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
