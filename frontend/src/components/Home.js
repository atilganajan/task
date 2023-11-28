import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Loader from './Loader';
import Pagination from './Pagination';
import checkRole from '../utils/CheckRole';
import EditModal from './EditModal';
import Swal from "sweetalert2";

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState(null);


    useEffect(() => {
        (async () => {
            const isAdminCheckResult = await checkRole("admin");
            setIsAdmin(isAdminCheckResult);
        })();
    }, []);

    useEffect(() => {

        fetchArticles();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageUpdated = (page) => {
        fetchArticles();
    };


    const fetchArticles = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/articles?page=${currentPage}`);
            setArticles(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = async (id, newTitle, newDescription) => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await axios.post('http://localhost:8000/api/admin/article/update',
                {
                    id: id,
                    title: newTitle,
                    description: newDescription
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            Swal.fire({
                position: "center",
                icon: 'success',
                title: 'Article Edit',
                text: response.data.message,
                showConfirmButton: false,
                timer: 2000
            });


            handlePageUpdated(currentPage);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Edit Error',
                html: getErrorMessages(error.response.data.errors ?? ""),
            });
        }
    };

    const getErrorMessages = (errors)=>{
        let messages ="";
        if(errors){
            for (var field in errors) {
                if (errors.hasOwnProperty(field)) {
                    var errorMessages = errors[field];
                    errorMessages.forEach(function (errorMessage) {
                        messages +=`<li>${errorMessage}</li>`;
                    });
                }
            }
        }else{
            messages ="Unexpected error"
        }
        return messages;
    }

    const handleEditButtonClick = (id) => {
        setSelectedArticleId(id);
        setEditModalOpen(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async(result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('jwtToken');
                try {
                    const response = await axios.post('http://localhost:8000/api/admin/article/delete',
                        {
                            id: id,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                    Swal.fire({
                        position: "center",
                        icon: 'success',
                        title: 'Article Delete',
                        text: response.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });


                    handlePageUpdated(currentPage);

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Error',
                        html: "Not Found",
                    });
                }
            }
        });
    }

    return (
        <div className="container mx-auto mt-10">
            {loading ? (
                <Loader/>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-white p-6 rounded-lg shadow-md h-[390px] relative">
                                {article.url_to_image && (
                                    <div className="relative">
                                        <img
                                            src={article.url_to_image}
                                            alt={article.title}
                                            className="mb-4 rounded-md w-full h-40 object-cover"
                                        />
                                        {isAdmin && (
                                            <div className="absolute top-0 right-0 p-2 space-x-2">
                                                <button
                                                    onClick={() => handleEditButtonClick(article.id)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded-md">
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded-md">
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold mb-2 overflow-hidden line-clamp-2">{article.title}</h2>
                                <p className="text-gray-600 overflow-hidden line-clamp-3">{article.description}</p>
                            </div>

                        ))}
                    </div>
                    <div className="mt-8">
                        <Pagination currentPage={currentPage} totalPages={totalPages} totalCount={articles.length}
                                    onPageChange={handlePageChange}/>
                    </div>
                </div>
            )}

            <EditModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                handleEdit={handleEdit}
                articleId={selectedArticleId}
            />

        </div>
    );
};

export default Home;
