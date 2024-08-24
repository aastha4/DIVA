import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };

  const filteredProducts = allproducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="listproduct-format-main">
        <p>Product Image</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Available Sizes</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        {filteredProducts.map((product) => (
          <div key={product.id}>
            <div className="listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <div className="listproduct-sizes">
                <p>{product.sizes ? `${product.sizes.length} sizes` : '0 sizes'}</p>
                {product.sizes && product.sizes.length > 0 && (
                  <div className="sizes-tooltip">
                    {product.sizes.join(', ')}
                  </div>
                )}
              </div>
              <div className="listproduct-remove-container">
                <img
                  onClick={() => remove_product(product.id)}
                  className='listproduct-remove-icon'
                  src={cross_icon}
                  alt=""
                />
              </div>
            </div>
            <hr className="product-divider" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
