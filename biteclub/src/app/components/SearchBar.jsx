import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
export default function SearchBar() {
  return (
    <div className="fixed w-full flex justify-end z-40 bg-white/30 main-side-margins">
      {/* input and icon wrapper */}
      <div className="relative w-128 max-w-full">
        {/* icon inside input */}
        <span className="absolute inset-y-0 left-3 flex items-center text-brand-grey">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <input
          type="text"
          placeholder="Search for restaurants, blog posts, or users"
          className="w-full pl-8"
        />
      </div>
    </div>
  );
}
