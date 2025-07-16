import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { banUserId, numStrikes } = await req.json()

  if (!banUserId || typeof numStrikes !== 'number') {
    return NextResponse.json(
      { error: 'Missing or invalid userId or numStrikes' },
      { status: 400 }
    )
  }

  if (numStrikes < 4) {
    return NextResponse.json(
      { error: 'User does not meet strikes limitation' },
      { status: 403 }
    )
  }

  const { data, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(banUserId)
  if (getUserError || !data?.user) {
    return NextResponse.json({ error: 'User not found in Supabase' }, { status: 404 })
  }

  try {
    const banOperations = []

    // Operation 1: hide user's content (you can add more operations here)
    // banOperations.push(hideUserContent(banUserId)) // [SPRINT 4]

    // Operation 2: update user metadata (ban_status)
    banOperations.push(
      supabaseAdmin.auth.admin.updateUserById(banUserId, 
       { ban_duration: '168h' } // 
      ).then(({ error }) => {
        if (error) throw new Error('Failed to update user ban status: ' + error.message)
      })
    )

    // Run all operations in parallel
    await Promise.all(banOperations)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Ban user action failed:', err.message)
    return NextResponse.json(
      { error: `Ban user action failed: ${err.message}` },
      { status: 500 }
    )
  }
}

