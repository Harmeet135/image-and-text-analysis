import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = ({ uploadSuccess }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/gettasks`);
      const sortedTasks = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [uploadSuccess]);

  return (
    <div className="mt-6">
      <h1 className="text-white my-10 text-center text-4xl font-bold">History</h1>
      <div className="flex flex-wrap justify-center">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded-lg shadow-md flex flex-row items-center m-4" style={{ width: '700px' }}>
           <img src={`${process.env.REACT_APP_API_URL}/${task.image}`} alt="Uploaded" className="w-1/2 max-h-60 rounded-lg mr-4" />
            <div className="w-1/2">
              <p className="text-gray-700 overflow-y-auto max-h-60">
                {task.extractedText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
