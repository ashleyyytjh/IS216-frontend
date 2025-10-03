// import { NoteListing } from "@/types/types";
// import { courseGradient } from "@/utils/colors";
// import { formatPriceSGD } from "@/utils/currency";
// import { formatRelativeMonthYear } from "@/utils/dates";
// import { Heart } from "lucide-react";
// import { Badge } from '@/components/ui/badge';
// import { Separator } from "@/components/ui/separator";
// import { Button } from "./ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
// import FilterBar from "./explore/FilterBar";

// // const mockData: NoteListing[] = [
// //   {
// //     id: "68b98faba389fd1819c78c17",
// //     userId: "594a352c-2081-706e-b679-00b936e6b8f9",
// //     userFullName: "Ashley Toh",
// //     userImageUrl:
// //       "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
// //     major: "Computer Science",
// //     yearOfStudy: 4,
// //     description:
// //       "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
// //     originalName: "Vector Semantics & Word Embeddings",
// //     tags: ["NLP", "Machine Learning", "cs425"],
// //     price: 5,
// //     type: "notes",
// //     module: "cs425",
// //     createdAt: "2025-09-04T13:10:03.602Z",
// //   },
// //   {
// //     id: "68b98faba389fd1819c78c17",
// //     userId: "594a352c-2081-706e-b679-00b936e6b8f9",
// //     userFullName: "Ashley Toh",
// //     userImageUrl:
// //       "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
// //     major: "Computer Science",
// //     yearOfStudy: 4,
// //     description:
// //       "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
// //     originalName: "Vector Semantics & Word Embeddings",
// //     tags: ["NLP", "Machine Learning", "cs425"],
// //     price: 5,
// //     type: "notes",
// //     module: "cs425",
// //     createdAt: "2025-09-04T13:10:03.602Z",
// //   },
// //   {
// //     id: "68b98faba389fd1819c78c17",
// //     userId: "594a352c-2081-706e-b679-00b936e6b8f9",
// //     userFullName: "Ashley Toh",
// //     userImageUrl:
// //       "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
// //     major: "Computer Science",
// //     yearOfStudy: 4,
// //     description:
// //       "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
// //     originalName: "Vector Semantics & Word Embeddings",
// //     tags: ["NLP", "Machine Learning", "cs425"],
// //     price: 5,
// //     type: "notes",
// //     module: "cs425",
// //     createdAt: "2025-09-04T13:10:03.602Z",
// //   },
// //   {
// //     id: "68b98faba389fd1819c78c17",
// //     userId: "594a352c-2081-706e-b679-00b936e6b8f9",
// //     userFullName: "Ashley Toh",
// //     userImageUrl:
// //       "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
// //     major: "Computer Science",
// //     yearOfStudy: 4,
// //     description:
// //       "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
// //     originalName: "Vector Semantics & Word Embeddings",
// //     tags: ["NLP", "Machine Learning", "cs425"],
// //     price: 5,
// //     type: "notes",
// //     module: "cs425",
// //     createdAt: "2025-09-04T13:10:03.602Z",
// //   },
// //   {
// //     id: "68b98faba389fd1819c78c17",
// //     userId: "594a352c-2081-706e-b679-00b936e6b8f9",
// //     userFullName: "Ashley Toh",
// //     userImageUrl:
// //       "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
// //     major: "Computer Science",
// //     yearOfStudy: 4,
// //     description:
// //       "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
// //     originalName: "Vector Semantics & Word Embeddings",
// //     tags: ["NLP", "Machine Learning", "cs425"],
// //     price: 5,
// //     type: "notes",
// //     module: "cs425",
// //     createdAt: "2025-09-04T13:10:03.602Z",
// //   },
// //   {
// //     id: "68b98faba389fd1819c78c17",
// //     userId: "594a352c-2081-706e-b679-00b936e6b8f9",
// //     userFullName: "Ashley Toh",
// //     userImageUrl:
// //       "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
// //     major: "Computer Science",
// //     yearOfStudy: 4,
// //     description:
// //       "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
// //     originalName: "Vector Semantics & Word Embeddings",
// //     tags: ["NLP", "Machine Learning", "cs425"],
// //     price: 5,
// //     type: "notes",
// //     module: "cs425",
// //     createdAt: "2025-09-04T13:10:03.602Z",
// //   },
// //   {
// //     id: "68b98faba389fd1819c78c17",
// //     userId: "594a352c-2081-706e-b679-00b936e6b8f9",
// //     userFullName: "Ashley Toh",
// //     userImageUrl:
// //       "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
// //     major: "Computer Science",
// //     yearOfStudy: 4,
// //     description:
// //       "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
// //     originalName: "Vector Semantics & Word Embeddings",
// //     tags: ["NLP", "Machine Learning", "cs425"],
// //     price: 5,
// //     type: "notes",
// //     module: "qf102",
// //     createdAt: "2025-09-04T13:10:03.602Z",
// //   },
// //   {
// //     id: "68b98faba389fd1819c78c17",
// //     userId: "594a352c-2081-706e-b679-00b936e6b8f9",
// //     userFullName: "Ashley Toh",
// //     userImageUrl:
// //       "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
// //     major: "Computer Science",
// //     yearOfStudy: 4,
// //     description:
// //       "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
// //     originalName: "Vector Semantics & Word Embeddings",
// //     tags: ["NLP", "Machine Learning", "cs425"],
// //     price: 5,
// //     type: "notes",
// //     module: "qf102",
// //     createdAt: "2025-09-04T13:10:03.602Z",
// //   },
// //   {
// //     id: "68b98faba389fd1819c78c17",
// //     userId: "594a352c-2081-706e-b679-00b936e6b8f9",
// //     userFullName: "Ashley Toh",
// //     userImageUrl:
// //       "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
// //     major: "Computer Science",
// //     yearOfStudy: 4,
// //     description:
// //       "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
// //     originalName: "Vector Semantics & Word Embeddings",
// //     tags: ["NLP", "Machine Learning", "cs425"],
// //     price: 5,
// //     type: "notes",
// //     module: "qf102",
// //     createdAt: "2025-09-04T13:10:03.602Z",
// //   },
// // ];
// export const NoteDisplay = ()=>{
//     return (
//           <main className="w-full">
//           {/* <FilterBar /> */}
//           <section className="w-full text-sm font-light my-10">
//             <div className="mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//               {mockData.map((listing) => (
//                 <Card className="p-4 rounded-md transition-shadow duration-300 hover:shadow-xl">
//                   <CardHeader className="flex items-stretch gap-4 p-0">
//                     <Avatar className="h-12 w-12 rounded-md overflow-hidden">
//                       <AvatarImage
//                         src={listing.userImageUrl}
//                         className="object-cover"
//                       />
//                       <AvatarFallback>??</AvatarFallback>
//                     </Avatar>

