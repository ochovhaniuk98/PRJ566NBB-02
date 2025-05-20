import { NextResponse } from 'next/server';
import  dbConnect  from '@/lib/db/dbConnect';
import { User, BusinessUser } from '@/lib/model/dbSchema';

// Connect to MongoDB and Create user schema: Business vs General
// This function will be used on user Sign up: Once user click on sign up, the schema will be created and stored to the mongoDB

export async function POST(req) {
  try {
    const body = await req.json();
    const { supabaseId, userType } = body;

    if (!supabaseId) {
      return NextResponse.json({ message: 'Missing Supabase ID' }, { status: 400 });
    }

    await dbConnect();

    // Check both collections
    const existingUser =
      (await User.findOne({ supabaseId })) ||
      (await BusinessUser.findOne({ supabaseId }));

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 200 });
    }

    const Model = userType === 'business' ? BusinessUser : User;
    const newUser = new Model({ supabaseId, userType });

    await newUser.save();
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (err) {
    console.error('Create-user error:', err);
    return NextResponse.json({ message: 'Database error', error: err.message }, { status: 500 });
  }
}


// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).end();

//   const { supabaseId, userType } = req.body;

//   if (!supabaseId) {
//     return res.status(400).json({ message: 'Missing Supabase ID' });
//   }

//   await dbConnect();

//   const existingUser = await User.findOne({ supabaseId });
//   if (existingUser) {
//     return res.status(200).json({ message: 'User already exists' });
//   }

//   const userData = {
//     supabaseId,
//     userType,
//   };

//   try {
//     const newUser = new User(userData);
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Database error', error: error.message });
//   }
// }