export default function RestaurantHours({ openHours }) {
  const currentDay = new Date().getDay();

  return (
    <div className="w-full max-w-3xs flex flex-col">
      {openHours.map((elem, i) => {
        return (
          <div className={`open-hours-style ${i === currentDay ? 'open-hours-selected' : ''}`}>
            <p>{elem.day}</p>
            {!elem.opening || !elem.closing ? 'Closed' : <p>{`${elem.opening} – ${elem.closing}`}</p>}
          </div>
        );
      })}
    </div>
  );
}
