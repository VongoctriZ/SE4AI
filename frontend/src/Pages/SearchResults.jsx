import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Item from '../Components/Item/Item';
import './CSS/SearchResults.css';

const SearchResults = () => {
    const { query } = useParams();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [sortCriteria, setSortCriteria] = useState('name');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:4000/product/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setSearchResults(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
        setCurrentPage(1);
    };

    const sortedProducts = [...searchResults].sort((a, b) => {
        switch (sortCriteria) {
            case 'new_price':
                return a.new_price - b.new_price;
            case 'discount':
                return ((a.old_price - a.new_price) / a.old_price) - ((b.old_price - b.new_price) / b.old_price);
            case 'rating':
                return b.rating - a.rating;
            case 'review_counts':
                return b.review_counts - a.review_counts;
            case 'all_time_quantity_sold':
                return b.all_time_quantity_sold - a.all_time_quantity_sold;
            case 'date':
                return new Date(b.date) - new Date(a.date);
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (searchResults.length === 0) {
        return <div>No results found for "{query}"</div>;
    }

    return (
        <div className="search-results-container">
            <div className="search-results-header">
                <p>
                    <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)}</span> of {sortedProducts.length} products
                </p>
                <div className="search-results-sort">
                    <select onChange={handleSortChange} value={sortCriteria}>
                        <option value="name">Name</option>
                        <option value="new_price">Price</option>
                        <option value="discount">Discount</option>
                        <option value="rating">Rating</option>
                        <option value="review_counts">Review Counts</option>
                        <option value="all_time_quantity_sold">Quantity Sold</option>
                        <option value="date">Date</option>
                    </select>
                </div>
            </div>
            <div className="search-results-grid">
                {currentItems.map((item) => (
                    <Item
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.thumbnail_url}
                        new_price={item.new_price}
                        old_price={item.old_price}
                    />
                ))}
            </div>
            <div className="search-results-pagination">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                <span>Page {currentPage} of {Math.ceil(sortedProducts.length / itemsPerPage)}</span>
                <button disabled={currentPage === Math.ceil(sortedProducts.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </div>
        </div>
    );
};

export default SearchResults;
