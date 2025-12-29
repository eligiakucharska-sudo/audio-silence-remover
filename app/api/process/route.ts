import { NextResponse } from "next/server";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { exec } from "child_process";
import path from "path";
import ffmpegPath from "ffmpeg-static";
import util from "util";

const execAsync = util.promisify(exec);

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const id = uuid();
    const inputPath = path.join("/tmp", `${id}-in`);
    const outputPath = path.join("/tmp", `${id}-out.mp3`);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(inputPath, buffer);

    // Remove silence
    await execAsync(
      `"${ffmpegPath}" -i "${inputPath}" -af silenceremove=1:0:-50dB "${outputPath}" -y`
    );

    const { stdout: orig } = await execAsync(
      `"${ffmpegPath.replace("ffmpeg", "ffprobe")}" -i "${inputPath}" -show_entries format=duration -v quiet -of csv=p=0`
    );
    const { stdout: proc } = await execAsync(
      `"${ffmpegPath.replace("ffmpeg", "ffprobe")}" -i "${outputPath}" -show_entries format=duration -v quiet -of csv=p=0`
    );

    const removed = (parseFloat(orig) - parseFloat(proc)).toFixed(2);

    const fileData = fs.readFileSync(outputPath);
    // delete temp right away
    fs.unlinkSync(inputPath);
    setTimeout(() => fs.unlinkSync(outputPath), 60_000);

    return new NextResponse(fileData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "X-Removed-Seconds": removed,
        "Content-Disposition": "attachment; filename=processed.mp3"
      }
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "processing failed" });
  }
}
