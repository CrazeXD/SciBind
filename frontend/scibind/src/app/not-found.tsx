import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h2 className="text-5xl font-bold mb-4">404 - Not Found</h2>
          <p className="text-xl mb-8">Could not find requested resource</p>
          <Link href="/" className="btn btn-primary">Return Home</Link>
        </div>
      </div>
    </div>
  )
}