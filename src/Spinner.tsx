const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-4" role="status">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-b-gray-600"></div>
    </div>
  );
};

export default Spinner;
