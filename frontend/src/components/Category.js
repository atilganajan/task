import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Loader from './Loader';
import Pagination from './Pagination';
import checkRole from '../utils/CheckRole';
import EditModal from './EditModal';
import Swal from "sweetalert2";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [articles, setArticles] = useState([]);
    const [totalPagesArticle, setTotalPagesArticle] = useState(1);
    const [currentPageArticle, setCurrentPageArticle] = useState(1);
    const [articelIds, setArticelIds] = useState([]);


    useEffect(() => {
        (async () => {
            const isAdminCheckResult = await checkRole("admin");
            setIsAdmin(isAdminCheckResult);
        })();
    }, []);

    useEffect(() => {

        fetchCategories();
    }, [currentPage]);

    const addArticalId = (id, type) => {
        if (type === 1) {
            setArticelIds((prevIds) => [...prevIds, id]);
        } else {
            setArticelIds((prevIds) => prevIds.filter((artId) => artId !== id));

        }

    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageChangeArticle = (page) => {

        setCurrentPageArticle(page);
        fetchArticleDatas(page)
    };

    const handlePageUpdated = (page) => {
        fetchCategories();
    };


    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/categories?page=${currentPage}`);
            setCategories(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = async (id, newName, article_ids) => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await axios.post('http://localhost:8000/api/admin/category/update',
                {
                    id: id,
                    name: newName,
                    article_ids: article_ids
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            Swal.fire({
                position: "center",
                icon: 'success',
                title: 'Category Edit',
                text: response.data.message,
                showConfirmButton: false,
                timer: 2000
            });


            handlePageUpdated(currentPage);
            return 1;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Edit Error',
                html: getErrorMessages(error.response.data.errors ?? ""),
            });
            return 0;
        }
    };

    const handleCreateCategory = async (newName, articleIds) => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await axios.post('http://localhost:8000/api/admin/category/create',
                {
                    name: newName,
                    article_ids: articleIds
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            Swal.fire({
                position: "center",
                icon: 'success',
                title: 'Category Create',
                text: response.data.message,
                showConfirmButton: false,
                timer: 2000
            });
            fetchCategories();
            return 1;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Edit Error',
                html: getErrorMessages(error.response.data.errors ?? ""),
            });
            return 0;
        }
    }

    const getErrorMessages = (errors) => {
        let messages = "";
        if (errors) {
            for (var field in errors) {
                if (errors.hasOwnProperty(field)) {
                    var errorMessages = errors[field];
                    errorMessages.forEach(function (errorMessage) {
                        messages += `<li>${errorMessage}</li>`;
                    });
                }
            }
        } else {
            messages = "Unexpected error"
        }
        return messages;
    }

    const handleCreateButtonClick = () => {
        setArticelIds([])
        fetchArticleDatas(1)
        setCreateModalOpen(true);
    }

    const fetchArticleDatas = async (page) => {

        const response = await axios.get(`http://localhost:8000/api/articles?page=${page}`);
        setArticles(response.data.data);
        setTotalPagesArticle(response.data.last_page);
    }

    const handleEditButtonClick = (id) => {
        fetchArticleDatas(currentPage)
        setSelectedCategoryId(id);
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('jwtToken');
                try {
                    const response = await axios.post('http://localhost:8000/api/admin/category/delete',
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
                        title: 'Category Delete',
                        text: response.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });


                    handlePageUpdated(currentPage);

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Error',
                        html: "Unexpected error",
                    });
                }
            }
        });
    }

    return (
        <div className="container mx-auto mt-10">
            {isAdmin && (
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => handleCreateButtonClick()}
                        className="bg-green-700 text-white px-4 py-2 mb-10 rounded-md w-1/4">
                        Create Category
                    </button>
                </div>
            )}

            {loading ? (
                <Loader/>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-screen-lg">
                        {categories.map((category) => (
                            <div key={category.id}
                                 className="bg-blue-100 p-6 rounded-lg shadow-md h-[210px] relative text-center">
                                {isAdmin && (
                                    <div className="absolute top-0 right-0 p-2 space-x-2">
                                        <button
                                            onClick={() => handleEditButtonClick(category.id)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded-md">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded-md">
                                            Delete
                                        </button>
                                    </div>
                                )}
                                <h2 className="text-2xl font-semibold mb-4 mt-7 overflow-hidden line-clamp-2">{category.name}</h2>
                                <p className="text-gray-600 mb-4">Article Count: {category.articelCount}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalCount={categories.length}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>

            )}

            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                handleEdit={handleEdit}
                categoryId={selectedCategoryId}
                currentPage={currentPageArticle}
                totalPages={totalPagesArticle}
                totalCount={articles.length}
                onPageChange={handlePageChangeArticle}
                articles={articles}
                addArticalId={addArticalId}
                articelIds={articelIds}
            />

            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                handleCreateCategory={handleCreateCategory}
                currentPage={currentPageArticle}
                totalPages={totalPagesArticle}
                totalCount={articles.length}
                onPageChange={handlePageChangeArticle}
                articles={articles}
                addArticalId={addArticalId}
                articelIds={articelIds}
            />

        </div>
    );
};

export default Category;
