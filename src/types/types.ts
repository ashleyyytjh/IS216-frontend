// const OrderModel = z.object( {
// 	id: z.int(),
//     note_id: z.string().min( 1 ),
//     buyer_id: z.string().min( 1 ),
//     status: z.string().min( 1 ),
//     stripe_transaction_id: z.string().nullable().optional(),
//     price: z.number().min( 0 ),
// })
export type Order = {
    id: number;
    note_id: number;
    buyer_id: string;
    status: string;
    // stripe_transaction_id?: string | null;
    price: number;
}


// {
//     "sub": "594a352c-2081-706e-b679-00b936e6b8f9",
//     "email": "owjoel@gmail.com",
//     "username": "owjoel",
//     "yearOfStudy": 4,
//     "major": "Computer Science",
//     "modules": [
//         "cs425",
//         "is216"
//     ],
//     "purchasedNotes": [
//         "68b98faba389fd1819c78c17"
//     ]
// }
export type User = {
    userId: string;
    username: string;
    email?: string;
    yearOfStudy?: number;
    major?: string;
    modules?: string[];
    purchasedNotes?: string[];
}
// {
//     "id": "68b98faba389fd1819c78c17",
//     "userId": "594a352c-2081-706e-b679-00b936e6b8f9",
//     "description": "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
//     "key": "594a352c-2081-706e-b679-00b936e6b8f9/2025-09-04-c4331de7-7658-4f30-a72f-8f10cb8c965f-cs425-week2-vector-semantics-and-word-embeddings.pdf",
//     "originalName": "CS425 Week2 Vector Semantics and Word Embeddings.pdf",
//     "mimeType": "application/pdf",
//     "size": 1485324,
//     "tags": [
//         "Natural Language Processing",
//         "Machine Learning",
//         "cs425"
//     ],
//     "price": 5000,
//     "type": "notes",
//     "module": "cs425",
//     "createdAt": "2025-09-04T13:10:03.602Z"
// }

export type Note = {
    id: string;
    userId: string;
    description: string;
    key?: string;
    originalName: string;
    mimeType: string;
    size?: number;
    tags: string[];
    price: number;
    type: string;
    module: string;
    createdAt: string;
} 