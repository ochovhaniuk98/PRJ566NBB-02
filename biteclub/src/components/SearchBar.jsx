import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
export default function SearchBar() {
  return (
    <div className="fixed w-full flex justify-between z-40 bg-white/30 main-side-margins">
      <div className="relative h-12 w-64">
        <Image
          src="/img/logo.jpg"
          alt="logo pic"
          className="object-contain rounded-br-md main-side-margins"
          fill={true}
        />
      </div>
      <div className="relative w-128 max-w-full">
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
