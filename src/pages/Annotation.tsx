import * as pdfjsLib from 'pdfjs-dist';




import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, MessageSquare, MapPin, Loader, Reply, Trash2, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '@/types/types';
import { toast } from 'sonner';
import { getUser } from '@/services/UserService';
import { downloadNotes, getNotesById } from '@/services/NotesService';
import { GetNotesRes } from '@/types/requests/notes';
import { courseGradient } from '@/utils/colors';
import { Badge } from '@/components/ui/badge';
import { createAnnotation, deleteAnnotation, getAnnotationsByNoteId } from '@/services/AnnotationService';
import { AlertForum } from "@/components/forum/AlertForum";
import SpinItem from "@/components/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils_stepper";
import samplePdf from '@/assets/LP-Model-Documentation.pdf';


// --- Types ---
interface Annotation {
    id: string;
    note_id:string;
    selected_text: string;
    comment: string;
    start_offset: number ;
    end_offset: number ;
    author_name: string;
    author_id: string;
    created_at: string;
    thread_id?: string; 
    parent_id: string | null; 
    replies: Annotation[]; 
    depth: number;
    imageUrl?: string;
    page:number
}

import { Document, Page } from 'react-pdf';
import PDFViewer from '@/components/listing/PDFViewer';
import ForumPdfViewer from '@/components/forum/ForumPdfViewer';
import { ForumFilterButton } from '@/components/forum/ForumFIlterButton';

let NOTE_CONTENT = "The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter. The four inner terrestrial planets—Mercury, Venus, Earth and Mars—are composed primarily of rock and metal.";

