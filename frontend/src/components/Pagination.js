import React, {useState} from 'react';

const Pagination = ({currentPage, totalPages, onPageChange, totalCount}) => {
    const [visiblePages, setVisiblePages] = useState(5);
    const pages = Array.from({length: totalCount !== 0 ? totalPages : 0}, (_, i) => i + 1);
    const handleShowMore = () => {
        setVisiblePages((prevVisiblePages) => prevVisiblePages + 5);
    };

    return (
        <nav className="flex justify-center pb-6">
            <ul className="pagination">
                {pages.slice(0, visiblePages).map((page) => (
                    <li
                        key={page}
                        className={`inline-block mx-1 ${
                            page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        } px-3 py-1 rounded cursor-pointer`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </li>
                ))}
                {visiblePages < totalPages && (
                    <li
                        className="inline-block mx-1 bg-gray-200 px-3 py-1 rounded cursor-pointer"
                        onClick={handleShowMore}
                    >
                        ...
                    </li>
                )}
                {pages.length === 0 && (<h2 className="text-3xl font-bold text-center text-gray-800 mt-8">Article not found</h2>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
