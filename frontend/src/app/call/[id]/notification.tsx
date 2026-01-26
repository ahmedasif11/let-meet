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
    <div className="bg-white rounded-lg shadow-2xl p-4 max-w-sm border-2 border-blue-300 animate-bounce">
      <div className="flex items-center mb-3">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
        <h3 className="text-lg font-bold text-gray-800">
          New User Wants to Join
        </h3>
      </div>
      <p className="text-gray-600 mb-4 text-sm">
        User{' '}
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded border">
          {socketId.slice(0, 8)}...
        </span>{' '}
        wants to join your call
      </p>
      <div className="flex gap-2 justify-center">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={onAccept}
        >
          ✓ Accept
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={onReject}
        >
          ✗ Reject
        </button>
      </div>
    </div>
  );
}
