import GridCustomCols from '@/components/shared/GridCustomCols';
import RestaurantHours from './RestaurantHours';

export default function BusinessInfo({ restaurant }) {
  const encodedAddress = encodeURIComponent(restaurant.name + ' ' + restaurant.location);
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="flex md:flex-row flex-col justify-between">
      <div className=" bg-brand-grey md:w-3/4 w-full md:h-112 h-60">
        <iframe
          src={mapSrc}
          className="border-none w-full h-full"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="flex flex-col gap-2 p-0 md:pt-0 pt-4">
        <div className="md:px-6 flex flex-col gap-1">
          <h3>{restaurant.name}</h3>
          <p>{restaurant.location}</p>
          <p>(416) 921-7557</p>
        </div>
        <RestaurantHours openHours={restaurant.BusinessHours} />
      </div>
    </div>
  );
}
