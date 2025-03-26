"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: `${
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
        }`,
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
    return dbUser;
  } catch (error) {
    console.log("Error", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
}

export async function getUsersYouMightLike() {
  try {
    const userId = await getDbUserId();

    if (!userId) return [];

    const usersYouMightLike = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });

    return usersYouMightLike;
  } catch (error) {
    console.log("Eror fetching users", error);
    return [];
  }
}

export async function followUser(followedUser: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    if (userId === followedUser) {
      throw new Error("You cannot follow yourself");
    }

    //Checking if we already follow the user and if do we unfollow them

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followedUser,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: followedUser,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: followedUser,
          },
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: followedUser,
            creatorId: userId,
          },
        }),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to follow user" };
  }
}

export async function getProfilebyUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            saved: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching profle", error);
    throw new Error("Failed to fetch profile");
  }
}

export async function getUsersSavedPost(username: string) {
  try {
    const data = await prisma.savedPost.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        post: {
          include: {
            comments: {
              include: {
                author: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            likes: {
              include: {
                user: true,
              },
            },
            savedBy: true,
            author: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return data;
  } catch (error) {
    console.error("Database error", error);
    throw new Error("Failed to fetch saved posts");
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;

    const user = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        name,
        bio,
        location,
        website,
      },
    });
    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating profile", error);
    return { success: false, error: "Failed to update profile" };
  }
}
