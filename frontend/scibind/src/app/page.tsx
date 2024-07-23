import Image from "next/image";

export default function Home() {
  return ( 
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-8">SciBind</h1>
          <Image
            src="/scibind.png"
            alt="SciBind Logo"
            width={200}
            height={200}
            className="mx-auto" />
        </div>
      </div>
    </div>
  );
}