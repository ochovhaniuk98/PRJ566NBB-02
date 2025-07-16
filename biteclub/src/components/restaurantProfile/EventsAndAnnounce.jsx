'use client';
import { useState } from 'react';
import GridCustomCols from '../shared/GridCustomCols';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';

export default function EventsAndAnnounce() {
  const [events, setEvents] = useState([
    {
      name: 'Restaurant Event Name!!!',
      date: 'August 30, 2025 at 7:00pm',
      price: 'Free Price',
      description:
        'This event will be amazing, spectacular. Be there or be square. Food is too good. Kareoke night with free happy hour every Wednesday.',
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const addEvent = event => {
    setEvents(prev => [...prev, event]);
    setShowForm(false); // hide form after submit
  };

  return (
    <GridCustomCols numOfCols={2}>
      <div className="w-full h-full">
        <h2 className="text-xl font-semibold mb-2">Events</h2>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 bg-brand-yellow-lite text-black font-semibold px-4 py-2 rounded"
          >
            + Add Event
          </button>
        )}

        {showForm && <EventForm onAddEvent={addEvent} onCancel={() => setShowForm(false)} />}

        <div className="flex flex-col gap-4">
          {events.map((event, idx) => (
            <EvAnnCard key={idx} {...event} />
          ))}
        </div>
      </div>

      <div className="w-full h-full">
        <h2 className="text-xl font-semibold mb-2">Announcements</h2>
        {/* You can add announcement logic here */}
      </div>
    </GridCustomCols>
  );
}

function EventForm({ onAddEvent, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    price: '',
    description: '',
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.name && formData.date && formData.description) {
      onAddEvent(formData);
      setFormData({ name: '', date: '', price: '', description: '' });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center  z-[99999999999999]  overflow-scroll scrollbar-hide">
        <div className="relative bg-transparent p-8 w-2xl min-h-fit ">
          {/* Toggle Switch -- Allows users to select "Write a review" OR "Add Instagram Post" if adding NEW review (non-edit mode) */}
          <div className="bg-brand-green-lite w-full font-secondary uppercase rounded-t-lg flex justify-between cursor-pointer">
            <div
              className={`flex items-center font-primary font-semibold text-md capitalize py-3 px-3 rounded-tl-lg w-[50%]
              hover:bg-brand-aqua bg-brand-aqua`}
              onClick={() => 'hi'}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className={`text-2xl text-white mr-2`} />
              Add Event
            </div>

            <div
              className="flex items-center font-primary font-semibold text-md capitalize py-3 px-3 w-[50%] rounded-tr-lg hover:bg-brand-aqua shadow-md"
              onClick={() => 'hi'}
            >
              <FontAwesomeIcon icon={faBullhorn} className={`text-2xl text-white mr-2`} />
              Make Announcement
            </div>
          </div>
          <div className="relative">
            <AddEventForm />
          </div>
        </div>
      </div>
    </>
  );
}

function EvAnnCard({ name, date, price, description }) {
  return (
    <div className="border rounded-md border-brand-yellow-lite p-4 flex">
      <div className="h-42 aspect-square bg-brand-green flex items-center justify-center text-white font-bold">
        image
      </div>
      <div className="flex flex-col gap-y-1 ml-4">
        <h3 className="capitalize">{name}</h3>
        <h4>{date}</h4>
        <h5>{price}</h5>
        <p>{description}</p>
      </div>
    </div>
  );
}

function AddEventForm() {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white absolute top-0 w-full rounded-b-lg p-6 flex flex-col items-center"
    >
      <div className="w-full flex flex-col gap-3">
        <div className="font-secondary text-4xl mb-4">Add Event</div>
        <div>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Event Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
            required
          />
        </div>
        <div>
          <Label>Date and Time</Label>
          <Input
            type="text"
            name="date"
            placeholder="Date and Time"
            value={formData.date}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>Price</Label>
          <Input
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <Label>Description</Label>
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full"
            rows={3}
          />
        </div>

        <div className=" flex justify-center gap-2 mt-16 w-full">
          <Button type="submit" className="w-30" variant="default" disabled={false}>
            Add
          </Button>
          <Button type="button" className="w-30" variant="secondary" disabled={false} onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
