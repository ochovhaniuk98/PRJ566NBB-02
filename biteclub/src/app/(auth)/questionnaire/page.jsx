'use client';
import { useState, useRef } from 'react';
import { createClient } from '@/lib/auth/client';

const DIETARY_CONFIG = {
  title: 'DIETARY PREFERENCES',
  instructions: 'Select any dietary preferences and allergies you may have.',
  customSection: {
    missingPrompt: 'Missing something?',
    inputInstructions: 'Add your own preferences.',
    inputPlaceholder: 'Shellfish-free',
    buttonLabel: 'Add Preference',
  },
};

const CUISINE_CONFIG = {
  title: 'FAVOURITE CUISINES',
  instructions: 'Select your favourite cuisines.',
  customSection: {
    missingPrompt: 'Missing your favourites?',
    inputInstructions: 'Add your own cuisines.',
    inputPlaceholder: 'Icelandic',
    buttonLabel: 'Add Cuisine',
  },
};

export default function Questionnaire() {
  const [dietaryOptions, setDietaryOptions] = useState([
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Dairy-free',
    'Lactose-free',
    'Pescetarian',
    'Peanut-free',
    'Nut-free',
    'Carnivore',
    'Halal',
    'Kosher',
    'Gluten-free',
  ]);
  const [cuisineOptions, setCuisineOptions] = useState([
    'Canadian',
    'Thai',
    'Greek',
    'Japanese',
    'Korean',
    'Vietnamese',
    'Moroccan',
    'Lebanese',
    'Spanish',
    'Mexican',
    'French',
    'Caribbean',
    'Indonesian',
    'Cuban',
  ]);
  const [step, setStep] = useState(1);
  const FIRST_STEP = 1;
  const SECOND_STEP = 2;
  const FINAL_STEP = 3;

  // For the 1st page where favorite cuisines are selected
  const [selectedCuisines, setSelectedCuisines] = useState([]);

  // For the 2nd page where dietary preferences are selected
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState([]);

  // For the third page where the user answers questions on a likert scale about their personal preferences
  const DEFAULT_VALUE = 3;
  const [likelinessToTryFood, setLikelinessToTryFood] = useState(DEFAULT_VALUE);
  const [restaurantFrequency, setRestaurantFrequency] = useState(DEFAULT_VALUE);
  const [decisionDifficulty, setDecisionDifficulty] = useState(DEFAULT_VALUE);
  const [openToDiversity, setOpenToDiversity] = useState(DEFAULT_VALUE);
  const supabase = createClient();
  function nextStep() {
    if (step == FIRST_STEP){
      setStep(SECOND_STEP);
    } else if (step == SECOND_STEP) {
      setStep(FINAL_STEP)
    }
  }

  async function submit() {
    console.log(selectedCuisines, selectedDietaryPreferences);
    console.log(likelinessToTryFood);
    console.log(restaurantFrequency);
    console.log(decisionDifficulty);
    console.log(openToDiversity);
    const res = await fetch('/api/update-general-user-profile/questionnaire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supabaseId: (await supabase.auth.getUser()).data.user.id,
        selectedCuisines,
        selectedDietaryPreferences,
        likelinessToTryFood,
        restaurantFrequency,
        decisionDifficulty,
        openToDiversity,
      }),
    });
    if (res.status == 200){
      router.push("/")
    }
  }

  return (
    <div className="grid grid-cols-[55%_45%] h-screen relative">
      <div className="bg-black"></div>
      <div className="relative bg-[#fffbe6] p-[10%]">
        <div className="flex flex-col items-center">
          <h1 className="self-center text-xl font-extrabold">{step}</h1>
          <span className="self-center text-[8px]">STEP {step}/3</span>
        </div>
        {step == FIRST_STEP ? (
          <PreferencesSelector
            config={DIETARY_CONFIG}
            picked={selectedDietaryPreferences}
            setPicked={setSelectedDietaryPreferences}
            options={dietaryOptions}
            setOptions={setDietaryOptions}
          />
        ) : step == SECOND_STEP ? (
          <PreferencesSelector
            config={CUISINE_CONFIG}
            picked={selectedCuisines}
            setPicked={setSelectedCuisines}
            options={cuisineOptions}
            setOptions={setCuisineOptions}
          />
        ) : (
          <LikertScale
            likelinessToTryFood={likelinessToTryFood}
            setLikelinessToTryFood={setLikelinessToTryFood}
            restaurantFrequency={restaurantFrequency}
            setRestaurantFrequency={setRestaurantFrequency}
            decisionDifficulty={decisionDifficulty}
            setDecisionDifficulty={setDecisionDifficulty}
            openToDiversity={openToDiversity}
            setOpenToDiversity={setOpenToDiversity}
          />
        )}
        {step == 1 ? (
          <a href="/" className="absolute bottom-8.5 left-10.5">
            I'll do this later
          </a>
        ) : null}
        <button onClick={step != FINAL_STEP ? nextStep: submit} className="absolute bottom-8.5 right-10.5">
          {step != FINAL_STEP ? 'Next Step' : 'Complete'}
        </button>
      </div>
    </div>
  );
}

