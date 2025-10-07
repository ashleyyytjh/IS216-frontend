"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, MessageSquare, MapPin, Loader, Reply } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '@/types/types';
import { toast } from 'sonner';
import { getUser } from '@/services/UserService';
import { getNotesById } from '@/services/NotesService';
import { GetNotesRes } from '@/types/requests/notes';
import { courseGradient } from '@/utils/colors';
import { Badge } from '@/components/ui/badge';
import { getAnnotationsByNoteId } from '@/services/AnnotationService';
import { se } from 'date-fns/locale';

// --- Types ---
interface Annotation {
    id: string;
    note_id:string;
    selected_text: string;
    comment: string;
    start_offset: number;
    end_offset: number;
    author_name: string;
    author_id: string;
    created_at: string;
    parent_id: string | null; // NEW: For nested replies
    replies: Annotation[]; // NEW: Array of replies
}

// author :"You"
// comment
// : 
// "test"
// endOffset
// : 
// 54
// id
// : 
// "annotation-1759817374799"
// selectedText
// : 
// "und system o"
// startOffset
// : 
// 42
// timestamp
// : 
// 1759817374799

// --- Sample Note Content ---
const NOTE_CONTENT = "The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter. The four inner terrestrial planets—Mercury, Venus, Earth and Mars—are composed primarily of rock and metal.";

