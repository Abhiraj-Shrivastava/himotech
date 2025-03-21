import React, { useState } from 'react';
import img from '../../assets/india.png'

const MembersManagement = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [village, setVillage] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, phoneNumber, village, gender: selectedGender });
    // Add your submit logic here
  };

  // Custom text field component using your provided styling approach
  const CustomTextField = ({ label, value, onChange, placeholder, required, customStyles }) => {
    return (
      <div>
        <label className="block text-gray-500 mb-2">{label}</label>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none ${customStyles}`}
          style={{
            borderColor: '#E6E6E6',
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}
        />
      </div>
    );
  };

  return (
    <div className=" p-8 mx-auto">
      <h1 className=" mt-10 text-2xl font-medium text-center mb-8">Members Management</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomTextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
          />

          <div>
            <label className="block text-gray-500 mb-2">Phone Number</label>
            <div className="flex">
              <div className="flex items-center bg-white border border-gray-300 rounded-l-lg px-2">
                <img src={img} alt="India Flag" className="mr-1 w-6" />
                <span className="text-gray-600 mr-2">+91</span>

              </div>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Type here"
                required
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-r-lg focus:outline-none"
                style={{
                  borderColor: '#E6E6E6',
                  backgroundColor: '#fff',
                }}
              />
            </div>
          </div>

          <CustomTextField
            label="Village"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            required={true}
          />

          <div>
            <label className="block text-gray-500 mb-2">Gender</label>
            <input
              type="text"
              value={selectedGender}
              readOnly
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
              style={{
                borderColor: '#E6E6E6',
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}
            />

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md bg-[#B9B1B1] text-white`}
                onClick={() => setSelectedGender('Male')}
              >
                Male
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md bg-[#B9B1B1] text-white`}
                onClick={() => setSelectedGender('Female')}
              >
                Female
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md bg-[#B9B1B1] text-white`}
                onClick={() => setSelectedGender('Others')}
              >
                Others
              </button>
            </div>

          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
          >
            Add Members
          </button>
        </div>
      </form>
    </div>
  );
};

export default MembersManagement;