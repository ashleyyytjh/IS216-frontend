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