export default function AnnotationComponent() {
    const contentRef = useRef<HTMLDivElement>(null);
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User>();
    const [note, setNote] = useState<GetNotesRes>();
    const [selectedText, setSelectedText] = useState<string>("");
    const [selectionRange, setSelectionRange] = useState<{start: number, end: number} | null>(null);
    const [commentInput, setCommentInput] = useState<string>("");
    const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
    const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null);

    // State for reply functionality
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyInputs, setReplyInputs] = useState<{[key: string]: string}>({});
    const navigate = useNavigate();

    useEffect(() => {
        //retrieve user
        const fetchData = async () => {
            //fetch user
            const userFetch = await getUser();
            setUser(userFetch);
            if (!id) {
                navigate('/home');
                toast.error('Error loading page, please try again')
                return;
            };
            console.log('user is' , userFetch);
            //fetch note?
            const data = await getNotesById(id); //68b98faba389fd1819c78c17
            
            if (!data || data.purchased == false) {
                navigate('/home');
                toast.error('Error loading page, please try again')
                return;
            }
            setNote(data);
        }
        fetchData();
    },[]);
    const [nestedAnnotations, setNestedAnnotations] = useState<Annotation[]>([]);

    // 2. Create a utility function to build the tree
    const buildCommentTree = (comments: Annotation[]): Annotation[] => {
        const commentMap: { [key: string]: Annotation & { replies: Annotation[] } } = {};
        const rootComments: Annotation[] = [];

        // First pass: create a map of all comments and initialize replies array
        comments.forEach(comment => {
            commentMap[comment.id] = { ...comment, replies: [] };
        });
        console.log('commentMap', commentMap);

        // Second pass: link replies to their parents
        comments.forEach(comment => {
            console.log('Processing comment:', comment);    
            console.log('Parent ID:', comment.parent_id);
            if (comment.parent_id !== null) {
                // It's a reply, add it to its parent's replies array
                console.log('true');
                console.log(comment.parent_id)
                // console.log('Parent exists:', commentMap[comment.parentId]);
                commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
        
            } else {
                // It's a root comment
                rootComments.push(commentMap[comment.id]);
            }
        });
            console.log('Built comment tree:', rootComments);
            return rootComments;
    };

    // 3. Use this function after fetching data
    useEffect(() => {
        const fetchAndProcessAnnotations = async () => {
            // Replace with your actual API call
            // const flatList: Annotation[] = await fetch(`/api/annotations?noteId=${noteId}`).then(res => res.json());
            const data = await getAnnotationsByNoteId(id!);
            // console.log('Fetched annotations:', data);
            const commentTree = buildCommentTree(data);
            setNestedAnnotations(commentTree);
        };
        fetchAndProcessAnnotations();
    }, [id]);

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

    // Handle comment submission
    const handleCommentSubmit = () => {
        if (!selectedText || !commentInput.trim() || !selectionRange) return;

        const newAnnotation: Annotation = {
            id: `annotation-${Date.now()}`,
            note_id: note!.id,
            selected_text: selectedText,
            comment: commentInput.trim(),
            start_offset: selectionRange.start,
            end_offset: selectionRange.end,
            author_name: user!.username,
            author_id: user!.sub!,
            created_at: new Date().toISOString(),
            parent_id: null,
            replies: [] // Initialize empty replies array
        };

        console.log('new', newAnnotation);
        // console.log('Annotation to save:', { noteId, ...newAnnotation });

        setNestedAnnotations(prev => [newAnnotation, ...prev]);
        
        // Reset form
        setShowCommentForm(false);
        setSelectedText("");
        setSelectionRange(null);
        setCommentInput("");
        window.getSelection()?.removeAllRanges();
    };

    // Cancel comment form
    const handleCancel = () => {
        setShowCommentForm(false);
        setSelectedText("");
        setSelectionRange(null);
        setCommentInput("");
        window.getSelection()?.removeAllRanges();
    };

  // NEW: Handle reply submission
    const handleReplySubmit = (parentId: string) => {
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
            created_at: new Date().toISOString(),
            parent_id: parentId,
            replies: []
        };


        console.log('parent id is', parentId);

        // Add reply to the parent comment
        setNestedAnnotations(prev => prev.map(annotation => {
        if (annotation.id === parentId) {
            console.log('true')
            return {
                ...annotation,
                replies: [newReply, ...annotation.replies]
            };
        }

        console.log(
            'Adding reply to nested comment:',
            nestedAnnotations
        )
        // Check nested replies
        return {
            ...annotation,
            replies: addReplyToNested(annotation.replies, parentId, newReply)
        };
        }));

        // Reset reply state
        setReplyInputs(prev => ({ ...prev, [parentId]: "" }));
        setReplyingTo(null);
    };

    // NEW: Recursively add reply to nested comments
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
                <mark className="bg-yellow-300 px-1 py-0.5 rounded animate-pulse">
                    {highlightedText}
                </mark>
            {afterText}
        </>
        );
  };
  
  // NEW: Recursive component for rendering nested comments
    const CommentItem = ({ annotation, depth }) => (
    <div className={`${depth > 0 ? 'ml-6 border-l border-gray-200 pl-3' : ''}`}>
        <div 
        className={`mb-3 p-3 bg-white border rounded-lg transition-all duration-200 ${
            hoveredAnnotation === annotation.id ? 'ring-1 ring-yellow-400 bg-yellow-50' : ''
        }`}
        >
        <div className="flex items-start space-x-2">
            <Avatar className="h-6 w-6 mt-0.5">
            <AvatarImage src={user?.imageUrl} />
            <   AvatarFallback className="text-xs">YU</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
            {/* Header with author and time */}
            <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-xs">{annotation.author}</p>
                <p className="text-xs text-muted-foreground">
                    {new Date(annotation.created_at.replace(' ', 'T')).toLocaleTimeString([], {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

                        {/* Quoted text (only for main annotations) - more compact */}
            {annotation.selected_text && (
                <div 
                className="text-sm text-muted-foreground bg-gray-50 p-2 rounded cursor-pointer hover:bg-yellow-50 transition-colors group mb-2 border-l-2 border-gray-300"
                onMouseEnter={() => {
                    setHoveredAnnotation(annotation.id);
                    scrollToAnnotation(annotation);
                }}
                onMouseLeave={() => setHoveredAnnotation(null)}
                >
                <span className="italic group-hover:text-gray-700 line-clamp-2">
                    "{annotation.selected_text}"
                </span>
                </div>
            )}
            
            {/* Comment text */}
            <p className="text-sm text-foreground mb-2 leading-relaxed">{annotation.comment}</p>
            


            {/* Action buttons - smaller and more compact */}
            <div className="flex items-center gap-3 text-xs">
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
                {annotation.replies.length > 0 && (
                <span className="text-muted-foreground">
                    {annotation.replies.length} {annotation.replies.length === 1 ? 'reply' : 'replies'}
                </span>
                )}
            </div>

            {/* Compact reply form */}
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
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleReplySubmit(annotation.id);
                    } else if (e.key === 'Escape') {
                        setReplyingTo(null);
                    }
                    }}
                    autoFocus
                />
                <div className="flex gap-2">
                    <Button 
                    size="sm" 
                    className=" text-xs" 
                    onClick={() => handleReplySubmit(annotation.id)}
                    disabled={!replyInputs[annotation.id]?.trim()}
                    >
                    Reply
                    </Button>
                    <Button 
                    variant="outline" 
                    size="sm" 
                    className=" text-xs" 
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
        <CommentItem key={reply.id} annotation={reply} depth={depth + 1} />
        ))}
    </div>
    );



  return (
    note ? (  <div className="bg-background text-foreground min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{note?.title}</h1>
                <Badge
                    className="text-md font-normal  rounded-full border-none bg-linear-to-r text-white uppercase"
                    style={{ background: note.module ? courseGradient(note.module): "black" }}
                    >
                {note.module ?? "General"} 
                </Badge>
            {/* <p className="text-muted-foreground mt-2">Note ID: {noteId}</p> */}
            <p className="text-md text-muted-foreground">
               {note.description}
            </p>
        </header>

        {/* Note Content */}
        <Card className="mb-2">
          <CardContent className="p-6">
            <div 
              ref={contentRef}
              className="text-md leading-relaxed select-text cursor-text"
              onMouseUp={handleTextSelection}
            >
              {renderContent()}
            </div>
          </CardContent>
          
        </Card>
        <p className="text-sm text-muted-foreground mb-8 italic">
                Select text to add comments • Hover over quotes to highlight referenced text
        </p>

        {/* Comment Form */}
        {showCommentForm && (
          <Card className="mb-8 bg-primary-foreground">
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
                  <Button onClick={handleCommentSubmit} disabled={!commentInput.trim()}>
                    Submit
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discussion Section with Nested Comments */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4 flex items-center">
            <MessageSquare className="mr-3 h-6 w-6 text-muted-foreground" />
            Discussion ({nestedAnnotations.length})
          </h2>
          
          <div>
            {nestedAnnotations.map(annotation => (
              <CommentItem key={annotation.id} annotation={annotation} depth={0} />
            ))}
            
            {nestedAnnotations.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">No comments yet</p>
                <p className="text-sm">Highlight some text above to start the discussion!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
    ) : ( <Loader></Loader> )
  
  );
}
