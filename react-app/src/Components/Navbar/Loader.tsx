import React from 'react';
import { TailSpin } from 'react-loader-spinner';
import styles from './LoaderStyle.module.scss';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <TailSpin
        color="#7E4AC0" 
        height={80}
        width={80}
      />
    </div>
  );
};

export default Loader;
