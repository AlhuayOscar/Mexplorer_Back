import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex gap-1">
      <img
        src="/mex_original.png"
        alt="Logo de México"
        className="mt-2 max-w-10px max-h-12"
      />
    </Link>
  );
}