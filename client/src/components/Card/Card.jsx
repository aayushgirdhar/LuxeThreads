import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../redux/wishlistReducer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./Card.css";
import { makeRequest } from "../../../makeRequest";

const Card = ({ item, close }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const isExist = wishlist.find((product) => product._id === item._id);

  const handleFavorite = async () => {
    try {
      const res = await makeRequest.post(`/user/wishlist/${item._id}`);

      if (res.status === 200) {
        dispatch(addToWishlist(item));
      }
    } catch (err) {
      if (err.response.status == 409) {
        const removeRes = await makeRequest.delete(
          `/user/wishlist/${item._id}`
        );
        if (removeRes.status === 200) {
          dispatch(removeFromWishlist(item._id));
        }
      }
    }
  };

  return (
    <>
      <div className="card-wrapper">
        <Link className="link" to={`/product/${item._id}`}>
          <div className="card" onClick={close}>
            <div className="card-img">
              {item.isNewProduct && <span>New Season</span>}
              <img src={item.images[0]} className="first" />
              <img src={item.images[1]} className="second" />
            </div>
            <h2>{item.title}</h2>
          </div>
        </Link>
        <div className="prices">
          <h3 className="old-price price">₹{item.price + 300}</h3>
          <h3 className="price">₹{item.price}</h3>
          <FavoriteIcon
            className={`favorite ${isExist ? "wishlisted" : ""}`}
            onClick={handleFavorite}
          />
        </div>
      </div>
    </>
  );
};

export default Card;
