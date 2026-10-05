import Link from "next/link";

export default function NotFound() {
  return (
    <main className="status-page">
      <span className="eyebrow">ERROR / 404</span>
      <h1>
        SIGNAL
        <br />
        <span>LOST.</span>
      </h1>
      <p>The page you requested is not part of this build.</p>
      <Link className="button button-blue" href="/">
        [ RETURN HOME → ]
      </Link>
    </main>
  );
}
