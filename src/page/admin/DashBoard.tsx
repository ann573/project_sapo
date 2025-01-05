const DashBoard = () => {
  return (
      <section className="bg-white grid grid-cols-3">
        <div className="flex items-center justify-center gap-5 py-3">
          <i className="ri-money-dollar-circle-fill text-3xl bg-green-500 text-white py-1 px-2 rounded-full"></i>
          <div>
            <h2 className="font-semibold">Doanh thu</h2>
            <p>1.000.000đ</p>
          </div>
        </div>
        <div className="h-full w-px bg-gray-300 mx-auto"></div>
        <div className="flex items-center justify-right gap-5">
          <i className="ri-list-ordered text-3xl bg-yellow-500 text-white py-1 px-2 rounded-full"></i>
          <div>
            <h2 className="font-semibold">Đơn hàng</h2>
            <p>18</p>
          </div>
        </div>
      </section>
  );
};

export default DashBoard;
