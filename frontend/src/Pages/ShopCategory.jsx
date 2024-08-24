import React, { useContext, useState, useEffect } from 'react';
import './CSS/ShopCategory.css';  // Assuming other styles are in this file
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    let sorted = [...all_product];

    if (sortOrder === 'price-asc') {
      sorted.sort((a, b) => a.new_price - b.new_price);
    } else if (sortOrder === 'price-desc') {
      sorted.sort((a, b) => b.new_price - a.new_price);
    } else if (sortOrder === 'discounted') {
      sorted.sort((a, b) => {
        // Calculate discount percentage
        const discountA = (a.old_price - a.new_price) / a.old_price;
        const discountB = (b.old_price - b.new_price) / b.old_price;
        return discountB - discountA; // Most discounted first
      });
    }

    setSortedProducts(sorted);
  }, [all_product, sortOrder]);

  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const filteredProducts = sortedProducts.filter(item => item.category === props.category);

  return (
    <div className="shop-category">
      <img className='shopcategory-banner' src={props.banner} alt='' />

      <div className="shopcategory-indexSort">
        <p className="product-info">
          <span>
            Showing 1-{filteredProducts.length}
          </span>
          out of {filteredProducts.length} products
        </p>
        <div className="sortby-button-container">
          <div className="sortby-button" onClick={toggleDropdown}>
            Sort by
            <img className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} src={dropdown_icon} alt='' />
          </div>
          <div className={`sortby-dropdown ${isDropdownOpen ? '' : 'hidden'}`}>
            <div 
              className={`sortby-dropdown-option ${sortOrder === 'price-asc' ? 'selected' : ''}`}
              onClick={() => handleSortChange('price-asc')}
            >
              Price Low-High
            </div>
            <div 
              className={`sortby-dropdown-option ${sortOrder === 'price-desc' ? 'selected' : ''}`}
              onClick={() => handleSortChange('price-desc')}
            >
              Price High-Low
            </div>
            <div 
              className={`sortby-dropdown-option ${sortOrder === 'discounted' ? 'selected' : ''}`}
              onClick={() => handleSortChange('discounted')}
            >
              Most Discounted
            </div>
          </div>
        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.map((item, i) => (
          <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            image={item.image} 
            new_price={item.new_price} 
            old_price={item.old_price} 
          />
        ))}
      </div>

      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
}

export default ShopCategory;
