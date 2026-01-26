import LocalVideo from './local-video';
import CallControllers from './call-controllers';
import Link from 'next/link';

export default function JoiningCall({
  isRejected,
  id,
}: {
  isRejected: boolean;
  id: string;
}) {
  return isRejected ? (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50">
      <div className="text-center max-w-md mx-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Join Request Rejected
        </h1>
        <p className="text-gray-600 mb-6">
          Your request to join the call was not accepted. Please try again later
          or contact the call host.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href={`/call/${id}`}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="relative h-full w-full bg-gray-50">
      <div className="flex flex-col items-center justify-center h-1/2 w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Joining Call...
          </h2>
          <p className="text-gray-600">
            Please wait while we connect you to the call
          </p>
        </div>
        <LocalVideo className="w-full h-full max-w-md" />
        <CallControllers className="absolute bottom-0 left-0 right-0" />
      </div>
    </div>
  );
}
