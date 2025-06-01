'use client';
import { useState } from 'react';
import { faLocationDot, faHeart, faUtensils, faPen } from '@fortawesome/free-solid-svg-icons';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import ProfileStat from '@/components/generalProfile/ProfileStat';
import { Button } from '@/components/shared/Button';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import reviewCardIconArr from '@/app/data/iconData';
import EngagementIconStat from '@/components/shared/EngagementIconStat';
import { SimpleEditor } from '@/components/tiptap-rich-text-editor/tiptap-templates/simple/simple-editor';
import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';

export default function GeneralUserProfile() {
  const profileStatLabels = ['Followers', 'Reviews', 'Blog Posts', 'Challenges'];
  const profileTabs = [
    'Blog Posts',
    'Reviews',
    'Favourite Restaurants',
    'Favourite Blog Posts',
    'Visited',
    'My Followers',
    'Following',
  ];
  const [selectedTab, setSelectedTab] = useState(profileTabs[0]);
  const [showTextEditor, setShowTextEditor] = useState(false);

  return (
    <MainBaseContainer>
      <div className="main-side-padding w-full flex flex-col items-center bg-brand-yellow-extralite relative">
        {' '}
        {/* mb-8 */}
        <GridCustomCols numOfCols={3} className="pt-14 px-60 pb-8">
          <div className=" flex justify-end">
            <div className="max-h-60 aspect-square rounded-full border border-brand-green bg-white mx-4"></div>
          </div>
          <div className="flex flex-col gap-2">
            <h1>Sarah008</h1>
            <div className="min-h-28 py-4">
              <p>I love food.</p>
            </div>
            <h5>Join Since: June 16, 2025</h5>
            <Button type="submit" className="w-40" variant="default">
              Follow
            </Button>
          </div>
          <div className="transparent">
            {profileStatLabels.map((lbl, i) => {
              return <ProfileStat key={i} statNum={123} statLabel={lbl} />;
            })}
          </div>
        </GridCustomCols>
        <SingleTabWithIcon
          className={'absolute bottom-2 right-20'}
          icon={faPen}
          detailText="Write a Blog Post"
          onClick={() => setShowTextEditor(prev => !prev)}
        />
      </div>
      <div className="main-side-padding w-full">
        {!showTextEditor && (
          <>
            <ProfileTabBar tabs={profileTabs} onTabChange={setSelectedTab} />
            {selectedTab === profileTabs[1] && (
              <GridCustomCols numOfCols={4}>
                <div className="border rounded-md border-brand-yellow-lite flex flex-col cursor-pointer hover:bg-brand-peach-lite hover:outline-brand-peach hover:outline-2 row-span-2">
                  <div className="px-4 pt-4">
                    <h3>Blog Post Title</h3>
                    <p>
                      Looking for the best Persian restaurant in Toronto? The Pomegranate Restaurant stands out for its
                      high-quality ingredients, traditional recipes, and elegant presentation. Every dish is made with
                      care, offering a rich and authentic Persian experience.
                    </p>
                    <div className="flex justify-between my-4">
                      <h4 className="text-brand-grey">June 20, 2025</h4>
                      <EngagementIconStat iconArr={reviewCardIconArr} statNumArr={[0, 123]} />
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    <div className="relative w-full overflow-hidden bg-brand-green rounded-b-md"></div>
                  </div>
                </div>
              </GridCustomCols>
            )}
          </>
        )}
        {showTextEditor && (
          /* Blog Text Editor */ <>
            <div className=" pt-8">
              <div className="flex gap-2 justify-end fixed bottom-5 right-25">
                <Button type="submit" className="w-30" variant="default">
                  Save
                </Button>
                <Button type="button" className="w-30" variant="secondary">
                  Cancel
                </Button>
              </div>
              <div className=" w-full h-700 border border-brand-yellow-lite">
                <SimpleEditor />
              </div>
            </div>
          </>
        )}
      </div>
    </MainBaseContainer>
  );
}
