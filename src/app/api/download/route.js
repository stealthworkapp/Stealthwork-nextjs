export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("url");
    const filename = searchParams.get("filename") || "download.mp4";

    if (!videoUrl) {
      return new Response(JSON.stringify({ error: "Missing video URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch the video from the external source
    const videoResponse = await fetch(videoUrl);

    if (!videoResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch video" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stream the video to the client with a custom filename
    return new Response(videoResponse.body, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error in download API:", error);
    return new Response(
      JSON.stringify({ error: "Error processing download" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
