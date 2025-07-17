'use client';
import { useEffect, useState } from 'react';
import GridCustomCols from '../shared/GridCustomCols';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faBullhorn, faCirclePlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import {
  addAnnouncement,
  addEvent,
  deleteAnnouncement,
  deleteEvent,
  getAnnouncementsByRestaurantId,
  getEventsByRestaurantId,
} from '@/lib/db/dbOperations';

// MAIN CONTAINER
export default function EventsAndAnnounce({ isOwner = false, restaurantId }) {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState('event'); // determines what kind of form to show: 'event' or 'announcement'

  useEffect(() => {
    const fetchEventsAndAnnouncements = async () => {
      const [eventsData, announcementsData] = await Promise.all([
        getEventsByRestaurantId(restaurantId),
        getAnnouncementsByRestaurantId(restaurantId),
      ]);
      setEvents(eventsData);
      setAnnouncements(announcementsData);
    };
    fetchEventsAndAnnouncements();
  }, [restaurantId]);

  const handleAddEvent = async event => {
    try {
      const res = await addEvent(restaurantId, {
        ...event,
        date: new Date(event.date), // ensure date is a Date object
      });
      setEvents(prev => [...prev, res]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const handleAddAnnouncement = async announcement => {
    try {
      const res = await addAnnouncement(restaurantId, announcement);
      setAnnouncements(prev => [...prev, res]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async id => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(announcement => announcement._id !== id));
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const handleDeleteEvent = async id => {
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(event => event._id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <>
      <GridCustomCols numOfCols={2} className="gap-x-6">
        {/* Events */}
        <div className="w-full h-full">
          <div className="flex mb-3 justify-between">
            <h2 className="text-xl font-semibold mb-2">Events</h2>
            {/* add event icon */}
            {isOwner && (
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="text-3xl text-brand-navy mr-2 cursor-pointer"
                onClick={() => {
                  setShowForm(true);
                  setMode('event');
                }}
              />
            )}
          </div>

          {/* Event Cards */}
          <div className="flex flex-col gap-4">
            {events.length === 0 && <div className="text-gray-500">No events available</div>}
            {events.map(event => (
              <EventCard
                key={event._id}
                name={event.name}
                date={event.date}
                description={event.description}
                onDelete={() => handleDeleteEvent(event._id)}
                isOwner={isOwner}
              />
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="w-full h-full">
          <div className="flex mb-3 justify-between">
            <h2 className="text-xl font-semibold mb-2">Announcements</h2>
            {/* make announchment icon */}
            {isOwner && (
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="text-3xl text-brand-navy mr-2 cursor-pointer"
                onClick={() => {
                  setShowForm(true);
                  setMode('announcement');
                }}
              />
            )}
          </div>
          {/* Announcement Cards */}
          <div className="flex flex-col gap-4">
            {announcements.length === 0 && <div className="text-gray-500">No announcements available</div>}
            {announcements.map(announcement => (
              <AnnouncementCard
                key={announcement._id}
                title={announcement.title}
                text={announcement.details}
                onDelete={() => handleDeleteAnnouncement(announcement._id)}
                isOwner={isOwner}
              />
            ))}
          </div>
        </div>
      </GridCustomCols>

      {/* events and announcements modal (shared) */}
      {showForm && (
        <EventAnnounceModal
          mode={mode}
          setMode={setMode}
          onAddEvent={handleAddEvent}
          onAddAnnouncement={handleAddAnnouncement}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
}

// events and announcements modal (shared)
function EventAnnounceModal({ mode, setMode, onAddEvent, onAddAnnouncement, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-[9999] overflow-scroll scrollbar-hide">
      <div className="relative bg-transparent p-8 w-2xl min-h-fit">
        {/* toggle header to switch between events or announcements form*/}
        <div className="bg-brand-green-lite w-full font-secondary uppercase rounded-t-lg flex justify-between cursor-pointer">
          <div
            className={`flex items-center font-primary font-semibold text-md capitalize py-3 px-3 rounded-tl-lg w-[50%]
              ${mode === 'event' ? 'bg-brand-aqua' : 'hover:bg-brand-aqua'}`}
            onClick={() => setMode('event')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl text-white mr-2" />
            Add Event
          </div>

          <div
            className={`flex items-center font-primary font-semibold text-md capitalize py-3 px-3 w-[50%] rounded-tr-lg
              ${mode === 'announcement' ? 'bg-brand-aqua' : 'hover:bg-brand-aqua'}`}
            onClick={() => setMode('announcement')}
          >
            <FontAwesomeIcon icon={faBullhorn} className="text-2xl text-white mr-2" />
            Make Announcement
          </div>
        </div>

        <div className="relative">
          {mode === 'event' ? (
            <AddEventForm onAddEvent={onAddEvent} onCancel={onCancel} /> // event form
          ) : (
            <AddAnnouncementForm onAddAnnouncement={onAddAnnouncement} onCancel={onCancel} /> // announcement form
          )}
        </div>
      </div>
    </div>
  );
}

// add event form
function AddEventForm({ onAddEvent, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.name && formData.date && formData.description) {
      onAddEvent(formData);
    }
  };

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
            name="name"
            placeholder="Food Eating Contest"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <Label>Date and Time</Label>
          <Input
            name="date"
            type="datetime-local"
            placeholder="January 20, 2029 at 6-9PM"
            value={formData.date}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <Label>Description</Label>
          <textarea
            name="description"
            placeholder="Join us to eat 100 hot dogs"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <div className="flex justify-center gap-2 mt-8 w-full">
          <Button type="submit" className="w-30" variant="default">
            Add
          </Button>
          <Button type="button" className="w-30" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

// add announcement form
function AddAnnouncementForm({ onAddAnnouncement, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    details: '',
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.title.trim() && formData.details.trim()) {
      onAddAnnouncement(formData);
      setFormData({ title: '', details: '' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white absolute top-0 w-full rounded-b-lg p-6 flex flex-col items-center"
    >
      <div className="w-full flex flex-col gap-3">
        <div className="font-secondary text-4xl mb-4">Make Announcement</div>

        <div>
          <Label>Title</Label>
          <Input
            name="title"
            placeholder="Holiday Hours"
            value={formData.title}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label>Announcement</Label>
          <textarea
            name="details"
            placeholder="We will be closed on New Year's Day."
            value={formData.details}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
            required
          />
        </div>

        <div className="flex justify-center gap-2 mt-8 w-full">
          <Button type="submit" className="w-30" variant="default">
            Post
          </Button>
          <Button type="button" className="w-30" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

// card for added events
function EventCard({ name, date, description, onDelete, isOwner = false }) {
  return (
    <div className="border rounded-md border-brand-yellow-lite p-4 flex bg-white shadow-sm relative">
      <div className="h-30 aspect-square bg-white flex items-center justify-center text-white font-bold">
        <FontAwesomeIcon icon={faCalendarAlt} className="text-7xl text-brand-green" />
      </div>
      <div className="flex flex-col gap-y-1 ml-4">
        <h3 className="capitalize">{name}</h3>
        <h4>
          {new Date(date).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </h4>
        <p>{description}</p>
      </div>
      {isOwner && (
        <FontAwesomeIcon
          icon={faTrashAlt}
          onClick={onDelete}
          className="text-2xl text-brand-red absolute top-2 right-2 cursor-pointer"
        />
      )}
    </div>
  );
}

// card for added announcements
function AnnouncementCard({ title, text, onDelete, isOwner = false }) {
  return (
    <div className="border border-brand-yellow-lite rounded-md p-4 bg-white shadow-sm relative">
      <h3 className="font-semibold">{title}</h3>
      <p>{text}</p>
      {isOwner && (
        <FontAwesomeIcon
          icon={faTrashAlt}
          onClick={onDelete}
          className="text-2xl text-brand-red absolute top-2 right-2 cursor-pointer"
        />
      )}
    </div>
  );
}
