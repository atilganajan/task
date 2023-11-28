import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './styles/EditModal.css';
import Loader from './Loader';
import axios from "axios";
import Swal from "sweetalert2";

const EditModal = ({ isOpen, onClose, handleEdit, articleId }) => {
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {

            const token = localStorage.getItem('jwtToken');

            try {
                const response = await axios.get(`http://localhost:8000/api/admin/article/${articleId}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setNewTitle(response.data.article.title);
                setNewDescription(response.data.article.description);
                setIsLoading(false);
            } catch (error) {

                setNewTitle("");
                setNewDescription("");

                Swal.fire({
                    position: "center",
                    icon: 'error',
                    title: 'Not found',
                    text: "Article Not Found",

                });

            }
        };

        if (isOpen) {
            setIsLoading(true);
            fetchData();
        }
    }, [isOpen, articleId]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            await handleEdit(articleId, newTitle, newDescription);

            onClose();
        } catch (error) {
            console.error('Error while editing article:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            appElement={document.getElementById('root')}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Modal"
            className="custom-modal"
        >
            <div className="bg-white rounded-md p-8">
                <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
                <div className="mb-4">
                    <label htmlFor="newTitle" className="block text-sm font-medium text-gray-700">New Title:</label>
                    <input
                        type="text"
                        id="newTitle"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="newDescription" className="block text-sm font-medium text-gray-700">New Description:</label>
                    <textarea
                        id="newDescription"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader /> : 'Save'}
                    </button>
                    <button
                        onClick={onClose}
                        className="text-white bg-black rounded-md"

                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditModal;
