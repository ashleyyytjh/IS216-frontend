import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface Props{
    handleDialogConfirm: () => void;
    confirmOpen: boolean;
    setConfirmOpen: (open: boolean) => void;}

export function AlertForum({ handleDialogConfirm, confirmOpen, setConfirmOpen }: Props) {
  return (
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>
                Delete Comment?
            </AlertDialogTitle>
            <AlertDialogDescription>
                Are you sure you want to delete this comment? This will also delete all its replies.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
                <Button variant="destructive" onClick={handleDialogConfirm}>Delete</Button>
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}