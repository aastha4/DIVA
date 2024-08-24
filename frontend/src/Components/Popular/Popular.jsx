import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/recommended")
            .then((response) => response.json())
            .then((data) => setRecommendedProducts(data))
            .catch((error) => console.error("Error fetching recommended products:", error));
    }, []);

    return (
        <div className="popular">
            <h1>Most Visited Products</h1>
            <hr />
            <div className="popular-item">
                {recommendedProducts.map((item) => (
                    <Item
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        new_price={item.new_price}
                        old_price={item.old_price}
                    />
                ))}
            </div>
        </div>
    );
};

export default Popular;
