import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>SciBind</h1>
      <Image
        src="/scibind.png"
        alt="SciBind Logo"
        width={200}
        height={200}
      />
    </div>
  );
}
