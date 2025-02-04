'use client'
import styles from './styles.module.css';
import FormComponent from '../components/FormComponent';

const HomePage = () => {
  return (
    <div>
      <h1 className={styles.maintitle}> Patient Scenario Data</h1>
      <FormComponent />
    </div>
  );
};

export default HomePage;