function PreferencesSelector({ config, picked, setPicked, options, setOptions }) {
  const customInput = useRef();

  const toggle = t => setPicked(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const addCustomSelection = () => {
    let value = customInput.current.value.trim();
    if (value == '') return;
    if (options.includes(value)) {
      alert('Value already exists!');
      return;
    }
    setPicked(p => [...p, value]);
    setOptions(o => [...o, value]);
  };

  return (
    <div className="flex flex-col">
      <h2 className="font-bold self-center">{config.title}</h2>
      <p className="text-sm">{config.instructions}</p>
      <div className="flex flex-wrap gap-2 p-4 rounded-2xl">
        {options.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            className={`inline-flex items-center gap-1 px-4 py-1 rounded-full text-sm font-semibold shadow-sm border-none transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8bc53f] ${
              picked.includes(t) ? 'bg-[#8bc53f] text-white' : 'bg-[#fff5df] text-[#06317b]'
            }`}
          >
            {t}
            <span className="text-blue-800 text-base ml-1">🐘</span>
          </button>
        ))}
      </div>
      <h2 className="font-semibold text-base">{config.customSection.missingPrompt}</h2>
      <p className="text-sm">{config.customSection.inputInstructions}</p>
      <input ref={customInput} className="rounded-3xl w-[40%]" placeholder={config.customSection.inputPlaceholder} />
      <button className="rounded-3xl bg-[#ffdcbe] w-[130px] text-sm py-[5px]" onClick={addCustomSelection}>
        {config.customSection.buttonLabel}
      </button>
    </div>
  );
}

function Scale({ value, setValue }) {
  const SELECTED_OPTION_STYLING = 'bg-[#80c001] h-[17px] w-[17px] rounded-full z-10';
  const UNSELECTED_OPTION_STYLING = 'bg-[#ffdcbe] h-[17px] w-[7px] rounded-xl z-10';
  const buttons = [];
  for (let i = 1; i <= 5; i++) {
    buttons.push(
      <button
        key={i}
        value={i}
        className={i == value ? SELECTED_OPTION_STYLING : UNSELECTED_OPTION_STYLING}
        onClick={e => {
          console.log(e.target.value);
          setValue(Number(e.target.value));
        }}
      />
    );
  }
  return (
    <>
      <div className="relative flex flex-row justify-between w-[80%] h-[17px]">
        <div className="self-center absolute bg-[#ffdcbe] h-[7px] w-full" />
        {buttons}
      </div>
    </>
  );
}
function LikertScale(
  {
    likelinessToTryFood, setLikelinessToTryFood,
    restaurantFrequency, setRestaurantFrequency,
    decisionDifficulty, setDecisionDifficulty,
    openToDiversity, setOpenToDiversity
  }) {

  return (
    <div className="flex flex-col items-left">
      <h1 className="text-xl self-center font-bold">Know your zone</h1>
      <p>Complete the following to help us understand how comfortable you are trying new foods and cuisines.</p>
      <div className="flex flex-col items-center w-full">
        <p>I find it easy to try new foods.</p>
        <Scale value={likelinessToTryFood} setValue={setLikelinessToTryFood} />
        <p>How often do you try new restaurants?</p>
        <Scale value={restaurantFrequency} setValue={setRestaurantFrequency} />
        <p>When ordering food, I find it difficult to decide where and what to eat.</p>
        <Scale value={decisionDifficulty} setValue={setDecisionDifficulty} />
        <p>I want to broaden and diversify my palate, and step out of my comfort zone.</p>
        <Scale value={openToDiversity} setValue={setOpenToDiversity} />
      </div>
    </div>
  );
}
