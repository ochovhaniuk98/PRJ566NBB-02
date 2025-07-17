# Sprint 1

## Database Setup
### Cloudinary
- Implemented the Image Upload feature with integration into Cloudinary (for image storage) and MongoDB
- Implemented TipTap rich text editor 

### MongoDB
- Setup Schema for collection as per the SRS. (Collections: User, Photo, Comment, InstagramPost, BlogPost, InternalReview, ExternalReview, ChallengeStep, AvailableChallengeDetail, ActiveChallengeDetail, Challenge, PointValueDetail, Point, Event, Announcement, MenuItem, BusinessHours, Restaurant, BusinessUser, etc.) 
- Added restaurant data for resturants in Toronto.
- Added mock data for users and reviews. 
- Setup MongoDB connection configuration in the backend with basic CRUD operations.

## User Authentication
* Enabled Google OAuth and email/password methods for sign-up and login
* Users can select their user type upon sign-up (business or general)
* Stored user credentials in Supabase
* Implemented logoff functionality
* Implemented account deletion functionality
* Protected routes for authenticated users

## User Profile Management
* Users can update their username, password, and profile picture on Settings page

## Restaurant Profile Management
- Restaurant profiles can be managed by business users.
- Business users can see their restaurant's profile with the following features:
  * View and edit restaurant details (name, location, cuisine, business hours)
  * Add Instagram embeds
  * View restaurant photos and reviews (with dynamic data from the database)
- Added Google Maps integration for restaurant location display in business info section.
>[!NOTE]
>The restaurant profile management features are currently not fully implemented. The business user has limited editing capabilities.

## Front-End Development
Components created for the following:
 * **Global**
   * main menu
   * search bar
     
 * **Restaurant Profile**
   * image and info banners
   * tabs for both general and business users' actions (upper-right side of profile)
   * profile navigation tab menu
   * reviews (closed state)
   * Instagram embeds
   * photos section
   * business info section

 * **User Authentication**
   * sign-up and login pages
   * account set-up page for both general and business users

 * **General User Profile Management**
   * settings page (i.e. username/password/bio change form, display preferences, delete account button)

 * **Business User Profile Management**
   * forms for profile modification (i.e. delete photo modal, Instagram embed form, edit profile details form)

 # Sprint 2
 ## General User Related
 ### Blog Post
 - General User can create, view, edit and delete a blog post
   * Instagram Post Embed
   * Restaurant Tagging
   * Multiple Images Embed

 ### Reviews
  - General Users can create and view internal and external reviews for restaurants
    * Internal Review: Users can write reviews for restaurants, which will be visible to other users. They can also attach photos to their reviews and give a rating.
    * External Review: Users can share Instagram post links related to the restaurant or their experience at the restaurant. These links will be displayed as embedded posts on the restaurant's profile page.
  - Reviews will be displayed on the restaurant profile page and on the user's profile page. They can view internal and external reviews separately.

### Search
 * General User can search for a restaurant, blog post, and user

### Display Preferences
-  Users can toggle display preferences on the Settings page.
  - If toggle is off, that tab will be hided from public for their privacy. 

### Add to Favourite
- Users can add/remove item to/from their favourite list, and shown on user dashboard.
  - Restaurant
  - Blog Post

### Personalized Feed
- Users can enable or disable whether they want to receive an AI personalized field
- Enabling the options means that they agree with sharing their data for training AI models for recommendations.

### Points system
- Users can now redeem their points for coupons ranging from $5 to $15.

## Business User Related
### Business Users' Licences Upload
- A page where business users can upload documents to verify their restaurant ownership. 

### Reviews Management
  - Business users can now delete the external reviews that they have posted on their restaurant's profile page.
  >[!NOTE]
  >Business user cannot delete any internal reviews posted by general users. They can only delete their own external reviews.

### Images Management
- Business users can upload images to their restaurant profile to enhance the visual appeal of their restaurant's profile page.
- They can upload multiple images to showcase on the banner or in the photos section of the restaurant profile.

### Blog Posts
- Blog posts mentioning the restaurant are now visible on the restaurant profile page under the "Mentioned" tab.
>[!NOTE]
>Business users can view the blog posts that mention their restaurant, but they cannot edit or delete them.

## Administration
### Admin Dashboard
- Admin Panel created for managing approval of business users' accounts based on their uploaded documents.
- Admins can view and approve/reject business user accounts.

# Sprint 3
### Blog Posts list 
 - User can now navigate to the blog post section from the main menu and see the list of the blog posts that consists of the combination of popular blog posts and newly added blog posts.

### Restaurants list 
 - User can now navigate to the restaurant section from the main menu and see the list of the restaurants that consists of the combination of popular restaurants and newly added blog posts.
   
### Restaurant Filter
 - In addition to searching for a restaurants, users can also filter restaurants to narrow their search.
 - Geolocation of the user is used to do a distance filtering.

### Comments and Replies
 - Users can now post a comments on a blog post to engage with the community.
 - Users can reply to the comments. Only one level of nested comments is allowed.

### Reporting inappropriate blog post or comment
- Users can now report Contents (blog posts, comments, Internal reviews, External reviews) and moderation team will be reviewing the request.
- Users can report another general users.

### New ML powered features
- The restaurant list and blog post recommendations are now powered with an ML recommender system

### Restaurant Profile Enhancements

- Business users can now manage and update the events and announcements for their restaurant.
- Business users will now be able to reply to reviews, react to reviews, and manage the engagement on their restaurant profile.
- Business users can now report inappropriate reviews, comments, and blog posts related to their restaurant.

### Review System Enhancements

- The reviews now have an engagement system where users can like or dislike reviews and make comments on their reviews to engage with the restaurant management.
- The reviews are sorted based on the engagement metrics (likes/dislikes) and the recency of the review.
- Reported reviews will be hidden from the public view until the moderation team reviews them.

### Front-End Development
Components created:
 - Filter menu for restaurant search
 - Comments section for blog post
 - Comments section for expanded review
 - Report user/content form
 - Events and Announcements tab section in Restaurant profile (includes forms for creating/deleting events and announcements)

### Administration (Admin Panel)
- Admin can view the details of the report
- Admin can approve, reject, approve and ban a user
- After 5 strikes, user will be permenantly banned
