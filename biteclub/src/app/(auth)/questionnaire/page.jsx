'use client';
import { useState, useRef } from 'react';
import { createClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlFood, faBowlRice, faCarrot, faSpoon, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faCircleRight, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';
import { Button } from '@/components/shared/Button';

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

export default function Questionnaire({ bgImagePath = '/img/greenOnYellowBG.png' }) {
  const router = useRouter();

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
    if (step == FIRST_STEP) {
      setStep(SECOND_STEP);
    } else if (step == SECOND_STEP) {
      setStep(FINAL_STEP);
    }
  }

  async function submit() {
    console.log(selectedCuisines, selectedDietaryPreferences);
    console.log(likelinessToTryFood);
    console.log(restaurantFrequency);
    console.log(decisionDifficulty);
    console.log(openToDiversity);
    const res = await fetch('/api/generals/update-profile/questionnaire', {
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
    if (res.status == 200) {
      router.push('/');
    }
  }

  //background images
  const bgImage =
    step === FIRST_STEP
      ? "url('/img/greenOnYellowBG.png')"
      : step === SECOND_STEP
      ? "url('/img/peachOnAquaBG.png')"
      : "url('/img/yellowOnBlueBG.png')";

  return (
    <div className="grid grid-cols-[55%_45%] h-screen relative overflow-y-hidden">
      {/* background image*/}
      <div
        className="bg-cover"
        style={{
          backgroundImage: bgImage,
          backgroundSize: '175%',
          backgroundPosition: '-2rem',
        }}
      ></div>
      <div className="relative bg-[#fffbe6] p-12 py-8 h-full">
        <div className="flex flex-col items-center">
          <div className="relative h-11 w-16">
            <Image src="/img/trayIcon.png" alt="tray icon" className="object-contain relative" fill={true} />
            <h1 className="absolute bottom-1 left-[42%] text-3xl font-secondary text-brand-navy">{step}</h1>
          </div>
          <span className="self-center text-[12px] font-medium">STEP {step}/3</span>
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
        <button
          onClick={step != FINAL_STEP ? nextStep : submit}
          className="absolute bottom-8.5 right-10.5 flex items-center gap-2 font-primary text-lg font-semibold text-brand-navy cursor-pointer"
        >
          {step != FINAL_STEP ? (
            <>
              Next Step <FontAwesomeIcon icon={faCircleRight} className={`text-3xl text-brand-navy`} />
            </>
          ) : (
            <>
              Complete <FontAwesomeIcon icon={faCircleCheck} className={`text-3xl text-brand-navy`} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function PreferencesSelector({ config, picked, setPicked, options, setOptions }) {
  const customInput = useRef();

  const toggle = t => setPicked(p => (p.includes(t) ? p.filter(x => x !== t) : [...p, t]));

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
    <div className="flex flex-col h-full mt-4">
      <h2 className="self-center mb-2">{config.title}</h2>
      <div className="mb-[70px]">
        <p className="mb-2">{config.instructions}</p>
        <div className="flex flex-wrap gap-2 p-2 px-0 mt-6 rounded-2xl">
          {options.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-primary font-medium border-none cursor-pointer transition-colors duration-150 focus:outline-none  ${
                picked.includes(t) ? 'bg-[#a6d34d] text-black' : 'bg-[#FFF5D8] text-[#08349e]'
              }`}
            >
              {t}
              <FontAwesomeIcon icon={faCarrot} className={`text-sm text-brand-navy ml-2`} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="normal-case">{config.customSection.missingPrompt}</h3>
        <p className="">{config.customSection.inputInstructions}</p>
        <div className="flex flex-col w-[55%]">
          <input ref={customInput} className="rounded-3xl" placeholder={config.customSection.inputPlaceholder} />
          <Button
            type="submit"
            className="w-30 self-center"
            variant="default"
            disabled={false}
            onClick={addCustomSelection}
          >
            {config.customSection.buttonLabel}
          </Button>
          {/*<button
            className="self-center rounded-3xl bg-[#ffdcbe] w-[130px] text-sm py-[5px]"
            onClick={addCustomSelection}
          >
            {config.customSection.buttonLabel}
          </button>*/}
        </div>
      </div>
    </div>
  );
}

function Scale({ value, setValue }) {
  const SELECTED_OPTION_STYLING = 'bg-[#56e4be] h-[28px] w-[28px] rounded-full z-10 shadow-md cursor-pointer';
  const UNSELECTED_OPTION_STYLING = 'bg-[#ffdcbe] h-[28px] w-[12px] rounded-xl z-10 cursor-pointer hover:scale-120';
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
      <div className="relative flex flex-row justify-between w-[75%] h-[28px]">
        <div className="self-center absolute bg-[#ffdcbe] h-[10px] w-full" />
        {buttons}
      </div>
    </>
  );
}
function LikertScale({
  likelinessToTryFood,
  setLikelinessToTryFood,
  restaurantFrequency,
  setRestaurantFrequency,
  decisionDifficulty,
  setDecisionDifficulty,
  openToDiversity,
  setOpenToDiversity,
}) {
  return (
    <div className="flex flex-col items-left h-full mt-4">
      <h2 className="self-center mb-2">Know Your Zone</h2>
      <p>Complete the following to help us understand how comfortable you are trying new foods and cuisines.</p>
      <div className="flex flex-col items-center w-full justify-between h-[60%] mt-4">
        <div className="flex flex-col items-center w-full">
          <p>I find it easy to try new foods.</p>
          <Scale value={likelinessToTryFood} setValue={setLikelinessToTryFood} />
        </div>
        <div className="flex flex-col items-center w-full">
          <p>How often do you try new restaurants?</p>
          <Scale value={restaurantFrequency} setValue={setRestaurantFrequency} />
        </div>
        <div className="flex flex-col items-center w-full">
          <p>When ordering food, I find it difficult to decide where and what to eat.</p>
          <Scale value={decisionDifficulty} setValue={setDecisionDifficulty} />
        </div>
        <div className="flex flex-col items-center w-full">
          <p>I want to broaden and diversify my palate, and step out of my comfort zone.</p>
          <Scale value={openToDiversity} setValue={setOpenToDiversity} />
        </div>
      </div>
    </div>
  );
}
