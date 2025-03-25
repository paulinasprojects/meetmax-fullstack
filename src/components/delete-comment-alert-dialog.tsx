"use client";

import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteCommentAlertDialogProps {
  isDeletingComment: boolean;
  onDelete: (commentId: string) => void;
  commentId: string;
  title?: string;
  description?: string;
}

export const DeleteCommentAlertDialog = ({ isDeletingComment, onDelete,  title = "Delete Comment?", 
  description = "Are you sure you want to delete this comment? This action cannot be undone." , commentId }: DeleteCommentAlertDialogProps) => {
  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-red-500 -mr-2"
      >
        { isDeletingComment ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <Trash2Icon className="size-4" />
        )}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onDelete(commentId)}
          className="bg-red-500 hover:bg-red-600"
          disabled={isDeletingComment}
        >
          {isDeletingComment ? "Deleting..." : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}
