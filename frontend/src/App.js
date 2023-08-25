import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 

function App() {
  const [reminderMsg, setReminderMsg] = useState("");
  const [remindAt, setRemindAt] = useState(new Date());
  const [reminderList, setReminderList] = useState([]);

  const startDate = new Date();

  useEffect(() => {
    axios.get("http://localhost:9000/getAllReminder")
      .then(res => setReminderList(res.data))
      .catch(error => console.error(error));
  }, []);

  const addReminder = () => {
    axios.post("http://localhost:9000/addReminder", { reminderMsg, remindAt })
      .then(res => setReminderList(res.data))
      .catch(error => console.error(error));
    setReminderMsg("");
    setRemindAt(null);
  };

  const deleteReminder = (id) => {
    axios.post("http://localhost:9000/deleteReminder", { id })
      .then(res => {
        if (res.status === 200) {
          const updatedReminderList = reminderList.filter(reminder => reminder._id !== id);
          setReminderList(updatedReminderList);
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <div className="homepage">
        <div className="homepage_header">
          <h1>Medical Reminder 👨‍⚕️</h1>
          <input type="text"  placeholder="Reminder notes here..." value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} />
          <DatePicker className='dateI'
            value={remindAt}
            selected={remindAt}
            onChange={date => setRemindAt(date)}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          />
          <div className="button" onClick={addReminder}>Add Reminder</div>
        </div>

        <div className="homepage_body">
          {reminderList.map(reminder => (
            <div className="reminder_card" key={reminder._id}>
              <h2>{reminder.reminderMsg}</h2>
              <h3>Remind Me at:</h3>
              <p>{reminder.remindAt ? new Date(reminder.remindAt).toLocaleString(undefined, { timezone: "Asia/Kolkata" }) : ""}</p>
              <div className="button" onClick={() => deleteReminder(reminder._id)}>Delete</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
