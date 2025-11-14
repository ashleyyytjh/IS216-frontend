# 🏫 IS216 Web Application Development II

---

## Section & Group Number
G4 Group 16  

---

## Group Members

| Photo | Full Name | Role / Features Responsible For |
|:--:|:--|:--|
| <img src="/photos/nic.jpg" width="80"> | Soh De Lin Nicholas | Seller Dashboard, Profile Page |
| <img src="/photos/Darren.png" width="80"> | Darren Ng Yi Jie | Notes Recommendations, Note Upload, Tutorial |
| <img src="/photos/joel.jpg" width="80"> | Joel Ow | Backend Services (Users, Notes), Notes listing, Mindmap |
| <img src="/photos/ashley.jpg" width="80"> | Ashley Toh | Backend Services (Orders, Annotations), Payment, Forum, Login |
| <img src="/photos/dylan.jpg" width="80"> | Sim Jun Zhi Dylan | Order Details and Composing Notes UI |
| <img src="/photos/ashwin.jpg" width="80"> | Ashwin | Overall Styling of Web Application and Roadmap Page |

---

## Business Problem

The community problem our project aims to address is that we realise the process of purchasing notes in SMU to be a cumbersome process. Currently, a solution that exists is the AskSMU channel in Telegram, in which students can liaise with sellers through the Education Resources topic in the channel. However, this would mean offline communication, handling of payments, and sending of files. Such way of notes distribution and purchase is cumbersome. 

Further research on competitors shows that Studocu and CourseHero aims to solve similar issues. However, these notes on AskSMU do not have these notes being listed on the platforms. Upon further research, we realise the lack of incentivisation on the current platforms being a missing gap as to why the notes are not being published. Thus, we aim to build a marketplace that allows SMU students to purchase and sell notes for the community.

---

## Web Solution Overview

### 🎯 Intended Users
- SMU Students who are in need of notes for their modules
- SMU Studens who would want to sell their notes and earn some quick cash.

### 💡 What Users Can Do & Benefits

| Feature | Description | User Benefit |
|:--|:--|:--|
| Register & Login | Secure authentication system | Personalized experience and data security |
| Product Listing | View all notes within the web application | Users can view these notes and make a selection based on their wants. |
| Note Recommendation System | Find notes based on modules you have taken and time of the semester | Allows students to have quick access of the modules they are taking without having to search |
| Semantic Search | Allows for search based on note content and embeddings generated rather than normal text search | Quick search for notes users would need. |
| Node based knowledge graph  | Users can view information about their notes in the form of a graph, connecting different concepts and the relation between them as edges | Users can understand the meaning of the notes in a visual manner without much viewing before purchasing |
| Forum | Buyers can leave comments and question on certain parts of the notes they own for sellers. Sellers can answer these questions. | Creates a form of communication between buyers and sellers after purchasing a certain note for clarification. |
| Seller Dashboard | Sellers can view key metrics on the notes they sold and their performance.  | Sellers can analyse and know how to improve on their sales. They would know which notes to sell, and at certain price points. |
| Compose Notes | Rather than uploading notes, sellers can write their own notes within the application and post them as articles for students to view.  | Sellers can create notes on the go, rather than uploading a certain note in their computer. |
| Payment for notes | Students can purchase their notes on the application.  | Allows student to link their card and pay via stripe API. |
---

## Tech Stack

### 🧱 Tech Stack Overview

#### Frontend
| Logo | Technology | Purpose / Usage |
|:--:|:--|:--|
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" width="40"> | **React** | Frontend framework for building dynamic user interfaces |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/tailwind/tailwind.png" width="40"> | **TailwindCSS** | Utility-first CSS framework for styling and responsive layouts |
| <img src="https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/og.jpg" width="40"> | **Shadcn/UI** | Pre-built accessible UI components styled with TailwindCSS |
| <img src="https://vitejs.dev/logo.svg" width="40"> | **Vite** | Lightning-fast development server and build tool |

#### Backend
| Logo | Technology | Purpose / Usage |
|:--:|:--|:--|
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png" width="40"> | **Node.js** | JavaScript runtime for backend execution |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png" width="40"> | **TypeScript** | Strongly-typed superset of JavaScript for maintainable backend code |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/express/express.png" width="40"> | **Express.js** | Web framework for building RESTful APIs |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png" width="40"> | **Docker** | Containerization for development process |

