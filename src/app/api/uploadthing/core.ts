import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "~/server/utils/auth";
import { api } from "~/trpc/server";
import { env } from "~/env";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    // Add HEIC support for iPhone photos
    "image/heic": {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    "image/heif": {
      maxFileSize: "4MB", 
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // Build a minimal, ASCII-safe Headers object to avoid ByteString errors
      const sanitized = new Headers();
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        sanitized.set("cookie", cookieHeader);
      }
      
      const user = await auth.api.getSession({
        headers: sanitized,
      });

      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      // Check if user is subscribed
      const isSubscribed = (await api.subscription.isSubscribed()).isSubscribed;

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!isSubscribed) {
        throw new UploadThingError("Not subscribed");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

  // Public image uploader for test pages (no auth required)
  publicImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // No authentication required for test uploads
      console.log("📤 Public image upload - no auth required");
      return { uploadedBy: "test-user" };
    })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("✅ Public image uploaded:", file.url);
      return { uploadedBy: "test-user" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
