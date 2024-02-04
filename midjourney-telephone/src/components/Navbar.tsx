import Link from "next/link";

export default function Navbar() {
  return (
    <div className="h-16 flex flex-row justify-left w-screen">
      <Link
        href="/"
        className="text-2xl text-white font-bold ml-4 mt-3 hidden md:flex"
      >
        Telephoto
      </Link>
    </div>
  );
}
