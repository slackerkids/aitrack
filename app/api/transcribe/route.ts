// Next.js API Route
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      )
    }

    // Here you would handle the audio file
    // For now we'll return sample data
    const sampleTranscription = {
      transcript:
        "Dr. Berdyshev: What brings you in today?\n\nPatient: I've been having these headaches for about two weeks now.\n\nDr. Berdyshev: Can you describe the pain and where it's located?\n\nPatient: It's mostly in the front of my head. The pain is throbbing, I'd rate it around 7 out of 10.\n\nDr. Berdyshev: Are you experiencing any nausea or visual changes with these headaches?\n\nPatient: No, just the pain.\n\nDr. Berdyshev: Have you tried any medication?\n\nPatient: I've been taking ibuprofen, but it's not helping much.",
      document:
        "Assessment: Tension headache, possibly migraine.\n\nPlan:\n1) Complete neurological examination\n2) Consider prescription-strength analgesics\n3) Recommend stress reduction techniques\n4) Follow-up in two weeks if symptoms persist\n5) Consider referral to neurology if no improvement with treatment.",
    }

    // Return the sample data
    return NextResponse.json(sampleTranscription)
  } catch (error) {
    console.error("Error processing transcription:", error)
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    )
  }
}

