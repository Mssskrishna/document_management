import React from "react";

const Card = ({ image, title, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4  w-72 text-center ">
      <img src={image} alt={title} className="w-full h-40 object-cover rounded-lg" />
      <h2 className="text-xl font-bold mt-4">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

const Cards = () => {
  const cardData = [
    {
      image: "https://logowik.com/content/uploads/images/student5651.jpg", // Replace with actual image URL
      title: "Card 1",
      description: "This is the description for card 1.",
    },
    {
      image: "https://logowik.com/content/uploads/images/student5651.jpg",
      title: "Card 2",
      description: "This is the description for card 2.",
    },
    {
      image: "https://logowik.com/content/uploads/images/student5651.jpg",
      title: "Card 3",
      description: "This is the description for card 3.",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen bg-gray-700 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
        {cardData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Cards;
