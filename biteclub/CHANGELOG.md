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
[!NOTE]: The restaurant profile management features are currently not fully implemented. The business user has limited editing capabilities.

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

### Search
 * General User can search for a restaurant, blog post, and user

### Display Preferences
-  Users can toggle display preferences on the Settings page.
  - If toggle is off, that tab will be hided from public for their privacy. 

### Add to Favourite
- Users can add/remove item to/from their favourite list, and shown on user dashboard.
  - Restaurant
  - Blog Post

## Business User Related
### Business Users' Licences Upload
- A page where business users can upload documents to verify their restaurant ownership. 
