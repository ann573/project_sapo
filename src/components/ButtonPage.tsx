interface ButtonProps {
  setPage: (value: number | ((prevPage: number) => number)) => void;
  page: number
}

const ButtonPage: React.FC<ButtonProps> = ({ setPage, page }) => {
  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));
  return (
    <>
      <div className="flex justify-between mt-5">
        <button
          onClick={handlePrevPage}
          className="bg-gray-300 p-2 rounded-md"
          disabled={page === 1}
        >
          Trang trước
        </button>
        <button onClick={handleNextPage} className="bg-gray-300 p-2 rounded-md">
          Trang sau
        </button>
      </div>
    </>
  );
};

export default ButtonPage;