### Deployment
| Logo | Technology | Purpose / Usage |
|:--:|:--|:--|
| <img src="https://repository-images.githubusercontent.com/100966547/fc3c3680-355c-11eb-9554-8df45a88295b" width="40"> | **AWS Cognito** | User authentication and authorization service |
| <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUlDqQ4KhvbzAUcyYoAvroy03MDJontu8baA&s" width="40"> | **AWS ECS** | Container orchestration for backend microservices |
| <img src="https://avatars.githubusercontent.com/u/41077760?s=200&v=4" width="40"> | **AWS Amplify** | Hosting and CI/CD for the frontend React app |

#### Data
| Logo | Technology | Purpose / Usage |
|:--:|:--|:--|
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/mongodb/mongodb.png" width="40"> | **MongoDB** | NoSQL database for document-oriented data storage |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/supabase/supabase.png" width="40"> | **Supabase** | Postgres-based backend-as-a-service for structured data |
| <img src="https://user-images.githubusercontent.com/15157491/75435753-6929fc80-594b-11ea-9e19-f78223916862.png" width="40"> | **AWS S3** | Object storage for images, files, and note uploads |
| <img src="https://e7.pngegg.com/pngimages/890/101/png-clipart-rabbitmq-advanced-message-queuing-protocol-message-queue-computer-network-others-miscellaneous-computer-network-thumbnail.png" width="40"> | **RabbitMQ** | Message broker for asynchronous communication between services |

---

## Use Case & User Journey

Provide screenshots and captions showing how users interact with your app.
For the testing of the web application, we have tested from viewport of 375 px (Iphone 6/7/8) to Bootstrap XL, based on the projet requirements.

#### Introduction
1. **Landing Page**  
   <img src="screenshots/landing.png" width="600">  
   - Displays the homepage introducing OnlyNotes with options to browse or sell notes, followed by sections highlighting platform benefits, step-by-step guides for buyers and sellers, curated study roadmaps for guidance, and recommended notes.

2. **Register & Login**  
   <img src="screenshots/register.png" width="600">  
   <img src="screenshots/login.png" width="600">  
   - Users can register for an account and login.

3. **Note Recommendation System**  
   <img src="screenshots/noterecommendation.png" width="600">  
   - Users can find notes based on modules they have taken and time of the semester


#### Search
1. **Product Listing**  
   <img src="screenshots/productlisting.png" width="600">  
   - Users are able to view notes put up by other users.

2. **Roadmap**  
   <img src="screenshots/roadmap.png" width="600">  
   - Users can also reference a roadmap based on their degree to search for desired notes.

3. **Semantic Search**  
   <img src="screenshots/semanticsearch.png" width="600">  
   - User can search based on note content and embeddings generated rather than normal text search.

4. **Node based knowledge graph**  
   <img src="screenshots/nodeknowledgegraph.png" width="600">  
   - Users can summarize and view notes in a graph form showing connected concepts and relationships. 


### Create
1. **Compose Notes**  
   <img src="screenshots/compose.png" width="600">  
   - Users can choose to create their own notes on the platform.

2. **Upload Notes**  
   <img src="screenshots/uploadNotes_1.jpg" width="600">  
   <img src="screenshots/uploadNotes_2.jpg" width="600">  
   <img src="screenshots/uploadNotes_3.jpg" width="600">  
   <img src="screenshots/uploadNotes_4.jpg" width="600">  
   <img src="screenshots/successUpload.png" width="600">  
   - Users can choose to upload via 4 step process.


#### Purchase
1. **Stripe payment**  
   <img src="screenshots/stripePayment.jpg" width="600">  
   - Users are able to purchase notes.
2. **Confirmation Pages**  
   <img src="screenshots/paymentSuccessful.jpg" width="600">  
   - Successful status.
   <img src="screenshots/paymentFailed.jpg" width="600">  
   - Unsuccessful status.


#### Discuss
1. **Forum**  
   <img src="screenshots/forum.png" width="600">  
   - Users can discuss in a forum regarding their purchased notes, specific text quotes can be highlighted for reference.


#### Dashboard
1. **Seller Dashboard**  
   <img src="screenshots/dashboard1.png" width="600">  
   <img src="screenshots/dashboard2.png" width="600">  
   - Users can view key metrics regarding the performance of their notes.


---

## Developers Setup Guide

