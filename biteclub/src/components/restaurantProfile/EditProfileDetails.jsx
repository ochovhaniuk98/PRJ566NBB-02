import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { Switch } from '../shared/Switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import EditPhotosModal from './EditPhotosModal';
import { useState } from 'react';

export default function EditProfileDetails({ onClose, restaurantData }) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [name, setName] = useState(restaurantData.name);
  const [address, setAddress] = useState(restaurantData.location);
  const [cuisines, setCuisines] = useState(restaurantData.cuisines.join(', '));

  const [businessHours, setBusinessHours] = useState(() => {
    return restaurantData.BusinessHours.map(day => ({
      open: day.opening || '',
      close: day.closing || '',
    }));
  });

  const [closedDays, setClosedDays] = useState(() => {
    return restaurantData.BusinessHours.map(day => !day.opening && !day.closing);
  });

  const handleSubmit = async e => {
    e.preventDefault();

    // grab input values -- hours missing
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const address = formData.get('address');
    const cuisines = formData.get('cuisines');
    // const phone = formData.get('phone');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const formattedBusinessHours = businessHours.map((hours, idx) => ({
      day: daysOfWeek[idx],
      opening: closedDays[idx] ? null : hours.open || '',
      closing: closedDays[idx] ? null : hours.close || '',
    }));

    const body = {
      ...(name && { name }),
      ...(address && { location: address }),
      ...(cuisines && { cuisines: cuisines.split(',').map(c => c.trim()) }),
      BusinessHours: formattedBusinessHours,
    };

    const res = await fetch(`/api/restaurants/${restaurantData._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error updating restaurant details:', errorData);
      return;
    }
    console.log(`Form submitted. Values retrieved: ${name}, ${address}, and ${cuisines}.`);
    onClose();
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md w-fit">
        <h2 className="mb-8 w-fit mx-auto">Edit Profile Details</h2>
        <div className="flex space-x-12">
          <div className="w-xs border-r pr-12 border-brand-peach flex flex-col gap-4">
            <div>
              {/* name */}
              <Label htmlFor="name">
                <h4>Restaurant Name</h4>
              </Label>
              <Input
                name="name"
                type="text"
                placeholder="Enter your restaurant's name."
                value={name}
                onChange={e => setName(e.target.value)}
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
                name="address"
                type="text"
                placeholder="Where can diners find you?"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                className="w-full"
              />
            </div>
            {/* phone */}
            {/* <div>
              <Label htmlFor="phone">
                <h4>Phone Number</h4>
              </Label>
              <Input name="phone" type="tel" placeholder="What's your number? 😏" required className="w-full" />
            </div> */}
            <div>
              {/* cuisines */}
              <Label htmlFor="cusisines">
                <h4>Cuisines</h4>
              </Label>
              <textarea
                name="cuisines"
                className="w-full border rounded-md p-2 h-24 resize-none"
                placeholder="What’s cooking? Canadian, Vegan, Breakfast? 🍁🍃🥞"
                value={cuisines}
                onChange={e => setCuisines(e.target.value)}
                required
              />
              <h6 className="m-0 p-0 text-xs font-primary">Seperate cusines with a comma.</h6>
            </div>
            <div>
              <div>
                {/* photos */}
                <Label htmlFor="cusisines">
                  <h4>Delete Photos</h4>
                </Label>
                <Button
                  type="button"
                  className="w-full mt-2"
                  onClick={() => setShowPhotoModal(true)}
                  variant="third"
                  disabled={false}
                >
                  <FontAwesomeIcon icon={faImages} className="icon-2xl text-brand-navy cursor-pointer" />
                  Photos
                </Button>
              </div>
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
                  <Switch name={day} checked={closedDays[idx]} onCheckedChange={() => handleClosedToggle(idx)} />
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
          <Button type="submit" className="w-30" variant="default" disabled={false}>
            Save
          </Button>
          <Button type="button" className="w-30" onClick={onClose} variant="secondary" disabled={false}>
            Cancel
          </Button>
        </div>
      </form>
      {/* Edit Photos Modal */}
      {showPhotoModal && (
        <EditPhotosModal photos={restaurantData.images} showModal={showPhotoModal} setShowModal={setShowPhotoModal} />
      )}
      {console.log('photos', restaurantData)}
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
