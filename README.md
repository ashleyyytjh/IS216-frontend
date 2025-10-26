# 🏫 IS216 Web Application Development II

---

## Section & Group Number
G4 Group 16  

---

## Group Members

| Photo | Full Name | Role / Features Responsible For |
|:--:|:--|:--|
| <img src="https://ca.slack-edge.com/T09AVTB3U2Y-U09BEJARDDL-bd29e139dd9b-512" width="80"> | Soh De Lin Nicholas | Seller Dashboard, Profile Page |
| <img src="https://ca.slack-edge.com/T09AVTB3U2Y-U09BCKGBM6E-0cfae05e7807-512" width="80"> | Darren Ng Yi Jie | Notes Recommendations, Note Upload, Tutorial |
| <img src="https://ca.slack-edge.com/T09AVTB3U2Y-U09BCL1LW4A-bbe1a50348d9-512" width="80"> | Joel Ow | Backend Services (Users, Notes), Notes listing, Mindmap |
| <img src="/photos/ashley.jpg" width="80"> | Ashley Toh | Backend Services (Orders, Annotations), Payment, Forum, Login |
| <img src="https://ca.slack-edge.com/T09AVTB3U2Y-U09BEPZ817G-7c4181505ccd-512" width="80"> | Sim Jun Zhi Dylan | Order Details and Composing Notes UI |
| <img src="https://ca.slack-edge.com/T09AVTB3U2Y-U09B7FWLDM1-58f32e9f653a-512" width="80"> | Ashwin | Overall Styling of Web Application and Roadmap Page |

> Place all headshot thumbnails in the `/photos` folder (JPEG or PNG).

---

## Business Problem

The community problem our project aims to address is that we realise the process of purchasing notes in SMU to be a cumbersome process. Currently, a solution that exists is the AskSMU channel in Telegram, in which students can liase with sellers through the Education Resources topic in the channel. However, this would mean offline communication, handling of payments, and sending of files. Such way of notes distribution and purchase is cumbersome. 

Further research on competitors shows that Studocu and CourseHero aims to solve similar issues. However, these notes on AskSMU do not have these notes being listed on the platforms. Upon further research, we realise the lack of incentivisation on the current platforms being a missing gap as to why the notes are not being published. Thus, we aim to build a marketplace that allows SMU students to purchase and sell notes for the community;.

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
| Node based knoweldge graph  | Users can view informaton about their notes in the form of a graph, connecting different concepts and the relation between them as edges | Users can understand the meaning of the notes in a visual manner without much viewing before purchasing |
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
   <img src="screenshots/compose.png" width="600">  
   - Users can also reference a roadmap based on their degree to search for desired notes.

3. **Semantic Search**  
   <img src="screenshots/semanticsearch.png" width="600">  
   - User can search based on note content and embeddings generated rather than normal text search.

4. **Node based knowledge graph**  
   <img src="screenshots/nodeknowledgegraph.png" width="600">  
   - Users can summerise and view notes in a graph form showing connected concepts and relationships. 


### Create
1. **Compose Notes**  
   <img src="screenshots/compose.png" width="600">  
   - Users can choose to create their own notes on the platform.

2. **Upload Notes**  
   <img src="screenshots/uploadNotes_1.jpg" width="600">  
   <img src="screenshots/uploadNotes_2.jpg" width="600">  
   <img src="screenshots/uploadNotes_3.jpg" width="600">  
   <img src="screenshots/uploadNotes_4.jpg" width="600">  
   - Users can choose to upload via 4 step process.


#### Purchase
1. **Stripe payment**  
   <img src="screenshots/stripePayment.jpg" width="600">  
   - Users are able to purchase notes.
2. **Confirmation Pages**  
   <img src="screenshots/paymentSuccessful.jpg" width="600">  
   - Successul status.
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



> Save screenshots inside `/screenshots` with clear filenames.

---

## Developers Setup Guide

Comprehensive steps to help other developers or evaluators run and test your project.

---

