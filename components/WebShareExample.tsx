'use client'

const WebShareExample = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Web Share API Example',
          text: 'Check out this example of the Web Share API!',
          url: 'https://example.com',
        });
        console.log('Share was successful.');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.log('Web Share API is not supported in your browser.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Web Share API Example</h1>
      <button
        onClick={handleShare}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Share This
      </button>
    </div>
  );
};

export default WebShareExample;
