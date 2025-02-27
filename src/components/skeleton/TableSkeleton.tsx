import { Skeleton } from "../ui/skeleton";

const TableSkeleton = () => {
  const columns = [1, 2, 3, 4, 5];
  return (
    <>
    <div>
    <Skeleton className="h-10 w-full my-5" />
    </div>
      <table className="space-y-2">
        <thead>
          <tr>
            {columns.map((_, index) => (
              <th key={index}>
                <Skeleton className="h-10 w-[200px]" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Hiển thị Skeleton khi đang tải dữ liệu */}
          {Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} >
              {columns.map((_, colIndex) => (
                <td key={colIndex}>
                  <Skeleton className="h-10 w-[200px] my-1" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableSkeleton;
