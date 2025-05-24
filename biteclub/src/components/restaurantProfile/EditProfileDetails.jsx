import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { useState } from 'react';
import { Switch } from '../shared/Switch';

export default function EditProfileDetails({ onClose, restaurantData }) {
  const [businessHours, setBusinessHours] = useState(() => {
    return restaurantData.businessHours.map(day => ({
      open: day.opening || '',
      close: day.closing || '',
    }));
  });

  const [closedDays, setClosedDays] = useState(() => {
    return restaurantData.businessHours.map(day => !day.opening && !day.closing);
  });

  const handleSubmit = e => {
    e.preventDefault(); // prevent page reload
    const formData = new FormData(e.target);
    const profileText = formData.get('profileText');

    console.log('Submitted:', profileText); // or save it to DB
    onClose(); // close the popup
  };

  const handleClosedToggle = index => {
    const updatedClosed = [...closedDays];
    const updatedHours = [...businessHours];

    updatedClosed[index] = !updatedClosed[index];

    // If marking as closed, clear the times
    if (updatedClosed[index]) {
      updatedHours[index] = { open: '', close: '' };
    }

    setClosedDays(updatedClosed);
    setBusinessHours(updatedHours);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit} // You can define this function
        className="bg-white p-8 rounded-md shadow-lg w-fit bg-brand-yellow-extralite"
      >
        <h2 className="mb-8 w-fit mx-auto">Edit Profile Details</h2>
        <div className="flex space-x-12">
          <div className="w-xs border-r pr-12 border-brand-peach flex flex-col gap-2">
            <div>
              {/* name */}
              <Label htmlFor="name">
                <h4>Restaurant Name</h4>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your restaurant's name."
                value={restaurantData.name}
                required
                className="w-full"
              />
            </div>
            <div>
              {/* address */}
              <Label htmlFor="address">
                <h4>Address</h4>
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Where can diners find you?"
                value={restaurantData.location}
                required
                className="w-full"
              />
            </div>
            <div>
              {/* phone */}
              <Label htmlFor="phone">
                <h4>Phone Number</h4>
              </Label>
              <Input id="phone" type="tel" placeholder="What's your number? 😏" required className="w-full" />
            </div>
            <div>
              {/* cuisines */}
              <Label htmlFor="cusisines">
                <h4>Cuisines</h4>
              </Label>
              <textarea
                name="cuisines"
                className="w-full border rounded-md p-2 h-24 resize-none"
                placeholder="What’s cooking? Canadian, Vegan, Breakfast? 🍁🍃🥞"
                value={restaurantData.cuisines.join(', ')}
                required
              />
              <h6 className="m-0 p-0 text-xs font-primary">Seperate cusines with a comma.</h6>
            </div>
          </div>

          <div>
            {/* Business Hours */}
            <Label htmlFor="hours">
              <h4>Business Hours</h4>
            </Label>
            {['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={day} className="flex items-center gap-2">
                <Label className="w-16 uppercase">
                  <h4>{day}</h4>
                </Label>

                <div className="flex flex-col justify-center items-center mx-4">
                  <label className="flex items-center gap-2 text-sm">
                    <h5>Closed</h5>
                  </label>
                  <Switch id={day} checked={closedDays[idx]} onCheckedChange={() => handleClosedToggle(idx)} />
                </div>
                <Input
                  type="time"
                  name={`${day}-open`}
                  className="w-32 font-primary"
                  disabled={closedDays[idx]}
                  value={businessHours[idx].open}
                  onChange={e => {
                    const updated = [...businessHours];
                    updated[idx].open = e.target.value;
                    setBusinessHours(updated);
                  }}
                />
                <span>
                  <h5>to</h5>
                </span>
                <Input
                  type="time"
                  name={`${day}-close`}
                  className="w-32 font-primary"
                  disabled={closedDays[idx]}
                  value={businessHours[idx].close}
                  onChange={e => {
                    const updated = [...businessHours];
                    updated[idx].close = e.target.value;
                    setBusinessHours(updated);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-8">
          <Button type="submit" className="w-40" variant="default" disabled={false}>
            Submit
          </Button>
          <Button type="button" className="w-40" onClick={onClose} variant="secondary" disabled={false}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

/*
<Input
type="text"
name={`${day}-open`}
placeholder="09:00"
pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$" // for format validation
className="w-full pr-10"
disabled={closedDays[idx]}
/>
*/
