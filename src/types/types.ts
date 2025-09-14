
export type Order = {
    id: number;
    note_id: number;
    buyer_id: string;
    status: string;
    stripe_transaction_id?: string | null;
    price: number;
}


export type User = {
    userId?: string;
    username: string;
    email?: string;
    yearOfStudy?: number;
    major?: string;
    modules?: string[];
    purchasedNotes?: string[];
}

export type NoteListing = {
    id: string;
    userId: string;
    userFullName: string;
    userImageUrl: string;
    yearOfStudy: number;
    major: string;
    description: string;
    originalName: string;
    tags: string[];
    price: number;
    type: string;
    module: string;
    createdAt: string; 
}

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

