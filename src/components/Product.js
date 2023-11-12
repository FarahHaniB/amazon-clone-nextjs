import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket } from "@/slices/basketSlice";

const MAX_RATING = 5;
const MIN_RATING = 1;

const Product = ({ id, title, price, description, category, image }) => {
  const dispatch = useDispatch();

  const [rating] = useState(
    Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  );

  const [hasPrime] = useState(Math.random() < 0.5);

  const addItemToBasket = () => {
    const product = {
      id,
      title,
      price,
      rating,
      description,
      category,
      image,
      hasPrime
    };

    //Sending the product as an action to the REDUX store... the basket slice
    dispatch(addToBasket(product));
  };

  // const [hasMounted, setHasMounted] = useState(false);

  // useEffect(() => {
  //   setHasMounted(true); //<-- toggle on client-side, because useEffect doesn't run on server-side/during SSG build
  // }, []);

  return (
    <>
      <div className="relative flex flex-col m-5 bg-white z-30 p-10">
        <p className="absolute top-2 right-2 text-xs italic text-gray-400">
          {category}
        </p>

        <div className="box-border h-64 w-full flex items-center justify-center">
          <Image
            src={image}
            height={100}
            width={200}
            objectFit="contain"
            // sizes="100vw"
            alt="product"
            className="max-h-64"
          />
        </div>

        <h4 className="my-3">{title}</h4>

        {/* Only render the StarIcons on client-side, as hasMounted will always be flase on server-side */}
        {/* {hasMounted && ( */}
          <div className="flex">
            {Array(rating)
              .fill()
              .map((_, i) => (
                <StarIcon key={i} className="h-5 text-yellow-500" />
              ))}
          </div>
        {/* )} */}

        <p className="text-xs my-2 line-clamp-2">{description}</p>

        <div className="mb-5">
          <Currency quantity={price} currency="MYR" />
        </div>

        {hasPrime && (
          <div className="flex items-center space-x-2 -mt-5 mb-4">
            <Image
              src="/amazon-prime.png"
              width={100}
              height={40}
              alt="prime logo"
              className="w-12"
            />
            <p className="text-xs text-gray-500">FREE Next day delivery</p>
          </div>
        )}

        <button onClick={addItemToBasket} className="mt-auto button">
          Add to Basket
        </button>
      </div>
    </>
  );
};

export default Product;
