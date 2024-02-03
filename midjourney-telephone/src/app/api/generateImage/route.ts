import { NextRequest, NextResponse } from 'next/server'

// export const config = {
//     runtime: 'edge',
//   }

export async function GET(
  req: NextRequest,
  res: NextResponse
) {

	const data = {
		"model": "stable-diffusion-xl-v1-0",
		"prompt": "a photo of an astronaut riding a horse on mars",
		"negative_prompt": "Disfigured, cartoon, blurry",
		"width": 512,
		"height": 512,
		"steps": 25,
		"guidance": 9,
		"output_format": "jpeg"
	  }

    try {
        
    } catch(e: any) {
        console.log(e)
        return NextResponse.json({status: "error", userData: null, error: e})
    }

    return NextResponse.json({status: "success"})
}