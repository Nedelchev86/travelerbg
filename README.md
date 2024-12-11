### Demo Links

- Demo on DigitalOcean - <a href="https://travelerbg.eu/" target="_blank">travelerBG.eu</a>
- Demo on Render / DB on aiven.io - <a href="https://travelerbg.onrender.com/" target="_blank">travelerbg.onrender.com</a>    (Free instance will spin down with inactivity, which can delay requests by 50 seconds or more)

Traveler: traveler@abv.bg   password: test\
Business Owner - b@abv.bg  password: test


### Technologies Used:
- Angular 18 with StandAlone Components 
- Server Python Django and Django REST framework
- Authentication: JWT (JSON Web Tokens)
- Database: PostgreSQL
  
#### Key Features
  - __CKEditor 5:__ A powerful rich text editor used for creating and editing content within the application.
  - __Angular Animations:__ Smooth and interactive animations to enhance the user experience.
  - __Toastr Notifications:__ Elegant and customizable toast notifications for displaying success, error, and informational messages.
  - __Google Maps__ Integration: Interactive maps to display locations of destinations and activities.
  - __Angular Guards:__ Route guards to protect certain routes and ensure that only authorized users can access specific parts of the application.
  - __Lazy Loading:__ The profile dashboard is lazy-loaded to improve the application's performance by loading the profile-related components only when the user navigates to the profile section.
  - __Cloudinary:__ Cloud-based image and video management for uploading, storing, and delivering images efficiently.
  - __Swiper:__ A modern touch slider for creating responsive and customizable sliders .

#### Guards

 1.  Destination ID Guard - This guard checks if the Destination is valid
 2.  Traveler ID Guard - This guard checks if the Traveler is valid
 3.  Hotel ID Guard - This guard checks if the Hotel is valid
 4.  Activity ID Guard - This guard checks if the Activity is valid
 5.  Destination ID Guard - This guard checks if the `destinationId` is valid
 6. The AuthGuard is a route guard that checks if the user is authenticated before allowing access to certain routes. If the user is not logged in, it displays an error message and redirects them to homepage. This guard helps protect sensitive routes and ensures that only authenticated users can access them.
 7. The AddHotelGuard is a route guard that checks if the current user has the BusinessProfile user type before allowing access to the route for adding a hotel. If the user is not authorized, it displays an error message and redirects them to the home page. This guard helps protect the route and ensures that only authorized users can access it.
 8. Is Activated Guard - Check if user is activated. User activation is automaticly true when fill his profile. If is not activated , can't post Destinations, Hotels or Activity, just can post comment and rate.
 9. Is owner gards and more ...

   ## How to start:
Using Angular CLI:

1. Install Angular CLI (if not already installed):\
```npm install -g @angular/cli```

2. Clone the repository:\
```git clone https://github.com/Nedelchev86/travelerbg.git```

3. Install dependencies:\
```cd travelerbg```\
```cd frontend```\
```npm install```

4. Use my API in environment.development\
  ```  apiUrl: 'https://orca-app-x6eo8.ondigitalocean.app/api/' ```

6. Run the application using Angular CLI:\
```ng serve```

7. Navigate to the application in your browser:\
```http://localhost:4200```



### Description
This project is a web application that serves two main user types: travelers and business owners. The platform allows users to add, manage, and explore various destinations, hotels, and activities. It aims to provide a seamless experience for both travelers looking for new adventures and business owners wanting to promote their services.

![main](https://github.com/user-attachments/assets/91a8260f-427b-4f2b-9658-9d2de4cf6996)


### Form Validations
![validation](https://github.com/user-attachments/assets/cb827009-2bd6-49fa-be3a-88b11633443e)

### Toasts notifications for success or error
![toast](https://github.com/user-attachments/assets/fb3373c6-3b28-4cb7-bbd2-944ee94fbf06)




### User Types - Travelers:

- Explore a wide range of destinations, hotels, and activities.
- Add and manage destinations and activities.
- Add destinations, hotels, and activities to their favorites.
- Rate and review destinations, hotels, and activities.
- Plan trips by browsing through detailed information and user reviews.

![traveler](https://github.com/user-attachments/assets/715ffa35-9a8f-4113-814b-ae1f84a42961)

Add and Edit Forms with Google Map and CKEditor 5 
![edit2](https://github.com/user-attachments/assets/001fd88d-97cf-4011-8340-f84705dd0e9e)

![edit3](https://github.com/user-attachments/assets/ba0dae6a-ed3c-49b6-b51a-adc081555006)




Traveler Dashboard: 
  A dedicated dashboard for travelers to manage their travel-related activities.
  Add and Edit Destinations: Travelers can easily add new destinations they have visited or plan to visit. They can also edit the details of existing destinations.
  Add and Edit Activities: Travelers can add new activities they have experienced or plan to experience. They can also edit the details of existing activities.
  Profile Management: Travelers can update their personal information, profile picture, and cover photo.
![edit](https://github.com/user-attachments/assets/b5171331-860e-40a9-b0ae-35d2830efde6)


## Browse hotels, destinations and activities
- Hotels
  ![hotels](https://github.com/user-attachments/assets/9ce47b3a-ffe1-41b1-bbca-2ba3b1204895)

- Destinations
  ![destinations](https://github.com/user-attachments/assets/353dd9fc-481d-472b-b44d-2b94a44c2d99)

## Comments for guest and registred user
![commentguest](https://github.com/user-attachments/assets/7e0842ee-fa5c-4195-909f-e4fd450c4830)
![commentreg](https://github.com/user-attachments/assets/1ba02579-b098-4614-8475-3f865a922af3)

## Manage all bookmarks in one page
![bookmar](https://github.com/user-attachments/assets/1d81aa7a-72eb-46ad-952a-191da4ad336f)


## User Types - Business owner:

Add and manage their own  hotels, and activities.
Update information and images for their listings.
View ratings and reviews left by travelers.
Promote their services to a broader audience.

![hotels](https://github.com/user-attachments/assets/0cc14c2b-457b-45cb-9ef1-978caa3e1e0c)


