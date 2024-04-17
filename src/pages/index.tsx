import { useAuth } from "@pangeacyber/react-auth";

export default function Home() {
  const { authenticated, login } = useAuth();

  return (
    <main>
      {!authenticated && (
        <div>
          <h2>
            Welcome to your brand new NextJS app integrated with{" "}
            <a href="https://pangea.cloud/">Pangea</a>
          </h2>
          <p>You are viewing unauthenticated public page content</p>
          <button onClick={login}>Login</button>
        </div>
      )}
      {authenticated && (
        <div>
          <h2>
            You have been successfully authenticated by{" "}
            <a href="https://pangea.cloud/">Pangea AuthN Service</a>
          </h2>
          <p>Now You are viewing authenticated page content</p>
        </div>
      )}
    </main>
  );
}