export default function AnnotationComponent() {
    const contentRef = useRef<HTMLDivElement>(null);
    const { noteId } = useParams<{ noteId: string }>();
    const [user, setUser] = useState<User>();
    const [note, setNote] = useState<GetNotesRes>();
    const [selectedText, setSelectedText] = useState<string>("");
    const [selectionRange, setSelectionRange] = useState<{start: number, end: number} | null>(null);
    const [commentInput, setCommentInput] = useState<string>("");
    const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
    const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null);
    const [nestedAnnotations, setNestedAnnotations] = useState<Annotation[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<Annotation | null>(null);
    const [fileData, setFileData] = useState<Uint8Array | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyInputs, setReplyInputs] = useState<{[key: string]: string}>({});
    const [filter, setFilter] = useState<"all" | "page">("all");
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [originalAnnotations, setOriginalAnnotations] = useState<Annotation[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const userFetch = await getUser();
            setUser(userFetch);
            if (!noteId) {
                // console.log('no id');
                navigate('/home');
                toast.error('Error loading page, please try again')
                return;
            };
            const data = await getNotesById(noteId); //68b98faba389fd1819c78c17
            console.log('note data', data)
            if (!data) {
                navigate('/forum');
                toast.error('No such note exists, please try again')
                return;
            }

            //check if user has purchased, if not check if user is the owner of the notes
            if (data.purchased === false && data.userId !== userFetch.sub) {
                navigate('/home');
                toast.error('Please purchase notes to view this content')
                return;
            }

            setNote(data);
            setCurrentPage(1);
            await fetchAnnotations()
            setLoading(false);  
        }
  
        fetchData();
    },[noteId]);

    useEffect(() => {
        fetchAnnotations();
    },[currentPage, filter]);

    const fetchAnnotations = async () => {
        if (!noteId) return;
        let d = await getAnnotationsByNoteId(noteId);
      
        let commentTree = buildCommentTree(d);
        if (filter !== "all") {
            commentTree = commentTree.filter((ann: Annotation) => ann.page === currentPage);
        }
        setOriginalAnnotations(commentTree);
        setNestedAnnotations(commentTree);
    };

    const handlePageChange = (pageNumber: number) => {
        console.log('page changed to', pageNumber);
        setCurrentPage(pageNumber);
    }




    const fetchPdf = async (noteId: string) => {
    // const notepdf = await downloadNotes(noteId);
        const res = await fetch(samplePdf);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let allText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
            .map(item => ('str' in item ? item.str : ''))
            .join(' ');
            allText += pageText + '\n\n';
        }
    };

    const buildCommentTree = (comments: Annotation[]): Annotation[] => {
        const commentMap: { [key: string]: Annotation & { replies: Annotation[] } } = {};
        const rootComments: Annotation[] = [];

        //  map of all comments and initialize replies array
        comments.forEach(comment => {
            commentMap[comment.id] = { ...comment, replies: [] };
        });
        // link replies to their parents
        comments.forEach(comment => {
            if (comment.parent_id !== null) {
                // add reply to parent
                // console.log('found parent', comment.parent_id, 'for reply', comment.id)
                commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
            } else {
                // root comment
                rootComments.push(commentMap[comment.id]);
            }
        });
            return rootComments;
    };

    // Handle text selection
    const handleTextSelection = () => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const selectedText = selection.toString().trim();
            if (selectedText.length < 3) {
                setShowCommentForm(false);
                return;
            }

            const range = selection.getRangeAt(0);
            const contentElement = contentRef.current;
            
            if (contentElement && contentElement.contains(range.commonAncestorContainer)) {

            // Get plain text and calculate position
            const fullText = contentElement.textContent || '';
            const beforeText = fullText.substring(0, fullText.indexOf(selectedText));
            const startOffset = beforeText.length;
            const endOffset = startOffset + selectedText.length;

            setSelectedText(selectedText);
            setSelectionRange({ start: startOffset, end: endOffset });
            setShowCommentForm(true);
            setCommentInput("");
        }
    };

    const handleCommentSubmitNoQuote = async () => {
        if (!commentInput.trim() ) return;
        const newAnnotation = {
            id: `annotation-${Date.now()}`,
            note_id: note!.id,
            selected_text: "",
            comment: commentInput.trim(),
            start_offset: null ,
            end_offset: null,
            author_name: user!.username,
            author_id: user!.sub!,
            created_at: new Date().toISOString(),
            imageUrl: user?.imageUrl,
            parent_id: null,
            replies: [], // Initialize empty replies array
            depth: 0,
            page: currentPage
        };
        try {
            const data  = await createAnnotation(newAnnotation);
            if (data) {
                toast.success('Comment added successfully');
                // console.log('data is', data)
                setNestedAnnotations(prev => [
                { ...data, replies: [], thread_id: data.id},
                    ...prev,
                ]);
                // Reset form
                setShowCommentForm(false);
                setSelectedText("");
                setSelectionRange(null);
                setCommentInput("");
                window.getSelection()?.removeAllRanges();
            } 
        } catch (error) {
            toast.error('Failed to add comment. Please try again.');
        }
    };

    // Handle comment submission
    const handleCommentSubmit = async () => {
        if (!selectedText || !commentInput.trim() || !selectionRange) return;
        const newAnnotation: Annotation = {
            id: `annotation-${Date.now()}`,
            note_id: note!.id,
            selected_text: selectedText,
            comment: commentInput.trim(),
            start_offset: selectionRange.start ,
            end_offset: selectionRange.end ,
            author_name: user!.username,
            author_id: user!.sub!,
            created_at: new Date().toISOString(),
            imageUrl: user?.imageUrl,
            parent_id: null,
            replies: [], // Initialize empty replies array
            depth: 0,
            page: currentPage
        };

        try {
            const data  = await createAnnotation(newAnnotation);
            if (data) {
                toast.success('Comment added successfully');
                // Reset form
                setShowCommentForm(false);
                setSelectedText("");
                setSelectionRange(null);
                setCommentInput("");
                window.getSelection()?.removeAllRanges();
            } 
        } catch (error) {
            toast.error('Failed to add comment. Please try again.');
        }
    };

    // Cancel comment form
    const handleCancel = () => {
        setShowCommentForm(false);
        setSelectedText("");
        setSelectionRange(null);
        setCommentInput("");
        window.getSelection()?.removeAllRanges();
    };

  // Replies
    const handleReplySubmit = async (parentId: string, depth:number) => {
        const replyText = replyInputs[parentId];
        if (!replyText || !replyText.trim()) return;

        const newReply: Annotation = {
            id: `reply-${Date.now()}`,
            selected_text: "", // Replies don't have selected text
            note_id: note!.id,
            comment: replyText.trim(),
            start_offset: 0,
            end_offset: 0,
            author_name: user!.username,
            author_id: user!.sub!,
            thread_id: parentId,
            created_at: new Date().toISOString(),
            parent_id: parentId,
            imageUrl: user!.imageUrl,
            replies: [],
            depth: depth+1 || 0,
            page: currentPage
        };  
        try {       
            const data  = await createAnnotation(newReply);
            if (data) {
                data.replies =[];
                toast.success('Comment added successfully');

                setNestedAnnotations(prev => prev.map(annotation => {
                    if (annotation.id === parentId) {
                        return {
                            ...annotation,
                            replies: [data, ...annotation.replies]
                        };
                }
                return {
                    ...annotation,
                    replies: addReplyToNested(annotation.replies, parentId, data)
                };
                }));
            }
    } catch (error) {
            toast.error(`${error}`);
        }
        // Reset reply state
        setReplyInputs(prev => ({ ...prev, [parentId]: "" }));
        setReplyingTo(null);
    };

    const addReplyToNested = (replies: Annotation[], parentId: string, newReply: Annotation): Annotation[] => {
        return replies.map(reply => {
        if (reply.id === parentId) {
            return {
            ...reply,
            replies: [newReply, ...reply.replies]
            };
        }
        return {
            ...reply,
            replies: addReplyToNested(reply.replies, parentId, newReply)
        };
        });
    };

    // Scroll to annotation position when hovering
    const scrollToAnnotation = (annotation: Annotation) => {
            const contentElement = contentRef.current;
            if (!contentElement) return;

            // Create a temporary range to get the position
            const range = document.createRange();
            const textNode = contentElement.firstChild;
            
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            try {
                range.setStart(textNode, annotation.start_offset);
                range.setEnd(textNode, annotation.end_offset);

                // Get the position and scroll to it
                const rect = range.getBoundingClientRect();
                const elementRect = contentElement.getBoundingClientRect();
                
                // Scroll to center the highlighted text
                contentElement.scrollTop += rect.top - elementRect.top - elementRect.height / 2;
            } catch (e) {
                console.log('Could not scroll to annotation position');
            }
            }
    };

    // Render content with conditional highlighting
    const renderContent = () => {
            if (!hoveredAnnotation) {
                return NOTE_CONTENT;
            }

            // Find the hovered annotation
            const annotation = nestedAnnotations.find(ann => ann.id === hoveredAnnotation);
            if (!annotation) return NOTE_CONTENT;

            // Split text and highlight the relevant part
            const beforeText = NOTE_CONTENT.substring(0, annotation.start_offset);
            const highlightedText = NOTE_CONTENT.substring(annotation.start_offset, annotation.end_offset);
            const afterText = NOTE_CONTENT.substring(annotation.end_offset);

            return (
            <>
                {beforeText}
                    <mark className="bg-yellow-300 px-0.5 py-0.5 rounded animate-pulse">
                        {highlightedText}
                    </mark>
                {afterText}
            </>
            );
    };

    // Deletion of comments and their replies
    const removeCommentFromTree = (comments: Annotation[], idToDelete: string): Annotation[] => {
        return comments.reduce((accumulator, comment) => {
            if (comment.id === idToDelete) {
                return accumulator; //if comment matches id to delete, we don't add it to accumulator 
            }
            
            // If the comment has replies, we need to check them for the ID to delete.
            if (comment.replies && comment.replies.length > 0) {
                comment.replies = removeCommentFromTree(comment.replies, idToDelete);
            }
            
            accumulator.push(comment); //push comments that are !== id
            return accumulator;

        }, [] as Annotation[]); 
    };


    // This is the main handler function you will call from your component's onClick.
    const handleDeleteFunction = async (annotationToDelete: Annotation) => {
        try {
            await deleteAnnotation(annotationToDelete.id);
            setNestedAnnotations(prevTree => removeCommentFromTree(prevTree, annotationToDelete.id));
            toast.success('Comment and its replies deleted successfully');

        } catch (error) {        
            toast.error('Failed to delete comment. Please try again.');
        }
    };

    const handleDialogConfirm = async () => {
        setDeleteTarget(null);                        
        if (!deleteTarget) return;
        await handleDeleteFunction(deleteTarget);   
    };

    const CommentItem =  ({ annotation, depth, handleDelete, note }) => (
    

        <div className={`${depth > 0 ? 'ml-6 border-l border-gray-200 pl-3' : ''}`}>
        <div 
            className={cn(
                "mb-3 p-3 border rounded-lg transition-all duration-200 relative",
                {
                "border-2 ring-yellow-400 bg-yellow-50": hoveredAnnotation === annotation.id, 
                "border-2 border-blue-400 bg-blue-50 shadow-sm": annotation.author_id === note.userId, 
                "bg-white border-gray-200":annotation.author_id !== note.userId && hoveredAnnotation !== annotation.id 
                }
            )}
            >
            {annotation.author_id === note.userId && (
                <div className="absolute top-0 right-0 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 bg-blue-200 rounded-bl-md rounded-tr-md">
                    AUTHOR
                </div>
            )}
            <div className="flex items-start space-x-2">
                <Avatar className="h-6 w-6 mt-0.5">
                <AvatarImage src={annotation?.imageUrl} />
                <AvatarFallback className="text-xs">X</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">

                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-xs">{annotation.author_name}</p>
                    <p className="text-xs text-muted-foreground">
                   
                    {new Date(annotation.created_at.replace(' ', 'T')).toLocaleString([], { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit', 
                        minute: '2-digit'
                        })}
                    </p>
                </div>
                
                {/* Comment text */}
                <p className="text-sm text-foreground mb-2 leading-relaxed">{annotation.comment}</p>
                
                {/* Quoted text */}
                {annotation.selected_text && (
                    <div 
                    className="text-xs text-muted-foreground bg-gray-50 p-2 rounded cursor-pointer hover:bg-yellow-50 transition-colors group mb-2 border-l-2 border-gray-300"
                    onMouseEnter={() => { setHoveredAnnotation(annotation.id); scrollToAnnotation(annotation); }}
                    onMouseLeave={() => setHoveredAnnotation(null)}
                    >
                    <span className="italic group-hover:text-gray-700 line-clamp-2">
                        "{annotation.selected_text}"
                    </span>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-4 text-xs">
                    <button
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => {
                        if (replyingTo === annotation.id) {
                        setReplyingTo(null);
                        } else {
                        setReplyingTo(annotation.id);
                        }
                    }}
                    >
                    <Reply className="h-3 w-3" />
                        Reply
                    </button>

                    {annotation.author_id === user?.sub && (
                        <div>
                            <AlertForum
                                confirmOpen={!!deleteTarget}
                                setConfirmOpen={open => { if (!open) setDeleteTarget(null); }}
                                handleDialogConfirm={handleDialogConfirm}
                        />
                            <button
                                className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                                onClick={() => setDeleteTarget(annotation)}
                            >
                                <Trash2 className="h-3 w-3" />
                                Delete
                            </button>   
                        </div>
               
                    )}
                    {annotation.replies.length > 0 && (
                    <span className="text-muted-foreground ml-auto">
                        {annotation.replies.length} {annotation.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                    )}
                </div>

                {/* Reply form */}
                {replyingTo === annotation.id && (
                    <div className="mt-2 space-y-2">
                    <Input
                        className="text-sm"
                        placeholder="Write a reply..."
                        value={replyInputs[annotation.id] || ""}
                        onChange={(e) => 
                        setReplyInputs(prev => ({ ...prev, [annotation.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) { 
                                e.preventDefault(); 
                                handleReplySubmit(annotation.id, annotation.depth);
                            }
                            else if (e.key === 'Escape') {
                                 setReplyingTo(null);
                        }
                        }}
                        autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                        <Button 
                            size="sm" 
                            className="h-7 px-2 text-xs" 
                            onClick={() => handleReplySubmit(annotation.id, annotation.depth)}
                            disabled={!replyInputs[annotation.id]?.trim()}
                        >
                        Reply
                        </Button>

                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs" 
                            onClick={() => setReplyingTo(null)}
                        >
                        Cancel
                        </Button>
                    </div>
                    </div>
                )}
                </div>
            </div>
            </div>

            {/* Render replies recursively */}
            {annotation.replies.map(reply => (
                <CommentItem key={reply.id} annotation={reply} depth={depth + 1} note={note} handleDelete={handleDelete} />
            ))}
        </div>
        // </motion.div>

    );

    const viewPdf=() => {
        return (
            <ForumPdfViewer id={noteId!} pageHandler={handlePageChange}  />
        )
    }


  return (
    (note && !loading) ? ( 
    <div className="bg-background w-full text-foreground min-h-screen h-full p-4 sm:p-8">
        <header className="mb-6 space-y-2 flex justify-center items-center flex-col">
                <span className='flex flex-row space-x-4'>
                    <h1 className="text-3xl font-bold tracking-tight">{note.title}</h1>
                    <Badge
                        className="text-md font-normal  rounded-full border-none bg-linear-to-r text-white uppercase"
                        style={{ background: note.module ? courseGradient(note.module): "black" }}
                        >
                    {note.module ?? "General"} 
                    </Badge>
                </span>
              
                <p className="text-md text-muted-foreground">
                {note.description}
                </p>
        </header>

      <div className="w-full flex flex-col justify-center items-center space-x-3">
        <section className=" space-y-2  w-5/6  pb-8 ">
                    <div 
                        ref={contentRef}
                        className="text-md leading-relaxed select-text cursor-text  w-full"
                        onMouseUp={handleTextSelection}
                    >
                    { 
                    viewPdf()
                        // renderContent()
                    }
                    </div>
                {/* <p className="text-sm text-muted-foreground mb-8 italic">
                    Select text to add comments • Hover over quotes to highlight referenced text
                </p> */}

                {/* Comment Form Just for Notes type, we allow highlighting */}
                {showCommentForm && note.type === "notes" && (
                    <Card className="bg-primary-foreground">
                        <CardHeader>
                            <p className="text-sm text-muted-foreground">Add a comment for:</p>
                            <blockquote className="border-l-4 border-blue-500 pl-4 italic mt-1 text-gray-700">
                                "{selectedText}"
                            </blockquote>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Input
                                type="text"
                                placeholder="Type your comment or suggestion..."
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCommentSubmit();
                                    } else if (e.key === 'Escape') {
                                    handleCancel();
                                    }
                                }}
                                autoFocus
                                />
                                <div className="flex gap-2">
                                <Button onClick={handleCommentSubmit} disabled={!commentInput.trim()} className="!text-sm">
                                    Submit
                                </Button>
                                <Button variant="outline" onClick={handleCancel} className="!text-sm">
                                    Cancel
                                </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            
        </section>
        {/* Discussion Section with Nested Comments */}
        <section className="w-5/6 overflow-y-auto">
            <section className='flex flex-row  justify-between'>
            <h2 className="text-xl font-semibold tracking-tight mb-4 flex items-center">
                <MessageSquare className="mr-3 h-6 w-6 text-muted-foreground" />
                Discussion ({nestedAnnotations.length})
            </h2>
            <ForumFilterButton onFilterChange={async (value) => 
                setFilter(value)
            } />
            </section>
       
       {/* comments for types that are not notes! */}
            {note.type !== "composeNotes" && (
                <Card className=" bg-primary-foreground mb-10">
                    {/* <CardHeader>
                    <p className="text-sm text-muted-foreground">Add a comment</p>
                    </CardHeader> */}
                    <CardContent>
                    <div className="space-y-3">
                        <Input
                        type="text"
                        placeholder="Type your comment or suggestion..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCommentSubmit();
                            } else if (e.key === 'Escape') {
                                handleCancel();
                            }
                        }}
                        autoFocus
                        />
                        <div className="flex gap-2">
                        <Button onClick={handleCommentSubmitNoQuote} disabled={!commentInput.trim()} className="!text-sm">
                            Submit
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="!text-sm">
                            Cancel
                        </Button>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            )}
            <ScrollArea className='h-78 scroll-hidden'>
                <div>
                    {nestedAnnotations.map((annotation) => (
                    <motion.div
                        key={annotation.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <CommentItem
                            key={annotation.id}
                            annotation={annotation}
                            depth={0}
                            handleDelete={handleDeleteFunction}
                            note={note}
                        />
                    </motion.div>
                    ))} 
                    {nestedAnnotations.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                        </div>
                    )}
                </div>
                {
                    (nestedAnnotations.reduce((count, annotation) => {
                        return count + 1 + (annotation.replies ? annotation.replies.length : 0);
                    }, 0)) > 2 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none animate-bounce">
                        <span className="text-xs text-muted-foreground">Scroll for more</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )
                }
            </ScrollArea>

     
            
        </section>

      </div>
    </div>
    ) : ( 
        <div className="flex justify-center items-center w-full h-screen"> <SpinItem/></div>
    )
  
  );
}
