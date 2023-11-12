import { addToBasket, removeFromBasket } from "@/slices/basketSlice";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";

const CheckoutProducts = ({
  id,
  title,
  price,
  rating,
  description,
  category,
  image,
  hasPrime,
}) => {
  const dispatch = useDispatch();

  const addItemToBasket = () => {
    const product = {
      id,
      title,
      price,
      rating,
      description,
      category,
      image,
      hasPrime,
    };
    dispatch(addToBasket(product));
  };

  const removeItemFromBasket = () => {
    const product = {
      id,
      title,
      price,
      rating,
      description,
      category,
      image,
      hasPrime,
    };
    dispatch(removeFromBasket(product));
  };
  return (
    <div className="grid grid-cols-5">
      <div className="box-border h-52 w-full flex items-center justify-center">
        <Image
          src={image}
          alt="checkout product"
          height={80}
          width={120}
          objectFit="contain"
          className="max-h-52"

        />
      </div>
      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <StarIcon key={i} className="h-5 text-yellow-500" />
            ))}
        </div>

        <p className="text-xs my-2 line-clamp-3">{description}</p>
        <Currency quantity={price} currency="MYR" />

        {hasPrime && (
          <div className="flex items-center space-x-2">
            <Image
              loading="lazy"
              src="/amazon-prime.png"
              width={100}
              height={40}
              alt="prime logo"
              className="w-12"
            />
            <p className="text-xs text-gray-500">FREE Next day delivery</p>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        <button onClick={addItemToBasket} className="button">
          Add to Basket
        </button>
        <button onClick={removeItemFromBasket} className="button">
          Remove from Basket
        </button>
      </div>
    </div>
  );
};

export default CheckoutProducts;
