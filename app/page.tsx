import { getCurrentUserFromCookieAction } from "@/util/actions/CurrentUserAction";

export default async function Home() {
  const user = await getCurrentUserFromCookieAction();

  // display another ui if user is not logged in
  if (!user) {
    return <h2>Login to Proceed</h2>;
  }

  return (
    <div>
      <h2>
        Welcome{" "}
        <span className="font-bold underline underline-offset-2">
          {user.first_name}
        </span>
      </h2>
    </div>
  );
}
