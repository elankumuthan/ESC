import React from 'react';
import { render, screen } from '@testing-library/react';
import DestinationCards from 'client/src/Components/DestinationCards.js';

test('renders all destination cards', () => {
  const mockDestinations = [
    { img: 'image1.jpg', name: 'Singapore', title: 'Marina Bay Sands', handleClick: jest.fn() },
    { img: 'image2.jpg', name: 'Kyoto, Japan', title: 'Chureito Pagoda', handleClick: jest.fn() },
    { img: 'image3.jpg', name: 'Seoul, Korea', title: 'Gyeongbokgung Palace', handleClick: jest.fn() },
  ];

  mockDestinations.forEach(destination => {
    render(
      <DestinationCards
        img={destination.img}
        name={destination.name}
        title={destination.title}
        handleClick={destination.handleClick}
      />
    );
  });

  mockDestinations.forEach(destination => {
    expect(screen.getByText(destination.name)).toBeInTheDocument();
    expect(screen.getByText(destination.title)).toBeInTheDocument();
  });
});