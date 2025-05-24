import styles from './styles.module.css';

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

const FormComponent = ({
  formData,
  onFormChange,
  hideSubmitButton = false,
  wrapInForm = true,
  onSubmit,
}) => {
  
  // Use the parent's formData and onFormChange instead of creating local state.
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Propagate change to parent
    if (onFormChange) {
      onFormChange(name, value);
    }
  };

  const content = (
    <>
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
        placeholder="Height (inches)"
        required
      />
      <FormField
        type="text"
        name="weight"
        value={formData.weight}
        onChange={handleChange}
        placeholder="Weight (lbs)"
        required
      />
      {!hideSubmitButton && (
        <button className={styles.submitbutton} type="submit">
          Submit
        </button>
      )}
    </>
  );

  return wrapInForm ? (
    <div className={styles.formcontainer}>
      <form onSubmit={onSubmit}>
        {content}
      </form>
    </div>
  ) : (
    <div className={styles.formcontainer}>
      {content}
    </div>
  );
};

export default FormComponent;
