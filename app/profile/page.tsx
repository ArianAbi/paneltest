import { getCurrentUserFromCookieAction } from "@/util/actions/CurrentUserAction";
import UserProfile from "../components/UserProfile";
import { Skeleton } from "../components/ui/skeleton";
import ProfileInputs from "../components/page/profile/ProfileInputs";

export default async function EditProfile() {
  const currentUser = await getCurrentUserFromCookieAction();

  return (
    <div className="container max-w-screen-sm mx-auto border border-edge2 rounded-xl p-6 flex flex-col justify-center items-center">
      {/* profile picture and its Loading fallback */}
      {currentUser && (
        <UserProfile user={currentUser} text={false} size="large" />
      )}
      {!currentUser && <Skeleton className="size-20 rounded-full" />}

      {/* Users name and its Loading fallback */}
      {currentUser && (
        <h2 className="mt-8 mb-2">
          {currentUser?.first_name + " " + currentUser?.last_name}
        </h2>
      )}
      {!currentUser && (
        <h2 className="mt-8 mb-2">
          <Skeleton className="w-40 h-10" />
        </h2>
      )}

      {/* Email and its Loading fallback */}
      {currentUser && <span className="italic">{currentUser.email}</span>}
      {!currentUser && <Skeleton className="w-32 h-6" />}

      <hr className="border-edge2 w-4/5 mt-4" />

      <ProfileInputs />
    </div>
  );
}