### 0) Prerequisites
- [Git](https://git-scm.com/) v2.4+  
- [Node.js](https://nodejs.org/) v18+ and npm v9+  
- [Docker] (https://www.docker.com/)
- Access to backend or cloud services used (MongoDB Atlas, Supabase, AWS S3, AWS Cognito, AWS Amplify, Stripe)

---

### 1) Download the Project
```bash
git clone https://github.com/<org-or-user>/<repo-name>.git
cd <repo-name>
npm install
```

---

### 2) Configure Environment Variables
Create a `.env` file in the root directory with the following structure:

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

## Backend Environments (OrdersV3 Service)
```bash
PORT=<your_port>
USER_SERVICE_URL=<user_service_url>
NOTES_SERVICE_URL=<notes_service_url>

STRIPE_WEBHOOK_SECRET=<stripe_webhook_secret>
STRIPE_SECRET_KEY=s<stripe_secret_key>

SUPABASE_URL=<supa_base_url>
SUPABASE_KEY=<supa_base_key>

AWS_COGNITO_USERPOOL_ID=<cognito_userpool_id>
AWS_COGNITO_CLIENT_ID=<cognito_userpool_client_id>
AWS_COGNITO_M2M_CLIENT_SECRET=<cognito_m2m_client_secret>
AWS_COGNITO_M2M_CLIENT_ID=<cognito_m2m_client_id>
AWS_COGNITO_OAUTH_DOMAIN=<cognito_oauth_domain>
```

## Backend Environments (Annotations Service)
```bash
PORT=<your_port>

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
orders_service_url_internal=http://orders:<orders_service_port>/v1
notes_service_url_internal=http://notes:<notes_service_port>/v1
annotations_service_url_internal=http://annotations:<annotations_service_port>/v1
```

> Never commit the `.env` file to your repository.  
> Instead, include a `.env.example` file with placeholder values.
---

### 3) Backend / Cloud Service Setup

#### MongoDB
1.

#### Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/organizations)
2. Create a new project.
3. Head to dashboard, project settings
4. Under API Keys, retrieve the supabase key
5. Under Data API, retrieve supabase URL

#### AWS

#### Docker
1. Go to [Docker](https://www.docker.com/)
2. Install Docker

#### Stripe
1. Go to [Stripe](https://dashboard.stripe.com/)
2. Create Stripe account
3. Enter publishable key into frontend .env
4. Enter secret key into backend orders .env

#### Starting backend via Docker
1. Ensure that ./app/compose.yaml, stripe cli container api key is entered and not a placeholder. This is for local testing. 
2. Run docker compose up --build once, retrieve the webhook secret from the stripe container, insert into orders .env
3. Start the backend:
   ```bash
   cd ./apps
   docker compose up --build
   ```

---

### 4) Run the Frontend
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

| Area | Test Description | Expected Outcome |
|:--|:--|:--|
| Authentication | Register | User will be prompted to fill in more details on accountCreation page. Upon filling details, it will redirect user to home page |
| Authentication | Login | User successfully logins and he will be redirected to homepage and be able to access /profile page. |
| Authentication | Logout | User successfully signs out, and user state changes (navigation bar will not show the name.) |
| CRUD Operations | Add, Edit, Delete data | Database updates correctly |
| Responsiveness | Test on mobile & desktop | Layout adjusts without distortion |
| Navigation | All menu links functional | Pages route correctly |
| Error Handling | Invalid inputs or missing data | User-friendly error messages displayed |

#### Automated Testing (Optional)
If applicable:
```bash
npm run test
```

---

### 6) Common Issues & Fixes

| Issue | Cause | Fix |
|:--|:--|:--|
| `Module not found` | Missing dependencies | Run `npm install` again |
| `CORS policy error` | Backend not allowing requests | Enable your domain in CORS settings |
| `.env` variables undefined | Missing `VITE_` prefix | Rename variables to start with `VITE_` |
| `npm run dev` fails | Node version mismatch | Check Node version (`node -v` ≥ 18) |

---

## Group Reflection

Each member should contribute 2–3 sentences on their learning and project experience.

> - *Nicholas:* Learned to build user-friendly frontend based on components by UI libraries and customisation of these libraries. The experience has allowed me to become stronger in data manipulation to present my data in a logical manner.
> - *Ashley:* Learned to build reusable Vue components and manage state effectively.  
> - *Ashwin:* Gained experience connecting frontend and backend APIs.  
> - *Darren:* Learnt to hook up backend api endpoints to frontend and learnt more about UI librares like shadcn and how they work under the hood. This experience has gave move exposure on the structure of frontend like components, props and layout and how to break each design of frontends into reusuable and neat components.   
> - *Dylan:* Gained hands-on experience creating responsive and user-friendly web interfaces, integrating various libraries to enhance functionality and design. The project helped me to understand the overall structure of a full working web application and how frontend components connect with backend logic.  
> - *Joel:* Understood how Firebase Authentication and Firestore integrate with modern SPAs.  

As a team, reflect on:
- Key takeaways from working with real-world frameworks  
- Challenges faced and how they were resolved  
- Insights on teamwork, project management, and problem-solving  
