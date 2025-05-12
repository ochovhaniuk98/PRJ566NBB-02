"use client";
import ImageBanner from "@/app/components/restaurantProfile/ImageBanner";
import InfoBanner from "@/app/components/restaurantProfile/InfoBanner";
import ProfileTabBar from "@/app/components/ProfileTabBar";
import bannerImages from "@/app/data/fakeData";
import StarRating from "@/app/components/general/StarRating";
import Image from "next/image";

export default function RestaurantProfile() {
  const restaurantTabs = [
    "Reviews",
    "Mentioned",
    "Photos",
    "Menu",
    "Announcements",
    "Business Info",
  ];
  return (
    <div>
      <div className="absolute top-0 left-12 right-0">
        <div className="flex flex-col ">
          <ImageBanner images={bannerImages} />
          <InfoBanner
            name="The Pomegranate Restaurant"
            avgRating={4.6}
            numReviews={1781}
            cuisine="Persian"
          />
        </div>
        <div className="main-side-margins mb-16">
          <ProfileTabBar
            onTabChange={(tab) => console.log(tab)}
            tabs={restaurantTabs}
          />
          <div className="grid grid-cols-3 gap-2">
            <div className="border rounded-md border-brand-yellow-lite h-120 flex flex-col">
              <div className="p-4">
                <StarRating
                  colour={"text-brand-green"}
                  iconSize={"icon-lg"}
                  ratingNum={3}
                />
                <h3>Review Title</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  velit libero, vehicula sed cursus non, blandit et neque. Ut
                  interdum tincidunt nibh, et pellentesque ligula tincidunt
                  eget. Maecenas eget pulvinar massa, eget interdum nisi. Nulla
                  gravida tincidunt tortor ac aliquet. Aliquam aliquam sem quam,
                  eget volutpat magna imperdiet id ...
                </p>
                <div className="flex mt-4 gap-x-2">
                  <div className="relative w-10 h-10">
                    <Image
                      src="/img/profilepic.jpg"
                      alt="profile pic"
                      className="object-cover rounded-full"
                      fill={true}
                    />
                  </div>
                  <div>
                    <a href="#">
                      <h4 className="font-semibold">Authour Name</h4>
                    </a>
                    <h4 className="text-brand-grey">— May 20, 2025</h4>
                  </div>
                </div>
              </div>
              <div className="flex mt-4 gap-x-1 h-1/3">
                <div className="relative w-1/2">
                  <Image
                    src="/img/profilepic.jpg"
                    alt="profile pic"
                    className="object-cover rounded-bl-md"
                    fill={true}
                  />
                </div>
                <div className="relative w-1/2">
                  <Image
                    src="/img/profilepic.jpg"
                    alt="profile pic"
                    className="object-cover rounded-br-md"
                    fill={true}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-200 p-4">Column 2</div>
            <div className="bg-gray-200 p-4">Column 3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