//                     <div className="flex-1 flex flex-col justify-center gap-1">
//                       <div className="flex">
//                         <p className="flex-1 font-medium">{listing.userFullName}</p>
//                         <p className="text-xs text-muted-foreground">
//                           {formatRelativeMonthYear(listing.createdAt)}
//                         </p>
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         Year {listing.yearOfStudy} {listing.major}
//                       </p>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="space-y-2 p-0 pb-3">
//                     <h3 className="font-semibold">{listing.originalName}</h3>
//                     <p className="text-sm line-clamp-2">{listing.description}</p>
//                     <div className="flex flex-wrap text-xs text-muted-foreground">
//                       {listing.tags.map((tag, i) => (
//                         <div key={tag} className="flex items-center">
//                           <Badge
//                             variant="secondary"
//                             className="bg-transparent border-0 p-0 rounded-none font-normal text-muted-foreground hover:bg-transparent cursor-default"
//                           >
//                             {tag}
//                           </Badge>
//                           {i < listing.tags.length - 1 && (
//                             <span className="mx-2 text-muted-foreground">•</span>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>

//                   <CardFooter className="flex items-center justify-between p-0">
//                     <div className="flex h-6 gap-2">
//                       <Badge
//                         className="text-sm font-normal rounded-full border-none bg-linear-to-r text-white uppercase"
//                         style={{ background: courseGradient(listing.module) }}
//                       >
//                         {listing.module}
//                       </Badge>
//                       <Separator orientation="vertical" color="blue" />
//                       <span className="font-mono flex items-center">{formatPriceSGD(listing.price)}</span>
//                     </div>
//                     <Button className="h-8 w-8 px-2 py-2" variant="outline">
//                       <Heart className="text-muted-foreground" />
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         </main>

//     )



// }

