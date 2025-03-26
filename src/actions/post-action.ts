"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user-action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Failed to create post", error);
    return { success: false, error: "Failed to create a post" };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        savedBy: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            savedBy: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.log("Error getting posts", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;
    if (!content) throw new Error("Content is requred");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });

      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post?.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }
      return [newComment];
    });

    revalidatePath("/");
    return { success: true, comment };
  } catch (error) {
    console.log("Error creatingComment", error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        post: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!comment) return;

    if (comment.post.authorId !== userId) {
      throw new Error("Unathorized");
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error deleting this comment", error);
    return { success: false, error: "Failed to delete comment" };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Unauthorized");
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error deleting this post", error);
    return { success: false, error: "Failed to delete post" };
  }
}

export async function likePost(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    //Check if the like exist
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    //Checking if there is existing like and if there is we unlike it
    // if we didn't like it in the past we like and create a notification

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error liking post", error);
    return { success: false, error: "Failed to like a post" };
  }
}

export async function SavePost(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    //finding the bookmarked post that is bookmarked by the user
    const bookmark = await prisma.savedPost.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    //delete the bookmark if the psot is already bookmarked

    if (bookmark) {
      await prisma.savedPost.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    } else {
      await prisma.savedPost.create({
        data: {
          postId,
          userId,
        },
      });
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error bookmarking this post", error);
    return { success: false, error: "Failed to bookmark this post" };
  }
}
