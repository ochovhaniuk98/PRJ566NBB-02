import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import { User, BusinessUser } from '@/lib/model/dbSchema';


export async function POST(req) {
  try {
    const body = await req.json();
    const { supabaseId } = body;

    if (!supabaseId) {
      return NextResponse.json({ message: 'Missing Supabase ID' }, { status: 400 });
    }

    await dbConnect();

    let user = await User.findOne({ supabaseId });
    if (!user) user = await BusinessUser.findOne({ supabaseId });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ userType: user.userType }, { status: 200 });

  } catch (err) {
    console.error('Error fetching userType:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).end();

//   const { supabaseId } = req.body;
//   if (!supabaseId) return res.status(400).json({ message: 'Missing Supabase ID' });

//   await dbConnect();

//   let user = await User.findOne({ supabaseId });
//   if (!user) user = await BusinessUser.findOne({ supabaseId });

//   if (!user) return res.status(404).json({ message: 'User not found' });

//   return res.status(200).json({ userType: user.userType });
// }