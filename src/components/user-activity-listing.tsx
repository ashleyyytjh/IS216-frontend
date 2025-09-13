import { Button } from "./ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Download } from 'lucide-react';


const UserActivityListing = (note) => {
    const isoString = note['note']['createdAt']
    let dateObject = new Date(isoString);
    let currentDay = new Date();
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
    const utc2 = Date.UTC(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
    const differenceInDays = Math.floor(Math.abs(utc2 - utc1) / millisecondsInDay);

    return (
        <Card className="pl-2 pr-2 pt-4 pb-4 border rounded-lg transition-all duration-300 hover:bg-muted/50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group">

            <CardHeader>
                <CardTitle className="flex-1">
                    {note['note']['tags'][0]}
                </CardTitle>

                <CardDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <p className="text-muted-foreground">{note['note']['module']}</p>
                        <p className="text-muted-foreground">Nicholas Soh</p>
                    </div>
                    {/* Deafult is flex row. Once more than small, do the item center all. */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                        <span className=" text-[#0e172b] md:mt-[-1em]">${note['note']['price']}</span>

                        <div className="flex flex-row items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {differenceInDays} days ago
                            </span>
                            <Download className="w-4 h-4 cursor-pointer hover:shadow-lg" />
                        </div>
                    </div>
                </CardDescription>

            </CardHeader>

        </Card>
    )

}

export default UserActivityListing