Comprehensive steps to help other developers or evaluators run and test your project.

---

### 0) Prerequisites
- [Git](https://git-scm.com/) v2.4+  
- [Node.js](https://nodejs.org/) v18+ and npm v9+  
- [Docker](https://www.docker.com/)
- Access to backend or cloud services used (MongoDB Atlas, Supabase, AWS S3, AWS Cognito, AWS Amplify, Stripe)

---

### 1) Download the Project
```bash
git clone https://github.com/ashleyyytjh/IS216-frontend.git
cd <IS216-frontend>
npm install
```

---

### 2) Configure Environment Variables
Create a `.env` file in the root directory with the following structure:
note that for backend services. 
under notes folder we have notes and users services
under orders folder, we have orders and annotation services

## Frontend Environments
```bash
VITE_COGNITO_USER_POOL_ID=<cognito_userpool_id>
VITE_COGNITO_USER_POOL_CLIENT_ID=<cognito_userpool_client_id>
VITE_BASE_URL=<api_gateway_url>
VITE_STRIPE_PROMISE=<your_stripe_publishable_key>
```

## Backend Environments (Notes Service)
```bash
# APP
PORT=<your_port>
NODE_ENV=dev
CLIENT=<client_url>
USERS_HOST=<users_service_url>

AWS_REGION=<aws_region>
AWS_COGNITO_USERPOOL_ID=<cognito_userpool_id>
AWS_COGNITO_CLIENT_ID=<cognito_userpool_client_id>
AWS_COGNITO_M2M_CLIENT_SECRET=<cognito_m2m_client_secret>
AWS_COGNITO_M2M_CLIENT_ID=<cognito_m2m_client_id>
AWS_COGNITO_OAUTH_DOMAIN=<cognito_oauth_domain>
AWS_ACCESS_KEY_ID=<your_aws_access_key>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>

S3_BUCKET_NAME=<your_s3_bucket_name>
S3_IMAGES_BUCKET=<your_s3_image_bucket_name>

RABBITMQ_URL=<rabbitmq_url>

DB_PROTOCOL=<mongo_db_protocol>
DB_USERNAME=<mongo_db_user>
DB_PASSWORD=<mongo_db_password>
DB_HOST=<mongo_db_host>
DB_NAME=<mongo_db_name>

# OPENAI
OPENAI_API_KEY=<your_openai_key>
```

## Backend Environments (Orders Service)
```bash
PORT=<your_port>
USER_SERVICE_URL=<user_service_url>
NOTES_SERVICE_URL=<notes_service_url>

STRIPE_WEBHOOK_SECRET=<stripe_webhook_secret>
STRIPE_SECRET_KEY=<stripe_secret_key>

SUPABASE_URL=<supa_base_url>
SUPABASE_KEY=<supa_base_key>

AWS_COGNITO_USERPOOL_ID=<cognito_userpool_id>
AWS_COGNITO_CLIENT_ID=<cognito_userpool_client_id>
AWS_COGNITO_M2M_CLIENT_SECRET=<cognito_m2m_client_secret>
AWS_COGNITO_M2M_CLIENT_ID=<cognito_m2m_client_id>
AWS_COGNITO_OAUTH_DOMAIN=<cognito_oauth_domain>
```


## Backend Environments (Proxy APIGateway Service Local testing)
```bash
# users_service_url_internal=http://users:8001/v1
# annotations_service_url_internal=http://annotations:8003/v1
orders_service_url_internal=http://orders:8002/v1
notes_service_url_internal=http://notes:8000/v1
```

> Never commit the `.env` file to your repository.  
> Instead, include a `.env.example` file with placeholder values.
---

### 3) Backend / Cloud Service Setup

#### MongoDB
1. Used by the Notes and Users resources. a NoSQL database that allows for vector searching and implement aggregation pipelines across different kinds of notes.
2. We have a running mongo instance we use for production. Feel free to connect to that. The DSN is in the .env provided.
3. On the off chance you want to use your own mongodb, please create one on Mongo Atlas Cloud, which connects to a ElasticSearch instance behind the scenes for vector search capabilities. Self-hosting solutions are unlikely to support this. Copy the required username, password, host details into the .env fields .

#### Supabase
1. Postgres development platform used by Orders and Annotations resources.
2. Go to [Supabase Dashboard](https://supabase.com/dashboard/organizations)
3. Create a new project.
4. Head to dashboard, project settings
5. Under API Keys, retrieve the supabase key
6. Under Data API, retrieve supabase URL

#### AWS
1. AWS as main cloud services provider. Provides compute, load balancing/routing, and auth functionalities.
2. As the setup on AWS is non-trivial, please use the AWS credentials provided in the .env for the purpose of running this project.

#### Docker
1. Container runtime for local setup.
2. Go to [Docker](https://www.docker.com/)
3. Install Docker

#### Stripe
1. Payments tenant.
2. Go to [Stripe](https://dashboard.stripe.com/)
3. Create Stripe account
4. Enter publishable key into frontend .env
5. Enter secret key into backend orders .env


---
### 4) Runing the Backend
#### Starting backend via Docker
1. Ensure that ./app/compose.yaml, stripe cli container,stripe secret key is entered and not a placeholder. This is for local testing. (--api-key STRIPE_SECRET_KEY)
2. Run docker compose up --build once, retrieve the webhook secret from the stripe container, insert into orders .env under STRIPE_WEBHOOK_SECRET
3. Start the backend:
   ```bash
   cd ./apps
   docker compose up --build
   ```
---

### 5) Run the Frontend
To start the development server:
```bash
npm run dev
```
The project will run on [http://localhost:5173](http://localhost:5173) by default.

To build and preview the production version:
```bash
npm run build
npm run preview
```

---

### 5) Testing the Application

#### Manual Testing
Perform the following checks before submission:


##### Buyer Related Tests
| Area | Test Description | Expected Outcome |
|:--|:--|:--|
| Authentication | Register | User will be prompted to fill in more details on accountCreation page. Upon filling details, it will redirect user to home page |
| Authentication | Login | User successfully logins and he will be redirected to homepage and be able to access /profile page. |
| Authentication | Logout | User successfully signs out, and user state changes (navigation bar will not show the name.) |
| CRUD Operations | Editing or profile's (Major, etc) | Database updates correctly and upon refresh, fields should be changed in /profile|
| Search/Filter | Search by keywords; apply filters/sort | Results update; empty state when no matches |
| Listing View | Open listing; mindmap | Able to see node based knowledge graph of the note  |
| Access Control | Download purchased note | Download succeeds; presigned/direct URL blocked for others/logged-out |
| Access Control | Attempt to download unpurchased note | Server denies direct URL |
| Responsiveness | Test on mobile & desktop | Layout adjusts without distortion |
| Navigation | All menu links functional | Pages route correctly |
| Error Handling | Invalid inputs or missing data | User-friendly error messages displayed |

##### Seller Related Tests
| Area | Test Description | Expected Outcome |
|:--|:--|:--|
| Seller Dashboard | View Dashboard | If user first entered the page without transaction, the charts and tables will look empty. Upon having transactions, the bar charts, scatter charts will start to populate. Tables will also populate when notes are uploaded or orders are made by buyers. |
| Seller Dashboard | Dashboard Interaction | Points on the scatter chart will be interactive. Users can click on it and they will be navigated to the listing/ article page. The bar charts can also be filtered according to module and increasing/descending order. |
| Seller Dashboard | Order Transactions | Clicking on the row will navigate user to the specific order details page. |
| Seller Dashboard | Uploaded Notes  | When user views the uploaded notes table, they will be able to view details of it or delete them using buttons. The notes should be deleted when the deleted button is clicked and, when the details button is clicked, it navigates them to the specific listing page. The button cannot be clicked when the notes is still categorised as processing. |
| Seller Dashboard | Written Notes | Users are able to conduct 3 operations, delete composed notes, view composed notes, and edit composed notes. Viewing the composed note and editing the composed note will navigate them to a new page while deleting composed note will just delete the note with a toast that says 'Successful deletion of note'. Additionally, users can use the toggle to hide/display their note to the public. Once clicked, it will show relevant toast messages too. When in card view, one can only view the details of his notes when he have published, else, he can only edit or delete (shows same information but in a different style.) |
| Note Creation | Upload Notes | Clicking on Create, it will allow users to choose two types of upload methods. Upload or Compose. Clicking on Upload will bring them to a page which asks them to first upload their notes. Clicking on next will allow users to populate the relevant details. |
| Note Creation | Upload Notes - Processing | At the last step, the screen will display processing, where backend and database insertion is occuring. Once done, the user will be directed to a success page. Do note that, the time taken for this will be a little long (approx 3-4 mins) due to backend processing. In the meantime, you can browse other pages first, so you do not need to wait. |
| Note Creation | Upload Notes - Compose | Clicking on Compose in the Create page, It will bring the users to a screen in which they can fill in certain note details like price, note title, amongst others. Clicking on the Save button, it will navigate users to the article page, where their written notes will be displayed in the form of an article.  |

---

### 6) Common Issues & Fixes

| Issue | Cause | Fix |
|:--|:--|:--|
| `Module not found` | Missing dependencies | Run `npm install` again |
| `CORS policy error` | Backend not allowing requests | Enable your domain in CORS settings |
| `.env` variables undefined | Missing `VITE_` prefix | Rename variables to start with `VITE_` |
| `npm run dev` fails | Node version mismatch | Check Node version (`node -v` ≥ 18) |
| Unable to highlight annotations in lower viewports | Difference between how Chrome and other browsers handles DOM. | Try testing the highlighting feature on Firefox with a smaller viewport. |

---

## Group Reflection

Each member should contribute 2–3 sentences on their learning and project experience.

 - *Nicholas:* Learned to build user-friendly frontend based on components by UI libraries and customisation of these libraries. The experience has allowed me to become stronger in data manipulation to present my data in a logical manner. Gained experience in hooking up backend code with frontend libraries in a quick manner and effectively. 
 - *Ashley:* Had the experience to touch on different visual libraries such as framer motion and tailwind animations. Gained more experience in implementing new kinds of services, such as the forum for both front and backend. Great experience to learn and adapt together with teammates of varying experiences and eventually produce a great product together.
 - *Ashwin:* Learned to design and structure an interactive page that connects data with dynamic UI components, and also gained experience with integrating reusable components to improve usability and modularity. This helped me understand how to organize large-scale frontend logic cleanly while maintaining a responsive and user-friendly interface.  
 - *Darren:* Learnt to hook up backend api endpoints to frontend and learnt more about UI librares like shadcn and how they work under the hood. This experience has gave more exposure on the structure of frontend like components, props and layout and how to break each design of frontends into reusable and neat components.   
 - *Dylan:* Gained hands-on experience creating responsive and user-friendly web interfaces, integrating various libraries to enhance functionality and design. The project helped me to understand the overall structure of a full working web application and how frontend components connect with backend logic.  
 - *Joel:* Learned how to use common graph layout libraries like Dagr, react-flow to show workflow/mindmap flows. Experienced using proper form validation using react-form-hook and zod, I previously always handled validation manually using regex. Learnt more about how React hydrates pages, and the proper use of certain hooks like useEffect and useMemo.  


### Key takeaways from working with real-world frameworks 
After working on OnlyNotes for the past semester, the main takeaway we have gained from working with real-world frameworks is that documentation and previous experience from people is a very important step in the development process. Since there are many people out there who are using such frameworks, documentation and forums like StackOverflow and Reddit proved to be very valuable sources for us while we were working on the project. When we face some bugs, they are usually the first few spots we seek answers from.

### Challenges faced and how they were resolved  
A key challenge we encountered was integrating multiple services and ensuring smooth communication between the frontend and backend. At first, while hooking up the data, some of our frontend developers had some issues, but as a group, we overcame them by breaking down the issue, and communicating with our backend team.

### Insights on teamwork, project management, and problem-solving  
On teamwork, project management and problem-solving, our team mainly operates in the way where every week, we try to accomplish as much as possible as we can for the project. Along the way, we will ask each other questions in the quickest time possible to get the work done fast. We use our time in class as a way to provide each other with updates about the project, and also about any hiccups we face, so that we know how to move forward with the project. As a group, we would try to solve problems on our own first, before approaching other members about the issues we currently have on our plate.

## Usage of AI/LLMs
| Area of Usage | Yes/No | Description |
|:--|:--|:--|
| Information Search | Yes | - |
| Generating website concepts, layouts, or themes | Yes | - |
| Exploring UI/UX design inspirations | Yes | - |
| Boilerplate code generation (starter code, small code snippets) | Yes  | - |
| Generating unit tests, sample inputs, or mock data | No | - |
| Core implementation tasks | No | - |
| Major business logic, backend endpoints, or critical frontend interactivity | No | - |
| Solving significant implementation issues | No | - |


