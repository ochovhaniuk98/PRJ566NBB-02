import { NextResponse } from 'next/server';
import { User, Personalization } from '@/lib/model/dbSchema';
import dbConnect from '@/lib/db/dbConnect';

export async function POST(req) {
  try {
    await dbConnect()
    const body = await req.json();
    const {
      supabaseId,
      selectedCuisines,
      selectedDietaryPreferences,
      likelinessToTryFood,
      restaurantFrequency,
      decisionDifficulty,
      openToDiversity,
    } = body;

    if (
      !supabaseId ||
      !selectedCuisines ||
      !selectedDietaryPreferences ||
      !likelinessToTryFood ||
      !restaurantFrequency ||
      !decisionDifficulty ||
      !openToDiversity
    ) {
      return NextResponse.json({ message: 'Incomplete form!' }, { status: 400 });
    }
    const user = await User.findOne({supabaseId: supabaseId})
    const personalization_id = user.personalization_id
 
    if (personalization_id != undefined){
        console.log((await Personalization.findById(personalization_id).lean()))
        return NextResponse.json({message: 'You have already completed the questionnaire!'}, {status: 400})
    }
    const personalizationDoc = new Personalization({
      selectedCuisines,
      selectedDietaryPreferences,
      likelinessToTryFood,
      restaurantFrequency,
      decisionDifficulty,
      openToDiversity,
    });
    user.personalization_id = personalizationDoc._id
    await personalizationDoc.save();
    await user.save();
    return NextResponse.json({ message: 'Questionnaire answers have been saved successfully' }, { status: 200 });

  } catch (err) {
    console.error('Error updating user profile:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
