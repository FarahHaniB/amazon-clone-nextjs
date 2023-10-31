import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Currency from "react-currency-formatter";
// import { prime } from "../../public/amazon-prime.png";

const MAX_RATING = 5;
const MIN_RATING = 1;

const Product = ({ id, title, price, description, category, image }) => {
  const [rating] = useState(
    Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  );

  const [hasPrime] = useState(Math.random() < 0.5);

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10">
      <p>{category}</p>

      <Image src={image} height={100} width={100} objectFit="contain" />

      <h4>{title}</h4>

      <div className="flex">
        {Array(rating)
          .fill()
          .map((_, i) => (
            <StarIcon className="h-5" />
          ))}
      </div>

      <p>{description}</p>

      <div>
        <Currency quantity={price} currency="GBP" />
      </div>

      {hasPrime && (
        <div>
          {/* <img src={prime} alt=""/> */}
          <p>FREE Next day delivery</p>
        </div>
      )}

      <button>Add to Basket</button>
    </div>
  );
};

export default Product;
