import Hero from "@/components/explore/Hero";
import FilterBar from "@/components/explore/FilterBar";
import { NoteListing } from "@/types/types";
import ListingCard from "@/components/listing/ListingCard";

const Explore = () => {
  const listings = mockData;
  return (
    <main className="px-5 xl:px-0">
      <Hero />
      <FilterBar />

      <section className="w-full text-sm font-light my-10">
        <div className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard data={listing} />
          ))}
        </div>
      </section>
    </main>
  );
};

const mockData: NoteListing[] = [
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "qf102",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "qf102",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "qf102",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
];

export default Explore;
