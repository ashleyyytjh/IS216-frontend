
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Star, Calendar } from 'lucide-react';
import { date } from 'zod';

const UserActivityListing = ({ note, onDownload }) => {
    const [downloadState, setDownloadState] = useState(String || null);

    const handleDownload = () => {
        setDownloadState('downloading');
        setTimeout(() => {
            setDownloadState('completed');
            setTimeout(() => {
                setDownloadState(null);
            }, 2000);
        }, 1500);

        if (onDownload) onDownload(note.id);
    };

    const getDownloadText = () => {
        if (downloadState === 'downloading') return 'Downloading...';
        if (downloadState === 'completed') return 'Downloaded!';
        return note.status === 'downloaded' ? 'Re-download' : 'Download';
    };

    const getStatusColor = () => {
        switch (note.status) {
            case 'downloaded': return 'bg-green-500';
            case 'downloading': return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };
    const isoString = note['note']['createdAt']
    let dateObject = new Date(isoString);
    let currentDay = new Date();
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
    const utc2 = Date.UTC(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
    const differenceInDays = Math.floor(Math.abs(utc2 - utc1) / millisecondsInDay);
    const formatCurrency = (n: number) =>
        n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });
    console.log(note)
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            {/* Gradient Header */}


            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{note.note.originalName}</span>
                    <Badge variant="outline" className="font-mono">
                        {note.note.module}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {note.note.userFullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{note.note.userFullName}</p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                    {note.note.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {note.note.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>

                {/* Rating and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{note.rating} ({note.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{dateObject.toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-2xl font-bold text-black-600">{formatCurrency(note.price)}</span>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2 pt-0">
                <Button
                    className="flex-1 hover:shadow-xl text-white"
                    onClick={handleDownload}
                    disabled={downloadState === 'downloading'}
                >
                    <Download className="w-4 h-4 mr-2" />
                    {getDownloadText()}
                </Button>
                <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

// Sample usage with data

// Export the component

// Example usage:
// <NoteCard note={sampleNote} onDownload={(id) => console.log(`Downloaded note ${id}`)} />

// const UserActivityListing = (note) => {
//     const isoString = note['note']['createdAt']
//     let dateObject = new Date(isoString);
//     let currentDay = new Date();
//     const millisecondsInDay = 1000 * 60 * 60 * 24;
//     const utc1 = Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
//     const utc2 = Date.UTC(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
//     const differenceInDays = Math.floor(Math.abs(utc2 - utc1) / millisecondsInDay);
//     const formatCurrency = (n: number) =>
//         n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });
//     return (
//         <Card className="pl-2 pr-2 pt-4 pb-4 border rounded-lg transition-all duration-300 hover:bg-muted/50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group">

//             <CardHeader>
//                 {/* note.note.originalName */}
//                 <CardTitle className="flex-1 gap-y-4">
//                     {
//                         note.location == "seller" ? (
//                             <p className="text">{note.note.originalName}</p>
//                         ) : (
//                             <p className="text">{note['note']['note']['tags'][0]}</p>
//                         )
//                     }

//                 </CardTitle>

//                 <CardDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-y-4">
//                     <div className="grid gap-y-4 sm:gap-y-0">  
//                         {note.location == "seller" ? (
//                             <p>{new Date(note.note.createdAt).toLocaleString()}</p>
//                         ) : 
//                         (

//                             <></>
//                         )} 

//                         <p className="text-muted-foreground">{note.note.note.module}</p>

//                         {
//                             note.location == "seller" ? (
//                                 <p>{note.note.userFullName}</p>
//                             ):(
//                                 <p className="text-muted-foreground">{note.note.note.userFullName}</p>
//                             )}

//                     </div>
//                     {/* Deafult is flex row. Once more than small, do the item center all. */}
//                     <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
//                         <span className=" text-[#0e172b] md:mt-[-1em]">{formatCurrency(note['note']['note']['price'])} </span>

//                         <div className="flex flex-row items-center gap-2">
//                             <span className="text-sm text-muted-foreground">
//                                 Download here
//                             </span>
//                             <Download className="w-4 h-4 cursor-pointer hover:shadow-lg" />
//                         </div>
//                     </div>
//                 </CardDescription>

//             </CardHeader>

//         </Card>
//     )

// }

export default UserActivityListing;