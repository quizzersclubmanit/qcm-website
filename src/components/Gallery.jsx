import React, { useState } from 'react';
import '../utils/styles.css';

const team = Array(18).fill({
  member: "LOREM IPSUM",
  role: "Post or Designation",
  picture: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200&d=identicon&r=PG"
});

const Team = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div style={styles.body}>
      <div style={styles.header}>
        <div
          style={{ ...styles.button, ...(hoveredButton === 'Final Year' ? styles.buttonHover : {}) }}
          onMouseEnter={() => setHoveredButton('Final Year')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Final Year
        </div>
        <h1 style={styles.title}>Team</h1>
        <div
          style={{ ...styles.button, ...(hoveredButton === 'Pre-Final Year' ? styles.buttonHover : {}) }}
          onMouseEnter={() => setHoveredButton('Pre-Final Year')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Pre-Final Year
        </div>
      </div>
      <div style={styles.container}>
        {team.map((obj, index) => (
          <div
            key={index}
            style={{ ...styles.card, ...(hoveredIndex === index ? styles.cardHover : {}) }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img src={obj.picture} alt="Member" style={styles.cardImg} />
            <h3>{obj.member}</h3>
            <p>{obj.role}</p>
          </div>
        ))}
      </div>
    </div>
  );


};

export default Team;

