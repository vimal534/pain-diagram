import React from 'react';
import PainDiagram from '../components/PainDiagram';

export default function App() {
  return (
    <PainDiagram
      onComplete={(state) => {
        console.log('Pain diagram submitted:', state);
        alert('Submitted! Check console for data.');
      }}
      onBack={() => {
        console.log('Back pressed from root');
      }}
    />
  );
}
