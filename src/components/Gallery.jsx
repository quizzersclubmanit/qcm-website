import React, { useState } from 'react';

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

const styles = {
  body: {
    color: '#fff',
    backgroundColor: 'black',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    margin: 0
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: '100px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '80px'
  },
  button: {
    padding: '7px 17.5px',
    borderRadius: '30px',
    cursor: 'pointer',
    border: '2px solid #5c5b5b',
    fontSize: '17px',
    transition: 'background-color 0.3s, color 0.3s'
  },
  buttonHover: {
    color: '#d99507',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  title: {
    fontSize: '62.5px',
    marginBottom: '-5px',
    fontWeight: 'bold',

  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px'
  },
  card: {
    borderRadius: '10px',
    padding: '10px',
    textAlign: 'center',
    width: '237px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    margin: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardHover: {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  cardImg: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    margin: '10px',
    marginBottom: '30px'
  }
};

export default Team;

