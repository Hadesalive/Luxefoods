export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-xl">
        <img
          src="/images/logo.jpg"
          alt="Loading..."
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}

