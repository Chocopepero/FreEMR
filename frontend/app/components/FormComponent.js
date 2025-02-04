import styles from './styles.module.css'
import { useState } from 'react';

const FormField = ({ type, name, value, onChange, placeholder, required }) => (
  <input
    className={styles.textinput}
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
  />
);


const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    sex: '',
    patient_id: '',
    room_num: '',
    height: '',
    weight: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/submit-form/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Form submitted successfully');
      } else {
        alert('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className={styles.formcontainer}>
      <form onSubmit={handleSubmit}>
        <FormField
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <FormField
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          placeholder="Date of Birth"
          required
        />
        <FormField
          type="text"
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          placeholder="Sex"
          required
        />
        <FormField
          type="text"
          name="patient_id"
          value={formData.patient_id}
          onChange={handleChange}
          placeholder="Patient ID"
          required
        />
        <FormField
          type="text"
          name="room_num"
          value={formData.room_num}
          onChange={handleChange}
          placeholder="Room Number"
          required
        />
        <FormField
          type="text"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Height"
          required
        />
        <FormField
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder= "Weight"
          required
        />
        <button className={styles.submitbutton} type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormComponent;