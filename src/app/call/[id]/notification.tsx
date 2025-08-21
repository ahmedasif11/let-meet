export default function Notification({
  socketId,
  onAccept,
  onReject,
}: {
  socketId: string;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/70 z-50 flex flex-col items-center justify-center h-full w-full">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          New User Wants to Join
        </h1>
        <p className="text-gray-600 mb-6">
          User{' '}
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {socketId.slice(0, 8)}...
          </span>{' '}
          wants to join your call
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
            onClick={onAccept}
          >
            Accept
          </button>
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
            onClick={onReject}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
