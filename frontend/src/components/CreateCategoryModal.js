import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './styles/EditModal.css';
import Loader from './Loader';
import Pagination from "./Pagination";


const CreateCategoryModal = ({ isOpen, onClose, handleCreateCategory, currentPage, totalPages, totalCount, onPageChange, articles, addArticalId, articelIds }) => {
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async () => {
        try {
            setIsLoading(true);

          const response =  await handleCreateCategory( newName,articelIds );
            if(response === 1){
                onClose();
            }

        } catch (error) {
            console.error('Error while editing article:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = (id) => {
        if (articelIds.includes(id)) {
            addArticalId(id,2);
        } else {
            addArticalId(id,1);
        }
    };

    return (
        <Modal
            appElement={document.getElementById('root')}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Modal"
            className="custom-modal"
        >
            <div className="bg-white rounded-md p-8">
                <h2 className="text-2xl font-bold mb-4">Create Category</h2>

                <div className="mb-4">
                    <label htmlFor="newTitle" className="block text-sm font-medium text-gray-700">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="newTitle"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-white p-4 rounded-md shadow-md h-[230px] relative mb-4">
                                {article.url_to_image && (
                                    <div className="relative">
                                        <img
                                            src={article.url_to_image}
                                            alt={article.title}
                                            className="mb-2 rounded-md w-full h-24 object-cover"
                                        />
                                    </div>
                                )}
                                <h2 className="text-lg font-semibold mb-1 overflow-hidden line-clamp-2">{article.title}</h2>
                                <div className="flex items-center justify-center mt-2">
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${article.id}`}
                                        className="mr-2 h-6 w-6"
                                        checked={articelIds.includes(article.id)}
                                        onChange={() => handleCheckboxChange(article.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalCount={totalCount}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>


                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader /> : 'Save'}
                    </button>
                    <button onClick={onClose} className="text-white bg-black rounded-md">
                        Cancel
                    </button>
                </div>
            </div>

        </Modal>
    );
};

export default CreateCategoryModal;
