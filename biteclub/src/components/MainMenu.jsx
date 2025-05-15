import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHouseChimney,
  faGamepad,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { faMicroblog } from "@fortawesome/free-brands-svg-icons";

export default function MainMenu() {
  const menuIcons = [
    faHouseChimney,
    faUser,
    faGamepad,
    faUtensils,
    faMicroblog,
  ];
  const menuLinks = ["/", "#", "#", "/restaurants/12345", "#"];

  return (
    <aside className="fixed top-0 left-0 z-50 bg-transparent p-2 pt-8 h-screen w-12 shadow-lg/50 shadow-brand-grey">
      <nav className="space-y-16 flex flex-col items-center">
        {menuLinks.map((_, idx) => {
          return (
            <a
              key={idx}
              href={menuLinks[idx]}
              className="block text-gray-800 hover:text-blue-600"
            >
              <FontAwesomeIcon
                icon={menuIcons[idx]}
                className="icon-lg text-brand-navy"
              />
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
