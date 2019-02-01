import React from 'react';

const FreeCourse = ({style = {}}) => (
  <div style={{ padding: 20, margin: '20px -20px 0', paddingBottom: 1, backgroundColor: '#E6F6FF', ...style }}>
    <p>Free online course coming soon! <strong>Setup a Magento Development Environment with Docker</strong> &nbsp;&middot;&nbsp; Signup at <a href="https://learnm2.com" target="_blank">learnm2.com</a></p>
  </div>
);

export default FreeCourse;
