import sharp from 'sharp';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const INPUT = String.raw`C:\Users\smitp\.gemini\antigravity\brain\6a7b0021-1ed8-4c41-99b7-36af19654d1a\bluetax_linkedin_demo_1777990369884.webp`;
const FRAMES_DIR = String.raw`C:\Users\smitp\.gemini\antigravity\scratch\bluetax\frames_tmp`;
const OUTPUT = String.raw`C:\Users\smitp\Desktop\BlueTax_Demo.mp4`;
const FFMPEG = String.raw`C:\Users\smitp\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe`;

async function main() {
  if (!fs.existsSync(FRAMES_DIR)) fs.mkdirSync(FRAMES_DIR, { recursive: true });

  // Read animated webp and extract all frames
  const image = sharp(INPUT, { animated: true, limitInputPixels: false });
  const meta = await image.metadata();
  console.log('Pages:', meta.pages, 'Size:', meta.width, 'x', meta.height, 'Delay:', meta.delay);

  const pages = meta.pages || 1;

  for (let i = 0; i < pages; i++) {
    const framePath = path.join(FRAMES_DIR, `frame_${String(i).padStart(5, '0')}.png`);
    await sharp(INPUT, { animated: false, page: i, limitInputPixels: false })
      .png()
      .toFile(framePath);
    if (i % 20 === 0) process.stdout.write(`\rExtracting frame ${i}/${pages}`);
  }
  console.log('\nFrames extracted!');

  // Calculate fps from delay (delay is in ms per frame)
  const delayMs = (meta.delay && meta.delay[0]) ? meta.delay[0] : 40;
  const fps = Math.round(1000 / delayMs);
  console.log('FPS:', fps, 'Delay:', delayMs, 'ms');

  // Convert frames to MP4
  const cmd = `"${FFMPEG}" -framerate ${fps} -i "${FRAMES_DIR}\\frame_%05d.png" -vf "scale=1280:-2:flags=lanczos" -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart "${OUTPUT}" -y`;
  console.log('Converting to MP4...');
  execSync(cmd, { stdio: 'inherit' });

  // Cleanup
  fs.readdirSync(FRAMES_DIR).forEach(f => fs.unlinkSync(path.join(FRAMES_DIR, f)));
  fs.rmdirSync(FRAMES_DIR);

  console.log('\n✅ Done! Saved to:', OUTPUT);
}

main().catch(console.error);
