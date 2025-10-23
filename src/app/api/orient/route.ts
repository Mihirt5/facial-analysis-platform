import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// GET /api/orient?url=<encoded-url>
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    const ref = req.nextUrl.searchParams.get("ref");
    const preferPortrait = req.nextUrl.searchParams.get("preferPortrait");
    const rotateParam = req.nextUrl.searchParams.get("rotate");
    if (!url) {
      return new NextResponse("Missing url param", { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return new NextResponse(`Failed to fetch source: ${response.status}`, { status: 502 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const input = Buffer.from(arrayBuffer);

    // If explicit rotation is requested, perform an absolute physical rotation
    // and DO NOT auto-rotate based on EXIF. This ensures both images undergo
    // the exact same transformation regardless of differing EXIF tags.
    let target = rotateParam ? sharp(input) : sharp(input).rotate();

    if (rotateParam) {
      const rp = rotateParam.toLowerCase();
      if (rp === "ccw90" || rp === "-90") target = target.rotate(-90);
      else if (rp === "cw90" || rp === "90") target = target.rotate(90);
      else if (rp === "180") target = target.rotate(180);
      // Skip ref/preferPortrait logic when explicit rotation is set
    } else {
      // Optional: if a reference is provided, orient target to match ref's aspect (portrait/landscape)
      if (ref) {
        try {
          const refResp = await fetch(ref);
          if (refResp.ok) {
            const refBuf = Buffer.from(await refResp.arrayBuffer());
            const refMeta = await sharp(refBuf).rotate().metadata();
            const targetMeta = await target.metadata();
            const refPortrait = (refMeta.height ?? 0) >= (refMeta.width ?? 0);
            const targetPortrait = (targetMeta.height ?? 0) >= (targetMeta.width ?? 0);
            if (refPortrait !== targetPortrait) {
              // Rotate -90deg (counter-clockwise) to flip orientation class
              target = target.rotate(-90);
            }
          }
        } catch (e) {
          // Non-fatal: fall back to default behavior
        }
      } else if (preferPortrait) {
        // Optional: gently coerce portrait for user photos if desired
        const meta = await target.metadata();
        if ((meta.width ?? 0) > (meta.height ?? 0)) {
          target = target.rotate(-90);
        }
      }
    }

    const oriented = await target.jpeg({ quality: 92 }).toBuffer();

    return new NextResponse(oriented, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        // Reduce caching to avoid stale orientation during iterations
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch (err) {
    console.error("/api/orient error", err);
    return new NextResponse("Orientation failed", { status: 500 });
  }
}
