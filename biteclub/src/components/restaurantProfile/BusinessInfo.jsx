import GridCustomCols from '@/components/shared/GridCustomCols';
import RestaurantHours from './RestaurantHours';

export default function BusinessInfo({ restaurant, mapSrc }) {
  return (
    <GridCustomCols numOfCols={6}>
      <div className="col-span-4 row-span-2 bg-brand-grey">
        <iframe
          src={mapSrc}
          className="boreder-none w-full h-full"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="col-span-2 flex flex-col gap-4 p-4">
        <div className="px-6">
          <h2>{restaurant.name}</h2>
          <p>{restaurant.location}</p>
          <p>(416) 921-7557</p>
        </div>
        <RestaurantHours openHours={restaurant.businessHours} />
      </div>
    </GridCustomCols>
  );
}
